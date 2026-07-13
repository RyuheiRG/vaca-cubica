from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import Parto, Cria
from app.schemas.reproductivo import PartoCreate, CriaCreate, CriaUpdate

async def create_parto(db: AsyncSession, parto_in: PartoCreate, usuario_id: int) -> Parto:
    db_parto = Parto(**parto_in.model_dump(), usuario_id=usuario_id)
    db.add(db_parto)
    await db.commit()
    await db.refresh(db_parto)
    return db_parto

async def get_partos(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Parto]:
    stmt = select(Parto).order_by(Parto.fecha_parto.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_cria(db: AsyncSession, cria_in: CriaCreate) -> Cria:
    db_cria = Cria(**cria_in.model_dump())
    db.add(db_cria)
    await db.commit()
    await db.refresh(db_cria)
    return db_cria

async def get_cria(db: AsyncSession, cria_id: int) -> Cria | None:
    return await db.get(Cria, cria_id)

async def get_crias_por_parto(db: AsyncSession, parto_id: int) -> List[Cria]:
    stmt = select(Cria).where(Cria.parto_id == parto_id)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def update_cria(db: AsyncSession, db_cria: Cria, cria_in: CriaUpdate) -> Cria:
    """Aplica actualizaciones parciales (ej. cambio de salud o vinculación a Bovino)."""
    update_data = cria_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_cria, field, value)
        
    db.add(db_cria)
    await db.commit()
    await db.refresh(db_cria)
    return db_cria