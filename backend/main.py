from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from sqlalchemy import text
from sqlalchemy.exc import IntegrityError
from app.core.database import engine
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_auth import router as auth_router
from app.api.routes_usuarios import router as usuarios_router
from app.api.routes_bovinos import router as bovinos_router
from app.api.routes_razas import router as razas_router
from app.api.routes_pesajes import router as pesajes_router
from app.api.routes_medico import router as medico_router
from app.api.routes_dieta import router as dieta_router
from app.api.routes_catalogos import router_vacunas, router_alimentos, router_clientes
from app.api.routes_comercial import router_ventas, router_rentas
from app.api.routes_reproductivo import router_partos, router_crias
from app.api.routes_bajas import router as bajas_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Iniciando servidor Vaca Cúbica...")
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))
        print("✅ CONEXIÓN A MYSQL (AIOMYSQL) ESTABLECIDA CORRECTAMENTE")
    except Exception as e:
        print(f"❌ ERROR CRÍTICO DE BASE DE DATOS: {e}")
        raise e
    yield

app = FastAPI(
    title="Vaca Cúbica API",
    description="Motor Backend Zero Trust para Sistema de Gestión Ganadera",
    version="1.0.0",
    lifespan=lifespan
)

origenes_permitidos = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://vaca-cubica.vercel.app",
    "https://vacacubica.hopto.org",
    "https://vacacubica-app.hopto.org",
    "http://98.88.237.157",
    # "https://dominio-futuro.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origenes_permitidos,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=409,
        content={
            "detail": "Conflicto de integridad: revisa que las referencias "
                      "(raza, cliente, vacuna, bovino, etc.) existan y que "
                      "no se esté duplicando un valor único."
        },
    )


app.include_router(auth_router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(usuarios_router, prefix="/api/usuarios", tags=["Usuarios"])
app.include_router(bovinos_router, prefix="/api/bovinos", tags=["Bovinos"])
app.include_router(bajas_router, prefix="/api/bajas", tags=["Bovinos"])
app.include_router(pesajes_router, prefix="/api/pesajes", tags=["Operaciones"])
app.include_router(medico_router, prefix="/api/registro-medico", tags=["Operaciones"])
app.include_router(dieta_router, prefix="/api/dieta-diaria", tags=["Operaciones"])
app.include_router(razas_router, prefix="/api/razas", tags=["Catálogos"])
app.include_router(router_vacunas, prefix="/api/vacunas", tags=["Catálogos"])
app.include_router(router_alimentos, prefix="/api/alimentos", tags=["Catálogos"])
app.include_router(router_clientes, prefix="/api/clientes", tags=["Catálogos"])
app.include_router(router_ventas, prefix="/api/ventas", tags=["Comercial"])
app.include_router(router_rentas, prefix="/api/rentas", tags=["Comercial"])
app.include_router(router_partos, prefix="/api/partos", tags=["Reproductivo"])
app.include_router(router_crias, prefix="/api/crias", tags=["Reproductivo"])

@app.get("/")
def root():
    return {
        "status": "online",
        "proyecto": "Vaca Cúbica",
        "mensaje": "El motor Zero Trust está operativo."
    }