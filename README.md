# VACA CÚBICA - Sistema de Gestión Bovina (S.G.B.)

**Arquitectura:** Monorepositorio Cliente-Servidor (Zero Trust)
**Stack Cliente:** React 18 + Vite (Gestionado estrictamente vía `pnpm`)
**Stack Servidor:** Python 3.12 + FastAPI + Uvicorn + SQLAlchemy (Driver `asyncmy`)
**Persistencia (Local):** MySQL 8.4 (Aislamiento local vía DBngin)
**Infraestructura (Producción):** AWS EC2 (Bare Metal Ubuntu) + Amazon RDS (VPC Aislada)

---

## 🛑 FASE 0: PRE-REQUISITOS (MANDATORIOS)

Antes de clonar este repositorio, el sistema operativo de desarrollo debe contar con las siguientes dependencias base instaladas. La falta de consistencia en versiones generará deuda técnica.

1. **Node.js (LTS 20.x o superior)**
2. **Python (3.10 o superior)**
3. **Git**
4. **DBngin / XAMPP** (Para instanciar MySQL localmente en entorno de desarrollo).

---

## 🛠 FASE 1: DESBLOQUEO DEL ENTORNO (Solo Windows)

Por defecto, PowerShell bloquea la ejecución de scripts no firmados. Para poder utilizar `pnpm` y el entorno virtual de Python sin crashear en el *frame 1*, ejecuta el siguiente comando en **PowerShell como Administrador**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

*(Presiona 'S' o 'Y' cuando solicite confirmación).*

---

## 📦 FASE 2: INSTALACIÓN DEL GESTOR DE PAQUETES (pnpm)

Abre tu terminal estándar y ejecuta en orden para compilar el árbol de dependencias del cliente:

```bash
# Habilita el puente de versiones de Node
corepack enable

# Descarga y activa la versión más reciente de pnpm
corepack prepare pnpm@latest --activate

# Verifica la instalación (Debe regresar versión 9.x.x o superior)
pnpm --version
```

---

## 🚀 FASE 3: CLONACIÓN Y WORKSPACE

Extrae el código fuente y abre el entorno de desarrollo:

```bash
git clone https://github.com/RyuheiRG/vaca-cubica.git
cd vaca-cubica
code .
```

---

## ⚛️ FASE 4: INICIALIZACIÓN DEL FRONTEND (React)

```bash
# Navega al contenedor del cliente
cd frontend

# Instala el árbol de dependencias usando pnpm
pnpm install

# Levanta el servidor de desarrollo en caliente (Vite)
pnpm dev
```

---

## ⚙️ FASE 5: INICIALIZACIÓN DEL BACKEND Y AISLAMIENTO (FastAPI)

El motor transaccional opera bajo un esquema estricto de Zero Trust. Pydantic abortará el arranque (generando un *Traceback* de validación) si el archivo de configuración `.env` no existe o carece de variables críticas.

```bash
# Abre una nueva terminal en la raíz del proyecto y entra al backend
cd backend
```

```bash
# Crea la burbuja de aislamiento (Virtual Environment)
# En Windows:
py -3.12 -m venv env

# (Alternativa en Ubuntu/Linux AWS):
# python3 -m venv env
```

```bash
# Activa el entorno
# En Windows:
.\env\Scripts\activate

# (Alternativa en Ubuntu/Linux AWS):
# source env/bin/activate
```

```bash
# Instala las dependencias de grado industrial
pip install -r requirements.txt
```

### Configuración de la Bóveda Local (`.env`)

Crea un archivo `.env` en la raíz de la carpeta `backend`. El *payload* debe ser determinístico (sin espacios alrededor del signo `=`). Este archivo es ignorado por Git por políticas de seguridad:

```text
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=tu_password_local
DB_NAME=vaca_cubica
SECRET_KEY=clave_criptografica_secreta_local
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## 🔌 FASE 6: ARRANQUE DEL MOTOR (Entorno de Desarrollo)

Con el entorno virtual activo y la base de datos local encendida, ejecuta el *worker*:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

*(Nota: Ajusta la ruta a `app.main:app` si el archivo principal está encapsulado).*

---

## ☁️ ANEXO: DESPLIEGUE EN PRODUCCIÓN (Amazon Web Services)

La arquitectura de producción está alojada en infraestructura Cloud, separando el procesamiento de la persistencia para blindar la superficie de ataque:

1. **Amazon RDS (MySQL):** Actúa como bóveda de datos. El acceso público está denegado (*Perfect Guard*) por políticas de *Security Groups*. Solo acepta tráfico originado dentro de su propia Red Virtual Privada (VPC).
2. **Amazon EC2 (Ubuntu LTS):** Funciona como *Bastion Host* y nodo de cómputo. Extrae el código, activa el entorno virtual y se conecta internamente al RDS.

**Comando de ejecución en producción (Daemon Process):**

```bash
nohup uvicorn main:app --host 0.0.0.0 --port 8000 &
```

*(Para producción, el archivo `.env` del servidor EC2 contiene el Endpoint dinámico de AWS RDS en lugar de `127.0.0.1`).*