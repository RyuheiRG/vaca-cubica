from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import DietaDiaria
from app.schemas.operacion import DietaDiariaCreate

async def create_dieta(
    db: AsyncSession, 
    dieta_in: DietaDiariaCreate, 
    usuario_id: int
) -> DietaDiaria:
    """Registra una ración de alimento en el sistema."""
    dieta_data = dieta_in.model_dump()
    db_dieta = DietaDiaria(**dieta_data, usuario_id=usuario_id)
    
    db.add(db_dieta)
    await db.commit()
    await db.refresh(db_dieta)
    
    return db_dieta

async def get_dieta_bovino(
    db: AsyncSession, 
    bovino_id: int,
    skip: int = 0, 
    limit: int = 100
) -> List[DietaDiaria]:
    """Cronología de alimentación del bovino."""
    stmt = (
        select(DietaDiaria)
        .where(DietaDiaria.bovino_id == bovino_id)
        .order_by(DietaDiaria.fecha.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def get_dietas(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[DietaDiaria]:
    """Obtiene el historial global de alimentación."""
    stmt = (
        select(DietaDiaria)
        .order_by(DietaDiaria.fecha.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())