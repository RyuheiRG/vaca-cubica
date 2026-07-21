from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario
from app.schemas.operacion import HistorialPesajeCreate, HistorialPesajeResponse
from app.repositories import crud_pesaje
from app.api.deps import get_current_user

router = APIRouter()


@router.post(
    "/", response_model=HistorialPesajeResponse, status_code=status.HTTP_201_CREATED
)
async def registrar_pesaje(
    pesaje_in: HistorialPesajeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Añade un registro al historial de peso de un bovino."""
    try:
        nuevo_pesaje = await crud_pesaje.create_pesaje(
            db=db, pesaje_in=pesaje_in, usuario_id=current_user.id
        )
        return nuevo_pesaje
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un registro de pesaje para este bovino en la fecha indicada.",
        )


@router.get("/", response_model=List[HistorialPesajeResponse])
async def listar_pesajes(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Devuelve el historial de pesajes de todo el hato (para gráficas/analítica)."""
    pesajes = await crud_pesaje.get_pesajes(db=db, skip=skip, limit=limit)
    return pesajes


@router.get("/bovino/{bovino_id}", response_model=List[HistorialPesajeResponse])
async def obtener_historial_bovino(
    bovino_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Devuelve la cronología de peso de un bovino específico."""
    historial = await crud_pesaje.get_historial_por_bovino(
        db=db, bovino_id=bovino_id, skip=skip, limit=limit
    )
    return historial
