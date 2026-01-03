# 🎯 Consejos y Mejores Prácticas para BIOKUAM Web Service

## 📚 Guía de Inicio Rápido

### 1. **Estructura del Proyecto Recomendada**

A medida que tu proyecto crezca, considera esta estructura:

```
biokuam_web_service/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI
│   ├── database.py          # Configuración DB
│   ├── config.py            # Configuración
│   ├── models/              # Modelos SQLModel
│   │   ├── __init__.py
│   │   └── proyecto.py
│   ├── schemas/             # Esquemas Pydantic (validación)
│   │   ├── __init__.py
│   │   └── proyecto.py
│   ├── routers/             # Endpoints organizados
│   │   ├── __init__.py
│   │   ├── proyectos.py
│   │   └── usuarios.py
│   ├── services/            # Lógica de negocio
│   │   ├── __init__.py
│   │   └── proyecto_service.py
│   └── utils/              # Utilidades
│       ├── __init__.py
│       └── helpers.py
├── tests/                   # Tests
├── requirements.txt
├── .env
└── README.md
```

### 2. **Por Dónde Empezar**

#### Paso 1: Configurar Base de Datos
- ✅ Ya tienes `database.py` configurado
- Decide si usarás SQLite (desarrollo) o PostgreSQL (producción)
- Crea tu archivo `.env` con `DATABASE_URL`

#### Paso 2: Definir Modelos
- ✅ Ya tienes un modelo de ejemplo (`Proyecto`)
- Crea modelos que representen tus entidades de negocio
- Usa `table=True` para crear tablas en la BD
- Usa `Field()` para validaciones y restricciones

#### Paso 3: Crear Endpoints
- ✅ Ya tienes CRUD básico de ejemplo
- Organiza endpoints en routers separados
- Usa prefijos de versión: `/api/v1/...`

#### Paso 4: Agregar Validaciones
- Crea schemas Pydantic separados para request/response
- Valida datos de entrada
- Maneja errores apropiadamente

#### Paso 5: Implementar Autenticación
- JWT tokens para autenticación
- Middleware para proteger rutas
- Roles y permisos

---

## 💡 Mejores Prácticas

### 1. **Separación de Responsabilidades**

```python
# ❌ MAL: Todo en el router
@app.post("/proyectos/")
def crear_proyecto(proyecto: Proyecto, session: Session = Depends(get_session)):
    # Validación
    # Lógica de negocio
    # Acceso a BD
    # Transformación de datos
    pass

# ✅ BIEN: Separar en capas
# router/proyectos.py
@app.post("/proyectos/")
def crear_proyecto(
    proyecto: ProyectoCreate,  # Schema de validación
    service: ProyectoService = Depends()
):
    return service.crear_proyecto(proyecto)

# services/proyecto_service.py
class ProyectoService:
    def crear_proyecto(self, proyecto: ProyectoCreate):
        # Lógica de negocio aquí
        pass
```

### 2. **Usar Schemas Separados**

```python
# schemas/proyecto.py
class ProyectoBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None

class ProyectoCreate(ProyectoBase):
    pass  # Campos para crear

class ProyectoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None

class ProyectoResponse(ProyectoBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  # Para convertir desde modelo
```

### 3. **Manejo de Errores**

```python
from fastapi import HTTPException

# Crear excepciones personalizadas
class ProyectoNotFoundError(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Proyecto no encontrado"
        )

# Usar en endpoints
@app.get("/proyectos/{id}")
def obtener_proyecto(id: int, session: Session = Depends(get_session)):
    proyecto = session.get(Proyecto, id)
    if not proyecto:
        raise ProyectoNotFoundError()
    return proyecto
```

### 4. **Dependencias Reutilizables**

```python
# utils/dependencies.py
from fastapi import Depends, HTTPException
from sqlmodel import Session

def get_db() -> Generator[Session, None, None]:
    yield from get_session()

def get_current_user(token: str = Depends(oauth2_scheme)):
    # Lógica de autenticación
    pass
```

### 5. **Relaciones entre Modelos**

```python
from sqlmodel import Relationship, Field

class Proyecto(BaseModel, table=True):
    nombre: str
    tareas: List["Tarea"] = Relationship(back_populates="proyecto")

class Tarea(BaseModel, table=True):
    titulo: str
    proyecto_id: int = Field(foreign_key="proyecto.id")
    proyecto: Proyecto = Relationship(back_populates="tareas")
```

