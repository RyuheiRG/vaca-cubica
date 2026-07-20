from pydantic import BaseModel, ConfigDict, Field
from decimal import Decimal

class RazaBase(BaseModel):
    nombre: str = Field(..., max_length=50)
    peso_promedio_adulto: Decimal = Field(..., gt=0, decimal_places=2)

class RazaCreate(RazaBase):
    model_config = ConfigDict(extra="forbid")

class RazaResponse(RazaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class VacunaBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    enfermedad_objetivo: str = Field(..., max_length=100)

class VacunaCreate(VacunaBase):
    model_config = ConfigDict(extra="forbid")

class VacunaResponse(VacunaBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class AlimentoBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    tipo: str = Field(..., max_length=50)

class AlimentoCreate(AlimentoBase):
    model_config = ConfigDict(extra="forbid")

class AlimentoResponse(AlimentoBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class ClienteBase(BaseModel):
    nombre: str = Field(..., max_length=100)
    telefono: str = Field(..., max_length=20)

class ClienteCreate(ClienteBase):
    model_config = ConfigDict(extra="forbid")

class ClienteResponse(ClienteBase):
    id: int
    model_config = ConfigDict(from_attributes=True)