from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models.domain_models import RegistroMedico
from app.schemas.operacion import RegistroMedicoCreate

async def create_registro_medico(
    db: AsyncSession, 
    registro_in: RegistroMedicoCreate, 
    usuario_id: int
) -> RegistroMedico:
    """Materializa un registro de vacunación, inyectando la firma del JWT."""
    registro_data = registro_in.model_dump()
    db_registro = RegistroMedico(**registro_data, usuario_id=usuario_id)
    
    db.add(db_registro)
    await db.commit()
    await db.refresh(db_registro)
    
    return db_registro

async def get_historial_medico_bovino(
    db: AsyncSession, 
    bovino_id: int,
    skip: int = 0, 
    limit: int = 100
) -> List[RegistroMedico]:
    """Obtiene el historial de vacunas de un bovino, ordenado por fecha."""
    stmt = (
        select(RegistroMedico)
        .where(RegistroMedico.bovino_id == bovino_id)
        .order_by(RegistroMedico.fecha_aplicacion.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())

async def get_registros_medicos(
    db: AsyncSession,
    skip: int = 0,
    limit: int = 100
) -> List[RegistroMedico]:
    """Obtiene el historial de vacunas global, ordenado por fecha de aplicación."""
    stmt = (
        select(RegistroMedico)
        .order_by(RegistroMedico.fecha_aplicacion.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(result.scalars().all())
