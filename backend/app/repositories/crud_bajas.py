from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import BajaBovino, Bovino, EstadoBovino, TipoBaja
from app.schemas.bajas import BajaBovinoCreate

async def create_baja(db: AsyncSession, baja_in: BajaBovinoCreate, usuario_id: int) -> BajaBovino:
    """Ejecuta el registro de la baja y muta el estado del bovino atómicamente."""
    # 1. Preparar la baja
    db_baja = BajaBovino(**baja_in.model_dump(), usuario_id=usuario_id)
    db.add(db_baja)

    # 2. Mutar el estado del bovino
    bovino = await db.get(Bovino, baja_in.bovino_id)
    if bovino:
        if baja_in.tipo == TipoBaja.fallecido:
            bovino.estado = EstadoBovino.fallecido
        elif baja_in.tipo == TipoBaja.vendido:
            bovino.estado = EstadoBovino.vendido
        db.add(bovino)

    # 3. Commit transaccional
    await db.commit()
    await db.refresh(db_baja)
    return db_baja

async def get_bajas(db: AsyncSession, skip: int = 0, limit: int = 100) -> List[BajaBovino]:
    """Obtiene el historial de bajas, ordenado por fecha descendente."""
    stmt = (
        select(BajaBovino)
        .order_by(BajaBovino.fecha.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())