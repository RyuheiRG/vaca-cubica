from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate, UsuarioResponse
from app.repositories import crud_usuario
from app.models.domain_models import Usuario
from app.api.deps import get_current_user, get_current_dueño

router = APIRouter()

@router.post("/", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def registrar_usuario(
    user_in: UsuarioCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Registra un nuevo usuario en el sistema.
    """
    user_exists = await crud_usuario.get_user_by_username(db, username=user_in.username)
    
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El nombre de usuario ya está registrado en el sistema."
        )
    
    new_user = await crud_usuario.create_usuario(db, user_in)
    
    return new_user

@router.patch("/{user_id}", response_model=UsuarioResponse, status_code=status.HTTP_200_OK)
async def actualizar_usuario(
    user_id: int,
    user_in: UsuarioUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_dueño)
):
    """
    Actualiza parcialmente un usuario (desactivar, cambiar rol, cambiar contraseña).
    """
    db_user = await crud_usuario.get_usuario_by_id(db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")

    if user_in.username and user_in.username != db_user.username:
        user_exists = await crud_usuario.get_user_by_username(db, username=user_in.username)
        if user_exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de usuario ya está en uso.")

    updated_user = await crud_usuario.update_usuario(db, db_user=db_user, user_in=user_in)
    
    return updated_user