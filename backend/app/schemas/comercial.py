from pydantic import BaseModel, ConfigDict, Field
from datetime import date, datetime
from typing import Optional
from decimal import Decimal

class VentaBase(BaseModel):
    bovino_id: int = Field(..., gt=0, description="ID del bovino a vender")
    cliente_id: int = Field(..., gt=0, description="ID del cliente comprador")
    fecha_venta: date
    precio_final: Decimal = Field(..., gt=0, decimal_places=2)

class VentaCreate(VentaBase):
    model_config = ConfigDict(extra="forbid")

class VentaResponse(VentaBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class RentaBase(BaseModel):
    bovino_id: int = Field(..., gt=0, description="ID del semental")
    cliente_id: int = Field(..., gt=0, description="ID del cliente arrendatario")
    fecha_inicio: date
    fecha_fin: Optional[date] = None
    costo_total: Decimal = Field(..., gt=0, decimal_places=2)

class RentaCreate(RentaBase):
    model_config = ConfigDict(extra="forbid")

class RentaResponse(RentaBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)