---

## 🔐 Seguridad

### 1. **Variables de Entorno**
- ✅ Nunca hardcodees credenciales
- ✅ Usa `.env` para configuración sensible
- ✅ Agrega `.env` a `.gitignore`

### 2. **Autenticación JWT**

```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def crear_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### 3. **Validación de Datos**
- Usa Pydantic para validar todos los inputs
- Sanitiza datos de usuario
- Valida tipos y formatos

---

## 🧪 Testing

### Estructura de Tests

```python
# tests/test_proyectos.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_crear_proyecto():
    response = client.post(
        "/proyectos/",
        json={"nombre": "Test", "descripcion": "Descripción"}
    )
    assert response.status_code == 200
    assert response.json()["nombre"] == "Test"
```

### Ejecutar Tests
```bash
pytest tests/
```

---

## 📊 Base de Datos

### Migraciones con Alembic

```bash
# Instalar Alembic
pip install alembic

# Inicializar
alembic init alembic

# Crear migración
alembic revision --autogenerate -m "Crear tabla proyectos"

# Aplicar migraciones
alembic upgrade head
```

### Consultas Eficientes

```python
# ❌ MAL: Carga todos los registros
proyectos = session.exec(select(Proyecto)).all()

# ✅ BIEN: Paginación
from sqlmodel import select, func

statement = select(Proyecto).offset(skip).limit(limit)
proyectos = session.exec(statement).all()
total = session.exec(select(func.count(Proyecto.id))).one()
```

---

## 🚀 Optimización

### 1. **Caché**
```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend

# Configurar Redis para caché
```

### 2. **Async/Await**
```python
# Para operaciones I/O intensivas
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

async def get_async_session():
    async with AsyncSession(engine) as session:
        yield session
```

### 3. **Background Tasks**
```python
from fastapi import BackgroundTasks

@app.post("/proyectos/")
def crear_proyecto(
    proyecto: Proyecto,
    background_tasks: BackgroundTasks,
    session: Session = Depends(get_session)
):
    # Tarea en segundo plano
    background_tasks.add_task(enviar_email_notificacion, proyecto.id)
    return proyecto
```

---

## 📝 Documentación

### Agregar Descripciones a Endpoints

```python
@app.post(
    "/proyectos/",
    response_model=ProyectoResponse,
    status_code=201,
    summary="Crear nuevo proyecto",
    description="Crea un nuevo proyecto en el sistema",
    response_description="El proyecto creado con su ID"
)
def crear_proyecto(proyecto: ProyectoCreate):
    pass
```

### Tags para Organizar

```python
@app.post("/proyectos/", tags=["proyectos"])
def crear_proyecto():
    pass

@app.get("/usuarios/", tags=["usuarios"])
def listar_usuarios():
    pass
```

---

## 🎯 Próximos Pasos Recomendados

1. **Organizar en Routers**
   - Crear carpeta `routers/`
   - Separar endpoints por dominio

2. **Implementar Autenticación**
   - JWT tokens
   - Middleware de autenticación
   - Roles y permisos

3. **Agregar Validaciones**
   - Schemas Pydantic
   - Validaciones personalizadas

4. **Testing**
   - Tests unitarios
   - Tests de integración
   - Coverage

5. **Documentación**
   - Documentar endpoints
   - Ejemplos de uso
   - Guías de API

6. **Deployment**
   - Docker
   - CI/CD
   - Monitoreo

---

## 🔗 Recursos Útiles

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **SQLModel Docs**: https://sqlmodel.tiangolo.com/
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Pydantic Docs**: https://docs.pydantic.dev/

---

## ❓ Preguntas Frecuentes

**¿SQLite o PostgreSQL?**
- SQLite: Desarrollo, prototipos, proyectos pequeños
- PostgreSQL: Producción, proyectos grandes, múltiples usuarios

**¿Cuándo usar SQLModel vs Pydantic?**
- SQLModel: Modelos que se guardan en BD (con `table=True`)
- Pydantic: Schemas para validación (request/response)

**¿Cómo manejar relaciones complejas?**
- Usa `Relationship()` de SQLModel
- Considera normalización de BD
- Usa `selectinload()` para eager loading

---

¡Éxito con tu proyecto! 🚀

