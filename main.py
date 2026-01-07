"""
Aplicación principal FastAPI
"""
from fastapi import FastAPI, Depends, HTTPException, Request  # Agrega Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates  # Agrega esto para plantillas
from sqlmodel import Session, select
from typing import List
from pathlib import Path
import uvicorn

# Importar configuración de base de datos
from database import get_session, init_db
from models import Proyecto

# INSTANCIAS DE FASTAPI
app = FastAPI(
    title="BIOKUAM - WEB SERVICE",
    description="Servicio Web de 'BIOKUAM' proyecto relacionado acerca del prototipo de una embarcación para la medición del pH y temperatura del agua determinando que tan óptima es la fuente hídrica para el riego de cultivos de maíz, en el municipio de Simijaca, Cundinamarca, Colombia.",
    version="0.1.0"
)

# Configurar plantillas Jinja2
templates = Jinja2Templates(directory="templates")  # Directorio de plantillas

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
    EN CASO DE QUE NO EXISTAN LAS TABLAS PARA LA BASE DE DATOS LAS CREA.
    """
    init_db()
    print("✅ LA BASE DE DATOS HA SIDO INICIALIZADA")


# ENDPOINT RAÍZ 
@app.get("/", response_class=HTMLResponse, tags=["INICIO"])
def read_root(request: Request):  # Agrega request como parámetro
    """
    ENDPOINT DE BIENVENIDA AL PROYECTO EN DONDE SE RESPONDE CON UN HTML DE INICIO
    Renderiza la plantilla index.html con Jinja2
    """
    return templates.TemplateResponse("inicio.html", {"request": request})  # Usa TemplateResponse


# ENDPOINT DE VERIFICACIÓN DE ESTADO DEL SERVICIO
@app.get("/health")
def health_check():
    return {"- THE STATUS SERVICE IS HEALTHY ": True}


# ========== RUTAS (ENDPOINTS) DEL PROYECTO: ==========

@app.post("/register/user", response_model=Proyecto)
def crear_proyecto(proyecto: Proyecto, session: Session = Depends(get_session)):
    """
    REGISTRO PARA CADA UNO DE LOS USUARIOS
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


