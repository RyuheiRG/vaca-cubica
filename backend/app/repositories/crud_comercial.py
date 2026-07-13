from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import Venta, Renta, Bovino, EstadoBovino
from app.schemas.comercial import VentaCreate, RentaCreate

async def create_venta(db: AsyncSession, venta_in: VentaCreate, usuario_id: int) -> Venta:
    """Ejecuta la venta y muta el estado del bovino atómicamente."""
    # 1. Creamos el registro de la venta
    db_venta = Venta(**venta_in.model_dump(), usuario_id=usuario_id)
    db.add(db_venta)

    # 2. Mutación de estado del bovino
    bovino = await db.get(Bovino, venta_in.bovino_id)
    if bovino:
        bovino.estado = EstadoBovino.vendido
        db.add(bovino)
        
    # Nota: El registro en la tabla 'baja_bovino' se puede orquestar aquí 
    # o desde un servicio superior para mantener las gráficas exactas.

    # 3. Commit atómico (ambos o ninguno)
    await db.commit()
    await db.refresh(db_venta)
    return db_venta

async def get_ventas(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Venta]:
    stmt = select(Venta).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def create_renta(db: AsyncSession, renta_in: RentaCreate, usuario_id: int) -> Renta:
    db_renta = Renta(**renta_in.model_dump(), usuario_id=usuario_id)
    db.add(db_renta)
    await db.commit()
    await db.refresh(db_renta)
    return db_renta

async def get_rentas(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[Renta]:
    stmt = select(Renta).offset(skip).limit(limit)
    result = await db.execute(stmt)
    return list(result.scalars().all())