from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import HistorialPesaje
from app.schemas.operacion import HistorialPesajeCreate


async def create_pesaje(
    db: AsyncSession, pesaje_in: HistorialPesajeCreate, usuario_id: int
) -> HistorialPesaje:
    """
    Registra un nuevo peso.
    Nota: El usuario_id se inyecta desde el controlador (Zero Trust).
    """
    pesaje_data = pesaje_in.model_dump()
    db_pesaje = HistorialPesaje(**pesaje_data, usuario_id=usuario_id)

    db.add(db_pesaje)
    await db.commit()
    await db.refresh(db_pesaje)

    return db_pesaje


async def get_pesajes(
    db: AsyncSession, skip: int = 0, limit: int = 500
) -> List[HistorialPesaje]:
    """
    Recupera el historial de pesajes de TODO el hato (no filtrado por bovino).
    Se usa para alimentar las gráficas estadísticas/analíticas del frontend
    (p. ej. evolución del peso promedio del hato mes a mes).
    """
    stmt = (
        select(HistorialPesaje)
        .order_by(HistorialPesaje.fecha.asc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())


async def get_historial_por_bovino(
    db: AsyncSession, bovino_id: int, skip: int = 0, limit: int = 100
) -> List[HistorialPesaje]:
    """
    Recupera la curva de crecimiento del bovino, ordenada de más reciente a más antigua.
    """
    stmt = (
        select(HistorialPesaje)
        .where(HistorialPesaje.bovino_id == bovino_id)
        .order_by(HistorialPesaje.fecha.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())
