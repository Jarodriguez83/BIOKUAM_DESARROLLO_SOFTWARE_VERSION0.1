"""
Aplicación principal FastAPI
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from typing import List
import uvicorn

# Importar configuración de base de datos
from database import get_session, init_db
from models import Proyecto

# Crear instancia de FastAPI
app = FastAPI(
    title="BIOKUAM Web Service",
    description="Servicio web para desarrollo de software",
    version="0.1.0"
)

# Configurar CORS (permite peticiones desde el frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, especifica los orígenes permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Evento de inicio: inicializar base de datos
@app.on_event("startup")
def on_startup():
    """
    Se ejecuta al iniciar la aplicación
    Crea las tablas si no existen
    """
    init_db()
    print("✅ Base de datos inicializada")


# Ruta raíz
@app.get("/")
def read_root():
    """
    Endpoint de bienvenida
    """
    return {
        "message": "Bienvenido a BIOKUAM Web Service",
        "version": "0.1.0",
        "docs": "/docs"
    }


# Ruta de salud
@app.get("/health")
def health_check():
    """
    Endpoint para verificar el estado del servicio
    """
    return {"status": "healthy"}


# ========== RUTAS DE EJEMPLO PARA PROYECTO ==========

@app.post("/proyectos/", response_model=Proyecto)
def crear_proyecto(proyecto: Proyecto, session: Session = Depends(get_session)):
    """
    Crear un nuevo proyecto
    """
    session.add(proyecto)
    session.commit()
    session.refresh(proyecto)
    return proyecto


@app.get("/proyectos/", response_model=List[Proyecto])
def listar_proyectos(session: Session = Depends(get_session)):
    """
    Listar todos los proyectos
    """
    statement = select(Proyecto)
    proyectos = session.exec(statement).all()
    return proyectos


@app.get("/proyectos/{proyecto_id}", response_model=Proyecto)
def obtener_proyecto(proyecto_id: int, session: Session = Depends(get_session)):
    """
    Obtener un proyecto por ID
    """
    proyecto = session.get(Proyecto, proyecto_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto


@app.put("/proyectos/{proyecto_id}", response_model=Proyecto)
def actualizar_proyecto(
    proyecto_id: int, 
    proyecto_update: Proyecto, 
    session: Session = Depends(get_session)
):
    """
    Actualizar un proyecto
    """
    proyecto = session.get(Proyecto, proyecto_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    # Actualizar campos
    for key, value in proyecto_update.dict(exclude_unset=True).items():
        setattr(proyecto, key, value)
    
    session.add(proyecto)
    session.commit()
    session.refresh(proyecto)
    return proyecto


@app.delete("/proyectos/{proyecto_id}")
def eliminar_proyecto(proyecto_id: int, session: Session = Depends(get_session)):
    """
    Eliminar un proyecto
    """
    proyecto = session.get(Proyecto, proyecto_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    
    session.delete(proyecto)
    session.commit()
    return {"message": "Proyecto eliminado correctamente"}


# Punto de entrada para ejecutar el servidor
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True  # Recarga automática en desarrollo
    )

