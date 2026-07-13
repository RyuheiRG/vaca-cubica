from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario, Bovino, EstadoBovino
from app.schemas.bajas import BajaBovinoCreate, BajaBovinoResponse
from app.repositories import crud_bajas
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=BajaBovinoResponse, status_code=status.HTTP_201_CREATED)
async def registrar_baja(
    baja_in: BajaBovinoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    # 1. Validar pre-condiciones del Bovino
    bovino = await db.get(Bovino, baja_in.bovino_id)
    if not bovino:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Bovino no encontrado."
        )
        
    if bovino.estado in [EstadoBovino.vendido, EstadoBovino.fallecido]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Operación denegada. El bovino ya se encuentra en estado '{bovino.estado.value}'."
        )

    try:
        # 2. Ejecutar transacción
        nueva_baja = await crud_bajas.create_baja(db, baja_in, current_user.id)
        return nueva_baja
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este bovino ya cuenta con un registro de baja en el sistema."
        )

@router.get("/", response_model=List[BajaBovinoResponse])
async def listar_bajas(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_bajas.get_bajas(db, skip, limit)