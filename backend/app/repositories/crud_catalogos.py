from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import Vacuna, Alimento, Cliente
from app.schemas.catalogo import VacunaCreate, AlimentoCreate, ClienteCreate

async def get_vacunas(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Vacuna]:
    stmt = select(Vacuna).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def create_vacuna(db: AsyncSession, vacuna_in: VacunaCreate) -> Vacuna:
    db_vacuna = Vacuna(**vacuna_in.model_dump())
    db.add(db_vacuna)
    await db.commit()
    await db.refresh(db_vacuna)
    return db_vacuna

async def delete_vacuna(db: AsyncSession, vacuna_id: int) -> bool:
    """Intenta eliminar una vacuna físicamente de la base de datos."""
    db_vacuna = await db.get(Vacuna, vacuna_id)
    if not db_vacuna:
        return False
        
    await db.delete(db_vacuna)
    await db.commit()
    return True


async def get_alimentos(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Alimento]:
    stmt = select(Alimento).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def create_alimento(db: AsyncSession, alimento_in: AlimentoCreate) -> Alimento:
    db_alimento = Alimento(**alimento_in.model_dump())
    db.add(db_alimento)
    await db.commit()
    await db.refresh(db_alimento)
    return db_alimento


async def get_clientes(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Cliente]:
    stmt = select(Cliente).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def create_cliente(db: AsyncSession, cliente_in: ClienteCreate) -> Cliente:
    db_cliente = Cliente(**cliente_in.model_dump())
    db.add(db_cliente)
    await db.commit()
    await db.refresh(db_cliente)
    return db_cliente