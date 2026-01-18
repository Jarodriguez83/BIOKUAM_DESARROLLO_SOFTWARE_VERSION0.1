"""
Aplicación principal FastAPI
"""
from fastapi import FastAPI, Depends, HTTPException, Request  # Agrega Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates  # Agrega esto para plantillas
from sqlmodel import Session, select
from typing import List
from pathlib import Path
import uvicorn

# IMPORTAR CONFIGURACIÓN DE LAS BASES DE DATOS
from database import create_db_and_tables, get_session
from models import Proyecto, Usuario

# INSTANCIAS DE FASTAPI
app = FastAPI(
    title="BIOKUAM - WEB SERVICE",
    description="Servicio Web de 'BIOKUAM' proyecto relacionado acerca del prototipo de una embarcación para la medición del pH y temperatura del agua determinando que tan óptima es la fuente hídrica para el riego de cultivos de maíz, en el municipio de Simijaca, Cundinamarca, Colombia.",
    version="0.1.0"
)

# Configurar plantillas Jinja2
app.mount("/static", StaticFiles(directory="static"), name="static")  # Montar archivos estáticos
templates = Jinja2Templates(directory="templates")  # Directorio de plantillas

# CONFIGURAR EL CORS QUE PERMITE LAS PETICIONES DESDE EL FRONTEND
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
    create_db_and_tables()
    print("✅ LA BASE DE DATOS HA SIDO INICIALIZADA")


# ENDPOINT RAÍZ 
@app.get("/", response_class=HTMLResponse, tags=["INICIO"])
def read_root(request: Request):  # Agrega request como parámetro
    """
    ENDPOINT DE BIENVENIDA AL PROYECTO EN DONDE SE RESPONDE CON UN HTML DE INICIO
    Renderiza la plantilla asistente.html con Jinja2
    """
    return templates.TemplateResponse("inicio.html", {"request": request})  # Usa TemplateResponse

# ENDPOINT DE VERIFICACIÓN DE ESTADO DEL SERVICIO
@app.get("/health")
def health_check():
    return {"- THE STATUS SERVICE IS HEALTHY ": True}


# ========== RUTAS (ENDPOINTS) DEL PROYECTO: ==========

@app.get("/home", response_class=HTMLResponse, tags=["INICIO"])
def read_home(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DE BIENVENIDA AL PROYECTO EN DONDE SE RESPONDE CON UN HTML DE INICIO
    Renderiza la plantilla home.html con Jinja2
    """
    return templates.TemplateResponse("home.html", {"request": request})  # Usa TemplateResponse

@app.get("/asistente", response_class=HTMLResponse, tags=["ASISTENTE IA"])
def read_asistente(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DEL ASISTENTE IA DEL PROYECTO EN DONDE SE RESPONDE CON UN HTML DEL ASISTENTE IA
    Renderiza la plantilla asistente.html con Jinja2
    """
    return templates.TemplateResponse("asistente.html", {"request": request})  # Usa TemplateResponse

@app.get("/ubicacion", response_class=HTMLResponse, tags=["UBICACIÓN"])
def read_ubicacion(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DE LA UBICACIÓN DEL PROYECTO EN DONDE SE RESPONDE CON UN HTML DE LA UBICACIÓN
    Renderiza la plantilla ubicacion.html con Jinja2
    """
    return templates.TemplateResponse("ubicacion.html", {"request": request})  # Usa TemplateResponse

@app.get("/cultivos", response_class=HTMLResponse, tags=["CULTIVOS"])
def read_cultivos(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DE LOS CULTIVOS DEL PROYECTO EN DONDE SE RESPONDE CON UN HTML DE LOS CULTIVOS
    Renderiza la plantilla cultivos.html con Jinja2
    """
    return templates.TemplateResponse("cultivos.html", {"request": request})  # Usa TemplateResponse

@app.get("/prototipo", response_class=HTMLResponse, tags=["PROTOTIPO"])
def read_prototipo(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DEL PROTOTIPO DEL PROYECTO EN DONDE SE RESPONDE CON UN HTML DEL PROTOTIPO
    Renderiza la plantilla prototipo.html con Jinja2
    """
    return templates.TemplateResponse("prototipo.html", {"request": request})  # Usa TemplateResponse

@app.get("/monitoreo", response_class=HTMLResponse, tags=["MONITOREO"])
def read_monitoreo(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DEL MONITOREO DEL PROYECTO EN DONDE SE RESPONDE CON UN HTML DEL MONITOREO
    Renderiza la plantilla monitoreo.html con Jinja2
    """
    return templates.TemplateResponse("monitoreo.html", {"request": request})  # Usa TemplateResponse

@app.get("/perfil", response_class=HTMLResponse, tags=["PERFIL"])
def read_perfil(request: Request): # Agrega request como parámetro
    """
    ENDPOINT DEL PERFIL DEL PROYECTO EN DONDE SE RESPONDE CON UN HTML DEL PERFIL
    Renderiza la plantilla perfil.html con Jinja2
    """
    return templates.TemplateResponse("perfil.html", {"request": request})  # Usa TemplateResponse

@app.post("/registro", tags=["REGISTRO"])
def registro_usuario(usuario: Usuario, session: Session = Depends(get_session)):  
    try:  
        session.add(usuario)  
        session.commit()
        session.refresh(usuario)
        return {"status": "success", "usuario_id": usuario.id, "message": "EL USUARIO SE REGISTRO EXITOSAMENTE."}
    except Exception as e:  
        session.rollback()
        raise HTTPException(status_code=400, detail=f"ERROR AL REGISTRAR EL USUARIO: {str(e)}")
    
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


