from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.domain_models import Usuario
from app.schemas.usuario import UsuarioCreate
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
        password_hash=get_password_hash(user_in.password), # Mutación criptográfica
        rol=user_in.rol,
        activo=user_in.activo
    )
    
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user) # Recarga el objeto para obtener el ID y timestamps generados
    
    return db_user