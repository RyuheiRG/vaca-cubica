from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import Raza
from app.schemas.catalogo import RazaCreate

async def get_raza(db: AsyncSession, raza_id: int) -> Raza | None:
    """Obtiene una raza por su ID."""
    return await db.get(Raza, raza_id)

async def get_raza_by_nombre(db: AsyncSession, nombre: str) -> Raza | None:
    """Radar de colisiones: Busca una raza por su nombre exacto."""
    stmt = select(Raza).where(Raza.nombre == nombre)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()

async def get_razas(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Raza]:
    """Obtiene el catálogo de razas con paginación."""
    stmt = select(Raza).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def create_raza(db: AsyncSession, raza_in: RazaCreate) -> Raza:
    """Materializa una nueva raza en la base de datos."""
    raza_data = raza_in.model_dump()
    db_raza = Raza(**raza_data)
    
    db.add(db_raza)
    await db.commit()
    await db.refresh(db_raza)
    
    return db_raza