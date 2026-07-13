from sqlalchemy.ext.asyncio import AsyncSession
from app.models.domain_models import LogAuditoria

async def registrar_evento(
    db: AsyncSession, 
    usuario_id: int, 
    endpoint: str, 
    metodo: str, 
    payload: dict
):
    log = LogAuditoria(
        usuario_id=usuario_id,
        endpoint=endpoint,
        metodo=metodo,
        payload=payload
    )
    db.add(log)
    await db.commit()