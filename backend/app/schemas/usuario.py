from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from app.models.domain_models import RolUsuario
from typing import Optional

class UsuarioBase(BaseModel):
    username: str = Field(..., min_length=4, max_length=50, description="Nombre de usuario único")
    rol: RolUsuario
    activo: bool = True

class UsuarioCreate(UsuarioBase):
    """Esquema usado cuando el Dueño registra a un nuevo Caporal"""
    password: str = Field(..., min_length=8, max_length=72, description="Contraseña en texto plano a ser hasheada")
    
    model_config = ConfigDict(extra="forbid")

class UsuarioUpdate(BaseModel):
    """Esquema para actualizaciones parciales (PATCH)"""
    username: Optional[str] = Field(None, min_length=4, max_length=50, description="Nuevo nombre de usuario")
    password: Optional[str] = Field(None, min_length=8, description="Nueva contraseña en texto plano")
    rol: Optional[RolUsuario] = None
    activo: Optional[bool] = None

    model_config = ConfigDict(extra="forbid")

class UsuarioResponse(UsuarioBase):
    """Esquema usado para enviar datos al Frontend sin exponer el password_hash"""
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)