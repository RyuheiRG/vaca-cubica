from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Numeric, Date, Text, JSON, CheckConstraint, UniqueConstraint, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship, Mapped, mapped_column
import enum

# Importamos la clase Base que encapsula el mapeo del motor asíncrono
from app.core.database import Base

# ==========================================
# ENUMS (Tipados estrictos)
# ==========================================
class RolUsuario(str, enum.Enum):
    dueño = "dueño"
    caporal = "caporal"

class EstadoBovino(str, enum.Enum):
    activo = "activo"
    vendido = "vendido"
    cuarentena = "cuarentena"
    fallecido = "fallecido"

class SexoBovino(str, enum.Enum):
    macho = "macho"
    hembra = "hembra"

class TipoParto(str, enum.Enum):
    normal = "normal"
    distocico = "distocico"
    cesarea = "cesarea"

class EstadoSaludCria(str, enum.Enum):
    excelente = "excelente"
    bueno = "bueno"
    observacion = "observacion"
    critico = "critico"
    fallecido = "fallecido"

class TipoBaja(str, enum.Enum):
    vendido = "vendido"
    fallecido = "fallecido"

class AccionAuditoria(str, enum.Enum):
    INSERT = "INSERT"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    LOGIN_SUCCESS = "LOGIN_SUCCESS"
    LOGIN_FAILED = "LOGIN_FAILED"
    UNAUTHORIZED_ACCESS = "UNAUTHORIZED_ACCESS"

