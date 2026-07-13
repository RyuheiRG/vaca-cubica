from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional
from decimal import Decimal

from app.models.domain_models import TipoParto, EstadoSaludCria, SexoBovino

class PartoBase(BaseModel):
    madre_id: int = Field(..., gt=0, description="ID de la vaca (Debe ser hembra)")
    fecha_parto: date
    tipo_parto: TipoParto = TipoParto.normal
    observaciones: Optional[str] = Field(None, max_length=500)

class PartoCreate(PartoBase):
    model_config = ConfigDict(extra="forbid")

class PartoResponse(PartoBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class CriaBase(BaseModel):
    arete_provisional: Optional[str] = Field(None, max_length=20)
    parto_id: int = Field(..., gt=0)
    raza_id: int = Field(..., gt=0)
    sexo: SexoBovino
    peso_nacer: Decimal = Field(..., gt=0, decimal_places=2)
    estado_salud: EstadoSaludCria = EstadoSaludCria.excelente

class CriaCreate(CriaBase):
    model_config = ConfigDict(extra="forbid")

class CriaUpdate(BaseModel):
    """Esquema para mutar el estado de salud o promover la cría al inventario oficial."""
    estado_salud: Optional[EstadoSaludCria] = None
    bovino_id: Optional[int] = Field(None, gt=0, description="ID del registro definitivo en la tabla Bovino")
    model_config = ConfigDict(extra="forbid")

class CriaResponse(CriaBase):
    id: int
    bovino_id: Optional[int] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)