from pydantic import BaseModel
from typing import Optional

class Token(BaseModel):
    """Esquema para la respuesta al hacer Login exitoso"""
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    """Esquema de los datos desencriptados del JWT"""
    sub: Optional[str] = None
    rol: Optional[str] = None