from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import ValidationError

from app.core.database import get_db
from app.core.security import ALGORITHM, SECRET_KEY
from app.schemas.auth import TokenPayload
from app.models.domain_models import Usuario
from app.repositories import crud_auditoria

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> Usuario:
    """
    Interceptor Zero Trust.
    Desencripta el JWT, valida su integridad y retorna el objeto Usuario.
    Si algo falla (token alterado, expirado, o usuario borrado), bloquea la petición (Perfect Guard).
    """
    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
        
    except (jwt.PyJWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas o token expirado. Inicie sesión nuevamente.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user = await db.get(Usuario, int(token_data.sub))
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="El usuario asociado a este token ya no existe."
        )
        
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Este usuario ha sido desactivado (Baneado)."
        )
        
    return user


async def get_current_dueño(
    current_user: Usuario = Depends(get_current_user),
) -> Usuario:
    """
    Control de Acceso Basado en Roles (RBAC).
    Úsalo en rutas donde SOLO el dueño puede operar (ej. Eliminar usuarios, ver balances financieros).
    """
    if current_user.rol.value != "dueño":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Privilegios insuficientes. Esta acción requiere rol de Dueño."
        )
    return current_user


async def audit_event(
    request: Request,
    current_user: Usuario = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Dependencia de auditoría. 
    Se puede usar en cualquier POST/PATCH/DELETE para registrar la acción.
    """
    # Intentamos leer el body si es una petición con payload
    try:
        body = await request.json()
    except:
        body = {}
        
    await crud_auditoria.registrar_evento(
        db=db,
        usuario_id=current_user.id,
        endpoint=request.url.path,
        metodo=request.method,
        payload=body
    )