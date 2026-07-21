from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from typing import List

from app.core.database import get_db
from app.models.domain_models import Usuario
from app.schemas.operacion import RegistroMedicoCreate, RegistroMedicoResponse
from app.repositories import crud_medico
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/", response_model=RegistroMedicoResponse, status_code=status.HTTP_201_CREATED)
async def registrar_vacuna(
    registro_in: RegistroMedicoCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    try:
        nuevo_registro = await crud_medico.create_registro_medico(
            db=db, registro_in=registro_in, usuario_id=current_user.id
        )
        return nuevo_registro
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El bovino ya recibió esta vacuna en la fecha indicada."
        )

@router.get("/bovino/{bovino_id}", response_model=List[RegistroMedicoResponse])
async def obtener_historial_medico(
    bovino_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    return await crud_medico.get_historial_medico_bovino(
        db=db, bovino_id=bovino_id, skip=skip, limit=limit
    )

@router.get("/", response_model=List[RegistroMedicoResponse])
async def listar_registros_medicos(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=1000),
    db: AsyncSession = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Devuelve todo el historial médico del hato."""
    return await crud_medico.get_registros_medicos(
        db=db, skip=skip, limit=limit
    )