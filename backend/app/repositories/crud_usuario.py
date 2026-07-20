from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.domain_models import Usuario
from app.schemas.usuario import UsuarioCreate, UsuarioUpdate
from app.core.security import get_password_hash

async def get_user_by_username(db: AsyncSession, username: str) -> Usuario | None:
    """Busca un usuario por su username. Devuelve None si no existe."""
    stmt = select(Usuario).where(Usuario.username == username)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def create_usuario(db: AsyncSession, user_in: UsuarioCreate) -> Usuario:
    """
    Desempaqueta el DTO de Pydantic, encripta la contraseña (Zero Trust)
    y persiste la entidad en MySQL.
    """
    db_user = Usuario(
        username=user_in.username,
        password_hash=get_password_hash(user_in.password),
        rol=user_in.rol,
        activo=user_in.activo
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user

async def get_usuario_by_id(db: AsyncSession, user_id: int) -> Usuario | None:
    """
    Busca un usuario por su ID primario.
    Utilizamos db.get() porque es la forma más rápida y optimizada 
    en SQLAlchemy para buscar llaves primarias.
    """
    return await db.get(Usuario, user_id)

async def update_usuario(db: AsyncSession, db_user: Usuario, user_in: UsuarioUpdate) -> Usuario:
    """
    Aplica una actualización parcial (PATCH).
    Interpreta el DTO, muta solo los campos enviados y garantiza
    que si hay un cambio de contraseña, esta pase por el motor de encriptación.
    """
    update_data = user_in.model_dump(exclude_unset=True)
    
    if "password" in update_data:
        hashed_password = get_password_hash(update_data["password"])
        del update_data["password"]
        update_data["password_hash"] = hashed_password
        
    for field, value in update_data.items():
        setattr(db_user, field, value)
        
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    return db_user