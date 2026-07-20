from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario, Bovino, EstadoBovino
from app.schemas.comercial import VentaCreate, VentaResponse, RentaCreate, RentaResponse
from app.repositories import crud_comercial
from app.api.deps import get_current_user

router_ventas = APIRouter()
router_rentas = APIRouter()

@router_ventas.post("/", response_model=VentaResponse, status_code=status.HTTP_201_CREATED)
async def registrar_venta(
    venta_in: VentaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    bovino = await db.get(Bovino, venta_in.bovino_id)
    
    if not bovino:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bovino no encontrado.")
    if bovino.estado != EstadoBovino.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"No se puede vender un bovino en estado '{bovino.estado.value}'."
        )

    try:
        nueva_venta = await crud_comercial.create_venta(db, venta_in, current_user.id)
        return nueva_venta
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este bovino ya tiene un registro de venta (Violación UNIQUE)."
        )

@router_ventas.get("/", response_model=List[VentaResponse])
async def listar_ventas(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_comercial.get_ventas(db, skip, limit)


@router_rentas.post("/", response_model=RentaResponse, status_code=status.HTTP_201_CREATED)
async def registrar_renta(
    renta_in: RentaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    bovino = await db.get(Bovino, renta_in.bovino_id)
    if not bovino:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bovino no encontrado.")

    if not bovino.es_semental or bovino.sexo.value != "macho" or bovino.estado != EstadoBovino.activo:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Solo bovinos machos, activos y designados como sementales pueden registrarse en renta."
        )

    if renta_in.fecha_fin and renta_in.fecha_fin < renta_in.fecha_inicio:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="La fecha de fin no puede ser anterior a la fecha de inicio."
        )

    nueva_renta = await crud_comercial.create_renta(db, renta_in, current_user.id)
    return nueva_renta

@router_rentas.get("/", response_model=List[RentaResponse])
async def listar_rentas(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_comercial.get_rentas(db, skip, limit)