# ==========================================
# ENTIDAD: USUARIO
# ==========================================
class Usuario(Base):
    __tablename__ = "usuario"

    __table_args__ = {
        "mysql_engine": "InnoDB",
        "mysql_charset": "utf8mb4",
    }

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    rol: Mapped[RolUsuario] = mapped_column(SQLEnum(RolUsuario, name="rol_usuario"), nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Timestamps inmutables gestionados por el motor
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relaciones (Bidireccionalidad)
    # bovinos_registrados = relationship("HistorialPesaje", back_populates="usuario")

# ==========================================
# ENTIDAD: BOVINO
# ==========================================
class Bovino(Base):
    __tablename__ = "bovino"

    __table_args__ = (
        CheckConstraint("peso_ingreso > 0", name="chk_bovino_peso"),
        CheckConstraint("NOT (es_semental = TRUE AND sexo = 'hembra')", name="chk_bovino_semental_sexo"),
        Index("idx_bovino_raza", "raza_id"),
        Index("idx_bovino_estado", "estado"),
        Index("idx_bovino_estado_raza", "estado", "raza_id"),
        Index("idx_bovino_semental", "es_semental", "sexo", "estado"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"},
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    arete: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=True)
    fecha_nacimiento: Mapped[Date] = mapped_column(Date, nullable=True)
    fecha_ingreso: Mapped[Date] = mapped_column(Date, nullable=False)
    peso_ingreso: Mapped[Numeric] = mapped_column(Numeric(6, 2), nullable=False)
    sexo: Mapped[SexoBovino] = mapped_column(SQLEnum(SexoBovino, name="sexo_bovino"), nullable=False)
    raza_id: Mapped[int] = mapped_column(Integer, ForeignKey("raza.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    estado: Mapped[EstadoBovino] = mapped_column(SQLEnum(EstadoBovino, name="estado_bovino"), default=EstadoBovino.activo, server_default="activo", nullable=False)
    es_semental: Mapped[bool] = mapped_column(Boolean, default=False, server_default="0", nullable=False)

    # raza = relationship("Raza", back_populates="bovinos")

# ==========================================
# MÓDULO: CATÁLOGOS
# ==========================================
class Raza(Base):
    __tablename__ = "raza"
    __table_args__ = (
        CheckConstraint("peso_promedio_adulto > 0", name="chk_raza_peso"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    peso_promedio_adulto: Mapped[Numeric] = mapped_column(Numeric(6, 2), nullable=False)

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

class Vacuna(Base):
    __tablename__ = "vacuna"
    __table_args__ = {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    enfermedad_objetivo: Mapped[str] = mapped_column(String(100), nullable=False)

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

class Alimento(Base):
    __tablename__ = "alimento"
    __table_args__ = {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    tipo: Mapped[str] = mapped_column(String(50), nullable=False)

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

class Cliente(Base):
    __tablename__ = "cliente"
    __table_args__ = {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    telefono: Mapped[str] = mapped_column(String(20), nullable=False)

    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)
    updated_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


# ==========================================
# MÓDULO: OPERACIONES TRANSACCIONALES
# ==========================================
class HistorialPesaje(Base):
    __tablename__ = "historial_pesaje"
    __table_args__ = (
        UniqueConstraint("bovino_id", "fecha", name="uq_historial"),
        CheckConstraint("peso_kg > 0", name="chk_historial_peso"),
        Index("idx_historial_bovino_fecha", "bovino_id", "fecha"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    fecha: Mapped[Date] = mapped_column(Date, nullable=False)
    peso_kg: Mapped[Numeric] = mapped_column(Numeric(6, 2), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

class RegistroMedico(Base):
    __tablename__ = "registro_medico"
    __table_args__ = (
        UniqueConstraint("bovino_id", "vacuna_id", "fecha_aplicacion", name="uq_registro_medico"),
        CheckConstraint("dosis_ml > 0", name="chk_dosis"),
        Index("idx_registro_bovino", "bovino_id"),
        Index("idx_registro_vacuna", "vacuna_id"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    vacuna_id: Mapped[int] = mapped_column(Integer, ForeignKey("vacuna.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    fecha_aplicacion: Mapped[Date] = mapped_column(Date, nullable=False)
    dosis_ml: Mapped[Numeric] = mapped_column(Numeric(5, 2), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

class DietaDiaria(Base):
    __tablename__ = "dieta_diaria"
    __table_args__ = (
        UniqueConstraint("bovino_id", "alimento_id", "fecha", name="uq_dieta"),
        CheckConstraint("cantidad_kg > 0", name="chk_cantidad"),
        Index("idx_dieta_bovino_fecha", "bovino_id", "fecha"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    alimento_id: Mapped[int] = mapped_column(Integer, ForeignKey("alimento.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    fecha: Mapped[Date] = mapped_column(Date, nullable=False)
    cantidad_kg: Mapped[Numeric] = mapped_column(Numeric(5, 2), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


# ==========================================
# MÓDULO: COMERCIAL Y REPRODUCTIVO
# ==========================================
class Venta(Base):
    __tablename__ = "venta"
    __table_args__ = (
        CheckConstraint("precio_final > 0", name="chk_precio"),
        Index("idx_venta_cliente", "cliente_id"),
        Index("idx_venta_fecha", "fecha_venta"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), unique=True, nullable=False)
    cliente_id: Mapped[int] = mapped_column(Integer, ForeignKey("cliente.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    fecha_venta: Mapped[Date] = mapped_column(Date, nullable=False)
    precio_final: Mapped[Numeric] = mapped_column(Numeric(10, 2), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

class Renta(Base):
    __tablename__ = "renta"
    __table_args__ = (
        CheckConstraint("costo_total > 0", name="chk_renta_costo"),
        CheckConstraint("fecha_fin IS NULL OR fecha_fin >= fecha_inicio", name="chk_renta_fechas"),
        Index("idx_renta_fechas", "fecha_inicio", "fecha_fin"),
        Index("idx_renta_cliente", "cliente_id"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    cliente_id: Mapped[int] = mapped_column(Integer, ForeignKey("cliente.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    fecha_inicio: Mapped[Date] = mapped_column(Date, nullable=False)
    fecha_fin: Mapped[Date] = mapped_column(Date, nullable=True)
    costo_total: Mapped[Numeric] = mapped_column(Numeric(10, 2), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

    # Nota: la validación de que bovino_id sea macho + activo + es_semental=TRUE
    # vive en el trigger trg_renta_valida_semental (SQL) y/o en la capa de servicio.
    # SQLAlchemy no puede expresar ese chequeo cross-tabla como CheckConstraint.

class Parto(Base):
    __tablename__ = "parto"
    __table_args__ = (
        Index("idx_parto_madre", "madre_id", "fecha_parto"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    madre_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    fecha_parto: Mapped[Date] = mapped_column(Date, nullable=False)
    tipo_parto: Mapped[TipoParto] = mapped_column(SQLEnum(TipoParto, name="tipo_parto_enum"), default=TipoParto.normal, server_default="normal", nullable=False)
    observaciones: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

class Cria(Base):
    __tablename__ = "cria"
    __table_args__ = (
        CheckConstraint("peso_nacer > 0", name="chk_cria_peso"),
        Index("idx_cria_parto", "parto_id"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    arete_provisional: Mapped[str] = mapped_column(String(20), unique=True, nullable=True)
    parto_id: Mapped[int] = mapped_column(Integer, ForeignKey("parto.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    raza_id: Mapped[int] = mapped_column(Integer, ForeignKey("raza.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    sexo: Mapped[SexoBovino] = mapped_column(SQLEnum(SexoBovino, name="sexo_cria_enum"), nullable=False)
    peso_nacer: Mapped[Numeric] = mapped_column(Numeric(5, 2), nullable=False)
    estado_salud: Mapped[EstadoSaludCria] = mapped_column(SQLEnum(EstadoSaludCria, name="estado_salud_enum"), default=EstadoSaludCria.excelente, server_default="excelente", nullable=False)
    # Queda NULL mientras la cría es solo registro de nacimiento; se llena cuando
    # el equipo la promueve a un registro independiente en bovino (arete definitivo).
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

class BajaBovino(Base):
    __tablename__ = "baja_bovino"
    __table_args__ = (
        Index("idx_baja_tipo_fecha", "tipo", "fecha"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    bovino_id: Mapped[int] = mapped_column(Integer, ForeignKey("bovino.id", ondelete="RESTRICT", onupdate="CASCADE"), unique=True, nullable=False)
    tipo: Mapped[TipoBaja] = mapped_column(SQLEnum(TipoBaja, name="tipo_baja_enum"), nullable=False)
    fecha: Mapped[Date] = mapped_column(Date, nullable=False)
    # Obligatorio a nivel de servicio cuando tipo='fallecido'; no se fuerza aquí
    # porque el campo no aplica cuando tipo='vendido'.
    causa: Mapped[str] = mapped_column(String(150), nullable=True)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="RESTRICT", onupdate="CASCADE"), nullable=False)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)


# ==========================================
# MÓDULO: SEGURIDAD (Zero Trust Ultimate)
# ==========================================
class Auditoria(Base):
    __tablename__ = "auditoria"
    __table_args__ = (
        Index("idx_auditoria_tabla_registro", "tabla_afectada", "registro_id"),
        Index("idx_auditoria_usuario_fecha", "usuario_id", "created_at"),
        {"mysql_engine": "InnoDB", "mysql_charset": "utf8mb4"}
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    usuario_id: Mapped[int] = mapped_column(Integer, ForeignKey("usuario.id", ondelete="SET NULL", onupdate="CASCADE"), nullable=True)
    accion: Mapped[AccionAuditoria] = mapped_column(SQLEnum(AccionAuditoria, name="accion_auditoria_enum"), nullable=False)
    tabla_afectada: Mapped[str] = mapped_column(String(50), nullable=True)
    registro_id: Mapped[int] = mapped_column(Integer, nullable=True)
    detalle: Mapped[dict] = mapped_column(JSON, nullable=True)  # Payload o diff serializado
    ip_origen: Mapped[str] = mapped_column(String(45), nullable=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime, server_default=func.now(), nullable=False)

class LogAuditoria(Base):
    __tablename__ = "log_auditoria"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    usuario_id: Mapped[int] = mapped_column(Integer, nullable=False)
    endpoint: Mapped[str] = mapped_column(String(255), nullable=False)
    metodo: Mapped[str] = mapped_column(String(10), nullable=False)
    payload: Mapped[dict] = mapped_column(JSON, nullable=True) # Aquí guardamos el JSON que enviaron
    timestamp: Mapped[DateTime] = mapped_column(DateTime, default=func.now())