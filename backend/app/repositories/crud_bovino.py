from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.models.domain_models import Bovino, EstadoBovino
from app.schemas.bovino import BovinoCreate, BovinoUpdate

async def get_bovino(db: AsyncSession, bovino_id: int) -> Bovino | None:
    """Obtiene un bovino por su Primary Key (ID)."""
    return await db.get(Bovino, bovino_id)

async def get_bovino_by_arete(db: AsyncSession, arete: str) -> Bovino | None:
    """Busca un bovino por su arete. Usado como radar de colisiones (Unique)."""
    stmt = select(Bovino).where(Bovino.arete == arete)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def get_bovinos(
    db: AsyncSession, 
    skip: int = 0, 
    limit: int = 100, 
    estado: Optional[EstadoBovino] = None
) -> List[Bovino]:
    """
    Obtiene la lista de bovinos con paginación.
    Permite filtrar opcionalmente por estado (ej. solo 'activo').
    """
    stmt = select(Bovino).offset(skip).limit(limit)
    
    if estado:
        stmt = stmt.where(Bovino.estado == estado)
        
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def create_bovino(db: AsyncSession, bovino_in: BovinoCreate) -> Bovino:
    """
    Desempaqueta el DTO de Pydantic y materializa la entidad en MySQL.
    """
    bovino_data = bovino_in.model_dump()
    db_bovino = Bovino(**bovino_data)
    
    db.add(db_bovino)
    await db.commit()
    await db.refresh(db_bovino)
    
    return db_bovino

async def update_bovino(
    db: AsyncSession, 
    db_bovino: Bovino, 
    bovino_in: BovinoUpdate
) -> Bovino:
    """
    Aplica una actualización parcial (Patch).
    Solo modifica los campos que el cliente envió explícitamente.
    """
    update_data = bovino_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_bovino, field, value)
        
    db.add(db_bovino)
    await db.commit()
    await db.refresh(db_bovino)
    
    return db_bovino