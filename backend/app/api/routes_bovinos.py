from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db
from app.models.domain_models import Usuario, EstadoBovino
from app.schemas.bovino import BovinoCreate, BovinoResponse, BovinoUpdate
from app.repositories import crud_bovino
from app.api.deps import get_current_user, audit_event

router = APIRouter()

@router.post("/", response_model=BovinoResponse, status_code=status.HTTP_201_CREATED)
async def registrar_bovino(
    bovino_in: BovinoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    _ = Depends(audit_event)
):
    """Registra un nuevo bovino en el hato."""
    # 1. Radar de colisiones (Evita el IntegrityError de MySQL)
    bovino_existente = await crud_bovino.get_bovino_by_arete(db, arete=bovino_in.arete)
    if bovino_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El arete físico '{bovino_in.arete}' ya está registrado en el sistema."
        )
    
    # IMPORTANTE: No estamos validando raza_id aquí. 
    # MySQL arrojará un error 500 (Foreign Key Constraint) si envías una raza_id que no existe.
    # En la versión final, el frontend enviará IDs válidos consultando el endpoint de catálogos.
    
    # 2. Inserción
    nuevo_bovino = await crud_bovino.create_bovino(db, bovino_in)
    return nuevo_bovino


@router.get("/", response_model=List[BovinoResponse])
async def listar_bovinos(
    skip: int = Query(0, ge=0, description="Registros a saltar (Paginación)"),
    limit: int = Query(100, ge=1, le=500, description="Límite de registros (Max 500)"),
    estado: Optional[EstadoBovino] = Query(None, description="Filtro opcional por estado"),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Retorna el inventario ganadero con paginación y filtros nativos."""
    bovinos = await crud_bovino.get_bovinos(db, skip=skip, limit=limit, estado=estado)
    return bovinos


@router.get("/{bovino_id}", response_model=BovinoResponse)
async def obtener_bovino(
    bovino_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Retorna el detalle exacto de un bovino por su ID interno."""
    bovino = await crud_bovino.get_bovino(db, bovino_id=bovino_id)
    if not bovino:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bovino no encontrado."
        )
    return bovino


@router.patch("/{bovino_id}", response_model=BovinoResponse)
async def actualizar_bovino(
    bovino_id: int,
    bovino_in: BovinoUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
    _ = Depends(audit_event)
):
    """Actualización parcial (Patch). Ideal para cambiar de 'activo' a 'cuarentena'."""
    bovino = await crud_bovino.get_bovino(db, bovino_id=bovino_id)
    if not bovino:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bovino no encontrado."
        )
    
    bovino_actualizado = await crud_bovino.update_bovino(db, db_bovino=bovino, bovino_in=bovino_in)
    return bovino_actualizado