"""
Configuración de la base de datos usando SQLModel y SQLAlchemy
"""
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# URL de conexión a la base de datos
# Por defecto usa SQLite, pero puedes cambiarlo a PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "sqlite:///./biokuam.db"
)

# Crear el motor de la base de datos
# Para PostgreSQL usar: create_engine(DATABASE_URL, echo=True)
# Para SQLite (desarrollo): create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Muestra las consultas SQL en consola (útil para desarrollo)
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)


def init_db():
    """
    Inicializa la base de datos creando todas las tablas
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Generador de sesiones de base de datos
    Úsalo como dependencia en FastAPI
    """
    with Session(engine) as session:
        yield session

