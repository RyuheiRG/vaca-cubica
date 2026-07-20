from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional
from decimal import Decimal
from app.models.domain_models import SexoBovino, EstadoBovino

class BovinoBase(BaseModel):
    arete: str = Field(..., min_length=2, max_length=20, description="Código de identificación físico")
    nombre: Optional[str] = Field(None, max_length=100)
    fecha_nacimiento: Optional[date] = None
    fecha_ingreso: date = Field(..., description="Fecha de llegada al rancho de engorda")
    peso_ingreso: Decimal = Field(..., gt=0, decimal_places=2, description="Peso inicial en kg")
    sexo: SexoBovino
    raza_id: int = Field(..., gt=0)
    estado: EstadoBovino = EstadoBovino.activo
    es_semental: bool = False

class BovinoCreate(BovinoBase):
    model_config = ConfigDict(extra="forbid")

class BovinoUpdate(BaseModel):
    nombre: Optional[str] = Field(None, max_length=100)
    estado: Optional[EstadoBovino] = None
    es_semental: Optional[bool] = None
    
    model_config = ConfigDict(extra="forbid")

class BovinoResponse(BovinoBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)