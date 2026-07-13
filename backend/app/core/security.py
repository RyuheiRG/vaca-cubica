from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt  # De PyJWT
import bcrypt
from app.core.config import settings

# Constantes del JWT (Firma estricta)
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compara la contraseña en texto plano con el hash de la BD.
    bcrypt requiere que ambos strings sean convertidos a bytes (utf-8).
    """
    try:
        password_bytes = plain_password.encode('utf-8')
        hash_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except ValueError:
        # Prevención contra hashes corruptos en la BD
        return False

def get_password_hash(password: str) -> str:
    """
    Genera un hash irreversible nativo.
    Se inyecta un 'salt' aleatorio para prevenir ataques de Rainbow Tables.
    """
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    
    # Decodificamos a string para poder guardarlo en el VARCHAR(255) de MySQL
    return hashed_bytes.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Genera el JSON Web Token (JWT) firmado usando PyJWT moderno."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    
    # PyJWT moderno devuelve directamente un string, no un objeto de bytes
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt