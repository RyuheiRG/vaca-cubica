import asyncio
from app.core.database import AsyncSessionLocal
from app.core.security import get_password_hash
from app.models.domain_models import Usuario, RolUsuario

async def main():
    async with AsyncSessionLocal() as db:
        admin = Usuario(
            username="admin",  # cámbialo
            password_hash=get_password_hash("CAMBIA_ESTA_CLAVE"),
            rol=RolUsuario.dueño,
            activo=True,
        )
        db.add(admin)
        await db.commit()
        print("Superadmin creado.")

if __name__ == "__main__":
    asyncio.run(main())