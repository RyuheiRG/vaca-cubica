from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from decimal import Decimal

# --- HISTORIAL PESAJE ---
class HistorialPesajeBase(BaseModel):
    bovino_id: int = Field(..., gt=0)
    fecha: date
    peso_kg: Decimal = Field(..., gt=0, decimal_places=2)

class HistorialPesajeCreate(HistorialPesajeBase):
    # Zero Trust: usuario_id se omite intencionalmente. Lo inyecta el token.
    model_config = ConfigDict(extra="forbid")

class HistorialPesajeResponse(HistorialPesajeBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- REGISTRO MÉDICO ---
class RegistroMedicoBase(BaseModel):
    bovino_id: int = Field(..., gt=0)
    vacuna_id: int = Field(..., gt=0)
    fecha_aplicacion: date
    dosis_ml: Decimal = Field(..., gt=0, decimal_places=2)

class RegistroMedicoCreate(RegistroMedicoBase):
    model_config = ConfigDict(extra="forbid")

class RegistroMedicoResponse(RegistroMedicoBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

# --- DIETA DIARIA ---
class DietaDiariaBase(BaseModel):
    bovino_id: int = Field(..., gt=0)
    alimento_id: int = Field(..., gt=0)
    fecha: date
    cantidad_kg: Decimal = Field(..., gt=0, decimal_places=2)

class DietaDiariaCreate(DietaDiariaBase):
    model_config = ConfigDict(extra="forbid")

class DietaDiariaResponse(DietaDiariaBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)