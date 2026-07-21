from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario
from app.schemas.operacion import DietaDiariaCreate, DietaDiariaResponse
from app.repositories import crud_dieta
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=DietaDiariaResponse, status_code=status.HTTP_201_CREATED)
async def registrar_racion(
    dieta_in: DietaDiariaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    try:
        nueva_dieta = await crud_dieta.create_dieta(
            db=db, dieta_in=dieta_in, usuario_id=current_user.id
        )
        return nueva_dieta
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un registro exacto de esta ración para el bovino en esta fecha."
        )

@router.get("/bovino/{bovino_id}", response_model=List[DietaDiariaResponse])
async def obtener_historial_dieta(
    bovino_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return await crud_dieta.get_dieta_bovino(
        db=db, bovino_id=bovino_id, skip=skip, limit=limit
    )

@router.get("/", response_model=List[DietaDiariaResponse])
async def listar_dietas(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Devuelve todo el historial de alimentación del hato."""
    return await crud_dieta.get_dietas(
        db=db, skip=skip, limit=limit
    )