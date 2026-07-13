from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.core.config import settings

# Motor asíncrono con pool de conexiones optimizado
engine = create_async_engine(
    settings.database_url,
    echo=False, # Ponlo en True si necesitas auditar las queries SQL crudas en la consola
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=False, # APAGAR EL PRE-PING (Evita el TypeError de asyncmy)
    pool_recycle=3600 # Recicla conexiones cada hora para evitar timeouts
)

# Fábrica de sesiones para los endpoints
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False
)

# Base para mapear los modelos de dominio
Base = declarative_base()

# Dependencia (Inyección de dependencias para las rutas de FastAPI)
async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()