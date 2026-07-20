from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario
from app.schemas.catalogo import RazaCreate, RazaResponse
from app.repositories import crud_raza
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=RazaResponse, status_code=status.HTTP_201_CREATED)
async def registrar_raza(
    raza_in: RazaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Registra una nueva raza en el catálogo del sistema."""
    raza_existente = await crud_raza.get_raza_by_nombre(db, nombre=raza_in.nombre)
    if raza_existente:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"La raza '{raza_in.nombre}' ya está registrada."
        )
    
    nueva_raza = await crud_raza.create_raza(db, raza_in)
    return nueva_raza

@router.get("/", response_model=List[RazaResponse])
async def listar_razas(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Retorna el catálogo de razas disponibles."""
    razas = await crud_raza.get_razas(db, skip=skip, limit=limit)
    return razas

@router.get("/{raza_id}", response_model=RazaResponse)
async def obtener_raza(
    raza_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtiene los detalles de una raza específica por su ID."""
    raza = await crud_raza.get_raza(db, raza_id=raza_id)
    if not raza:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Raza no encontrada."
        )
    return raza