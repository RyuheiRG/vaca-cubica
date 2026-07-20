from pydantic import BaseModel, ConfigDict, Field, model_validator
from datetime import date, datetime
from typing import Optional

from app.models.domain_models import TipoBaja

class BajaBovinoBase(BaseModel):
    bovino_id: int = Field(..., gt=0, description="ID del bovino a dar de baja")
    tipo: TipoBaja
    fecha: date
    causa: Optional[str] = Field(None, max_length=150)

class BajaBovinoCreate(BajaBovinoBase):
    model_config = ConfigDict(extra="forbid")

    @model_validator(mode='after')
    def validar_causa_fallecimiento(self):
        if self.tipo == TipoBaja.fallecido and not self.causa:
            raise ValueError("La causa de defunción es obligatoria cuando el tipo de baja es 'fallecido'.")
        
        if self.tipo == TipoBaja.vendido and self.causa:
            self.causa = None 
            
        return self

class BajaBovinoResponse(BajaBovinoBase):
    id: int
    usuario_id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)