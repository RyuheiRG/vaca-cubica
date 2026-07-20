from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.domain_models import Usuario
from app.schemas.catalogo import (
    VacunaCreate, VacunaResponse, 
    AlimentoCreate, AlimentoResponse,
    ClienteCreate, ClienteResponse
)
from app.repositories import crud_catalogos
from app.api.deps import get_current_user

router_vacunas = APIRouter()
router_alimentos = APIRouter()
router_clientes = APIRouter()

@router_vacunas.post("/", response_model=VacunaResponse, status_code=status.HTTP_201_CREATED)
async def registrar_vacuna(
    vacuna_in: VacunaCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return await crud_catalogos.create_vacuna(db, vacuna_in)

@router_vacunas.delete("/{vacuna_id}", status_code=status.HTTP_204_NO_CONTENT)
async def eliminar_vacuna(
    vacuna_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """
    Elimina físicamente una vacuna del catálogo. 
    Solo permitido si la vacuna no ha sido aplicada a ningún bovino.
    """
    try:
        eliminado = await crud_catalogos.delete_vacuna(db, vacuna_id)
        if not eliminado:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="La vacuna especificada no existe."
            )
        return None
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Operación denegada. No se puede eliminar esta vacuna porque ya tiene historial de aplicación en bovinos."
        )

@router_vacunas.get("/", response_model=List[VacunaResponse])
async def listar_vacunas(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_catalogos.get_vacunas(db, skip, limit)

# --- ENDPOINTS ALIMENTOS ---
@router_alimentos.post("/", response_model=AlimentoResponse, status_code=status.HTTP_201_CREATED)
async def registrar_alimento(
    alimento_in: AlimentoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return await crud_catalogos.create_alimento(db, alimento_in)

@router_alimentos.get("/", response_model=List[AlimentoResponse])
async def listar_alimentos(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_catalogos.get_alimentos(db, skip, limit)

@router_clientes.post("/", response_model=ClienteResponse, status_code=status.HTTP_201_CREATED)
async def registrar_cliente(
    cliente_in: ClienteCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return await crud_catalogos.create_cliente(db, cliente_in)

@router_clientes.get("/", response_model=List[ClienteResponse])
async def listar_clientes(
    skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db), current_user: Usuario = Depends(get_current_user)
):
    return await crud_catalogos.get_clientes(db, skip, limit)