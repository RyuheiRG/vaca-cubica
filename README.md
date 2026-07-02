# VACA CÚBICA - Sistema de Gestión Bovina (S.G.B.)

**Arquitectura:** Monorepositorio Cliente-Servidor (Zero Trust)
**Stack Cliente:** React 18 + Vite (Gestionado estrictamente vía `pnpm`)
**Stack Servidor:** Python 3.x + FastAPI + Uvicorn
**Persistencia:** MySQL 8.4 (Aislamiento local vía DBngin)

---

## 🛑 FASE 0: PRE-REQUISITOS (MANDATORIOS)

Antes de clonar este repositorio, el sistema operativo de desarrollo debe contar con las siguientes dependencias base instaladas:

1. **Node.js (LTS 20.x o superior)**
2. **Python (3.10 o superior)**
3. **Git**
4. **DBngin** (Para instanciar MySQL 8.4 localmente).

---

## 🛠 FASE 1: DESBLOQUEO DEL ENTORNO (Solo Windows)

Por defecto, PowerShell bloquea la ejecución de scripts no firmados. Para poder utilizar `pnpm` y el entorno virtual de Python sin crashear en el _frame 1_, ejecuta el siguiente comando en **PowerShell como Administrador**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

(Presiona 'S' o 'Y' cuando solicite confirmación).

---

## 📦 FASE 2: INSTALACIÓN DEL GESTOR DE PAQUETES (pnpm)

Abre tu terminal estándar y ejecuta en orden:

# Habilita el puente de versiones de Node

```bash
corepack enable
```

# Descarga y activa la versión más reciente de pnpm

```bash
corepack prepare pnpm@latest --activate
```

# Verifica la instalación (Debe regresar versión 9.x.x o superior)

```bash
pnpm --version
```

---

## 🚀 FASE 3: CLONACIÓN Y WORKSPACE

```bash
git clone https://github.com/RyuheiRG/vaca-cubica.git
```

```bash
cd vaca-cubica
```

```bash
code .
```

---

## ⚛️ FASE 4: INICIALIZACIÓN DEL FRONTEND (React)

# Navega al contenedor del cliente

```bash
cd frontend
```

# Instala el árbol de dependencias usando pnpm

```bash
pnpm install
```

# Levanta el servidor de desarrollo (Vite)

```bash
pnpm dev
```
