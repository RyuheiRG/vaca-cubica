from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario, Bovino, SexoBovino, EstadoBovino
from app.schemas.reproductivo import PartoCreate, PartoResponse, CriaCreate, CriaResponse, CriaUpdate
from app.repositories import crud_reproductivo
from app.api.deps import get_current_user

router_partos = APIRouter()
router_crias = APIRouter()

@router_partos.post("/", response_model=PartoResponse, status_code=status.HTTP_201_CREATED)
async def registrar_parto(
    parto_in: PartoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    # 1. Validación Biológica
    madre = await db.get(Bovino, parto_in.madre_id)
    if not madre:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="La vaca especificada no existe.")
    
    if madre.sexo != SexoBovino.hembra:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="Error de consistencia biológica: Un bovino macho no puede registrar un parto."
        )
        
    if madre.estado == EstadoBovino.fallecido or madre.estado == EstadoBovino.vendido:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="No se puede registrar un parto para una vaca que está inactiva (vendida o fallecida)."
        )

    nuevo_parto = await crud_reproductivo.create_parto(db, parto_in, current_user.id)
    return nuevo_parto

@router_partos.get("/", response_model=List[PartoResponse])
async def listar_partos(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_reproductivo.get_partos(db, skip, limit)


@router_crias.post("/", response_model=CriaResponse, status_code=status.HTTP_201_CREATED)
async def registrar_cria(
    cria_in: CriaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    try:
        nueva_cria = await crud_reproductivo.create_cria(db, cria_in)
        return nueva_cria
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Error de integridad. Verifique que el parto existe y el arete provisional no esté duplicado."
        )

@router_crias.get("/parto/{parto_id}", response_model=List[CriaResponse])
async def listar_crias_por_parto(
    parto_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return await crud_reproductivo.get_crias_por_parto(db, parto_id)

@router_crias.patch("/{cria_id}", response_model=CriaResponse)
async def actualizar_cria(
    cria_id: int,
    cria_in: CriaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Endpoint para mutar la salud de la cría o promoverla (asignar bovino_id)."""
    cria = await crud_reproductivo.get_cria(db, cria_id)
    if not cria:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cría no encontrada.")
        
    cria_actualizada = await crud_reproductivo.update_cria(db, cria, cria_in)
    return cria_actualizada