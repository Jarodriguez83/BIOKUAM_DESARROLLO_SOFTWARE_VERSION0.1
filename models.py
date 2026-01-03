"""
Modelos de datos usando SQLModel
SQLModel combina SQLAlchemy y Pydantic en un solo modelo
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class BaseModel(SQLModel):
    """
    Modelo base con campos comunes
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = Field(default=None)


# Ejemplo de modelo - Puedes crear más modelos según tus necesidades
class Proyecto(BaseModel, table=True):
    """
    Modelo de ejemplo: Proyecto
    table=True crea la tabla en la base de datos
    """
    nombre: str = Field(index=True, max_length=100)
    descripcion: Optional[str] = Field(default=None, max_length=500)
    estado: str = Field(default="activo", max_length=50)
    
    class Config:
        # Configuración adicional si es necesario
        pass

