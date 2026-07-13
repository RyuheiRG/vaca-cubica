from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.repositories import crud_usuario

router = APIRouter()

@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(
    user_in: UsuarioCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Registra un nuevo usuario en el sistema.
    """
    # 1. Verificación de colisión (Hitbox Check)
    user_exists = await crud_usuario.get_user_by_username(db, username=user_in.username)
    
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está registrado en el sistema."
        )
    
    # 2. Mutación de estado y delegación al repositorio
    new_user = await crud_usuario.create_usuario(db, user_in)
    
    # FastAPI automáticamente filtra el `password_hash` porque el response_model 
    # (UsuarioResponse) no incluye ese campo en su contrato.
    return new_user

@router.patch("/{user_id}", response_model=UsuarioResponse, status_code=status.HTTP_200_OK)
async def actualizar_usuario(
    user_id: int,
    user_in: UsuarioUpdate,
    db: AsyncSession = Depends(get_db),
    # current_user: Usuario = Depends(get_current_active_user) # Descomentar cuando tengas el middleware de auth
):
    """
    Actualiza parcialmente un usuario (desactivar, cambiar rol, cambiar contraseña).
    """
    # 1. Verificar que el usuario existe
    db_user = await crud_usuario.get_usuario_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    # 2. Validaciones de Negocio (Zero Trust / RBAC)
    # Ejemplo: Un caporal no puede cambiar el rol o estado de otro usuario.
    # if current_user.rol == RolUsuario.caporal and (user_in.rol is not None or user_in.activo is not None):
    #     raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No tienes permisos para modificar roles o estados")

    # 3. Verificación de colisión si se intenta cambiar el username
    if user_in.username and user_in.username != db_user.username:
        user_exists = await crud_usuario.get_user_by_username(db, username=user_in.username)
        if user_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario ya está en uso.")

    # 4. Delegar al repositorio (CRUD)
    # NOTA IMPORTANTE: En tu función crud_usuario.update_usuario, debes interceptar 
    # si viene 'password' en user_in para hashearla con get_password_hash() antes de guardar.
    updated_user = await crud_usuario.update_usuario(db, db_user=db_user, user_in=user_in)
    
    return updated_user