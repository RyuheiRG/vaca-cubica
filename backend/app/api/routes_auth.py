from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.repositories.crud_usuario import get_user_by_username
from app.schemas.auth import Token

router = APIRouter()

@router.post("/login", response_model=Token)
async def login_access_token(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    Endpoint para autenticación de usuarios.
    Valida credenciales y devuelve un JWT (Zero Trust access).
    """
    # 1. Buscamos al usuario en la base de datos
    user = await get_user_by_username(db, username=form_data.username)
    
    # 2. Si no existe o la contraseña (en texto plano vs hash) no cuadra, rechazamos.
    # Usamos el mismo mensaje para ambos casos para evitar "User Enumeration Attacks".
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 3. Verificamos que la cuenta no esté suspendida
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="La cuenta ha sido desactivada"
        )

    # 4. Construimos el payload criptográfico
    jwt_payload = {
        "sub": str(user.id),
        "rol": user.rol.value
    }
    
    # 5. Generamos y firmamos el token
    access_token = create_access_token(data=jwt_payload)
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }