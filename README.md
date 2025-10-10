# Parranda Navideña 🎄

Una aplicación web que concentra en un solo lugar lo que la familia espera en diciembre: la novena guiada día a día, la música que sostiene el ánimo de la casa y la cocina compartida que une generaciones.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [API Documentation](#api-documentation)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Flujo de Trabajo Git](#flujo-de-trabajo-git)
- [Estándares de Commits](#estándares-de-commits)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Uso](#uso)
- [Contribución](#contribución)
- [Licencia](#licencia)

## 🎯 Descripción

Parranda Navideña es un espacio digital pensado para concentrar en un solo lugar lo que la familia espera en diciembre: la novena guiada día a día, la música que sostiene el ánimo de la casa y la cocina compartida que une generaciones. Su propósito es acompañar la celebración sin robar protagonismo al momento: todo está a un par de toques, la navegación es predecible y los mensajes aparecen sólo cuando suman claridad.

### ¿Por qué es importante este proyecto?

En la era digital actual, las tradiciones familiares navideñas enfrentan el desafío de mantenerse vivas entre generaciones. Parranda Navideña surge como una solución que:

- **Preserva la tradición**: Mantiene viva la Novena de Aguinaldos, una tradición colombiana fundamental
- **Conecta generaciones**: Facilita que abuelos, padres e hijos compartan momentos significativos
- **Democratiza el conocimiento**: Permite que recetas familiares tradicionales se preserven y compartan
- **Fomenta la participación**: Incluye dinámicas interactivas que involucran a toda la familia
- **Adapta la tradición**: Lleva las costumbres navideñas al mundo digital sin perder su esencia

La web respira un clima íntimo y sencillo; no busca deslumbrar, sino sostener un ritmo tranquilo que permita que cada hogar encuentre su manera de reunirse. Desde el primer ingreso, la estructura se entiende sin manuales: portada limpia, accesos visibles y continuidad garantizada entre secciones para que nadie se pierda al cambiar de actividad.

## ✨ Características

### 🔐 Autenticación
- Registro con email (contraseña opcional)
- Login con magic-link por email
- Login con email/contraseña
- Sesión persistente (48 horas)
- Gestión de perfil de usuario

### 📿 Novenas
- 9 días de novena con progreso personalizado
- Secciones organizadas: Oraciones, Gozos, Villancicos
- Ambiente "Prender velas" opcional
- Marcado de días completados
- Progreso visual (ej: "3/9")

### 🍽️ Recetas & Comunidad
- Catálogo de recetas navideñas tradicionales
- Sistema de pasos con ingredientes JSON
- Compartir fotos con alias
- Sistema de calificaciones (0-5 estrellas)
- Favoritos personales
- Moderación de contenido comunitario

### 🎵 Música Navideña
- Reproductor de villancicos
- Búsqueda por título
- Colas de reproducción personalizadas
- Miniplayer persistente
- Controles básicos (Play/Pausa/Siguiente)

### 🎮 Dinámicas Navideñas
- **Encuentra al Niño Jesús**: Juego de cartas con 4 intentos
- **Año Viejo**: Personalización de muñeco con drag & drop
- Sistema de sesiones de juego
- Progreso y logros

### 🆘 Soporte
- Canales de contacto (teléfono, email)
- FAQ expandible
- Centro de ayuda integrado

## 🛠️ Tecnologías

### Backend
- **API REST** con OpenAPI 3.0.3
- **Base de datos**: PostgreSQL con esquema `parranda`
- **Autenticación**: JWT Bearer tokens
- **Almacenamiento**: JSONB para ingredientes de recetas

### Frontend
- **Framework**: React/Vue.js (por definir)
- **Estilos**: CSS con tema navideño (oscuro con acentos rojos)
- **Interactividad**: Drag & drop para dinámicas
- **Responsive**: Compatible móvil y desktop

### Infraestructura
- **Servidores**:
  - Producción: `https://api.parranda.example.com/v1`
  - Staging: `https://staging.api.parranda.example.com/v1`

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- PostgreSQL 13+
- npm o yarn

### Configuración del Backend

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/Parranda-navide-a-.git
cd Parranda-navide-a-
```

2. **Configurar la base de datos**
```bash
# Crear base de datos
createdb parranda

# Ejecutar migraciones
psql -d parranda -f migrations/001_initial_schema.sql
psql -d parranda -f migrations/002_recipe_ingredients_migration.sql
```

3. **Variables de entorno**
```bash
# Crear archivo .env
cp .env.example .env

# Configurar variables
DATABASE_URL=postgresql://usuario:password@localhost:5432/parranda
JWT_SECRET=tu-jwt-secret-aqui
API_PORT=3000
```

4. **Instalar dependencias y ejecutar**
```bash
npm install
npm run dev
```

### Configuración del Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Documentation

### Autenticación

#### Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "S3guro!",
  "fullName": "Nombre Apellido",
  "alias": "n4vidad"
}
```

#### Login con Magic Link
```http
POST /auth/login-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Login con Contraseña
```http
POST /auth/login-password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "S3guro!"
}
```

### Novenas

#### Listar Días de Novena
```http
GET /novena/days
Authorization: Bearer <token>
```

#### Obtener Día Específico
```http
GET /novena/days/{dayNumber}
Authorization: Bearer <token>
```

#### Actualizar Progreso
```http
PATCH /novena/progress/{dayId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "isCompleted": true
}
```

### Recetas

#### Listar Recetas
```http
GET /recipes?page=1&perPage=20&q=natilla&sort=top
Authorization: Bearer <token>
```

#### Crear Receta
```http
POST /recipes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Natilla Tradicional",
  "authorAlias": "cocinero123",
  "prepTimeMinutes": 35,
  "isPublished": true
}
```

#### Agregar Pasos con Ingredientes
```http
PUT /recipes/{recipeId}/steps
Authorization: Bearer <token>
Content-Type: application/json

[
  {
    "stepNumber": 1,
    "instructionMd": "Mezclar la harina con el agua",
    "ingredientsJson": [
      {
        "qty": "200g",
        "item": "Harina de maíz",
        "notes": "cernida"
      }
    ]
  }
]
```

### Música

#### Listar Tracks
```http
GET /music/tracks?q=aguila%20roja
Authorization: Bearer <token>
```

#### Crear Cola de Reproducción
```http
POST /playback/queues
Authorization: Bearer <token>
```

#### Agregar Track a Cola
```http
POST /playback/queues/{queueId}/items
Authorization: Bearer <token>
Content-Type: application/json

{
  "trackId": "uuid-del-track",
  "position": 0
}
```

### Dinámicas

#### Crear Sesión de Juego
```http
POST /games/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "FIND_BABY_JESUS"
}
```

#### Hacer Intento en "Encuentra al Niño Jesús"
```http
POST /games/sessions/{sessionId}/guess
Authorization: Bearer <token>
Content-Type: application/json

{
  "index": 5
}
```

## 🏗️ Arquitectura del Sistema

```mermaid
graph TB
    subgraph "Frontend"
        UI[React/Vue.js App]
        COMP[Components]
        PAGES[Pages]
        SERVICES[API Services]
    end
    
    subgraph "Backend API"
        AUTH[Auth Controller]
        NOVENA[Novena Controller]
        RECIPES[Recipes Controller]
        MUSIC[Music Controller]
        GAMES[Games Controller]
        SUPPORT[Support Controller]
    end
    
    subgraph "Base de Datos"
        PG[(PostgreSQL)]
        USERS[Users Table]
        NOVENA_DB[Novena Tables]
        RECIPES_DB[Recipes Tables]
        MUSIC_DB[Music Tables]
        GAMES_DB[Games Tables]
    end
    
    subgraph "Servicios Externos"
        EMAIL[Email Service]
        STORAGE[File Storage]
        CDN[CDN]
    end
    
    UI --> SERVICES
    SERVICES --> AUTH
    SERVICES --> NOVENA
    SERVICES --> RECIPES
    SERVICES --> MUSIC
    SERVICES --> GAMES
    SERVICES --> SUPPORT
    
    AUTH --> PG
    NOVENA --> PG
    RECIPES --> PG
    MUSIC --> PG
    GAMES --> PG
    SUPPORT --> PG
    
    PG --> USERS
    PG --> NOVENA_DB
    PG --> RECIPES_DB
    PG --> MUSIC_DB
    PG --> GAMES_DB
    
    AUTH --> EMAIL
    RECIPES --> STORAGE
    MUSIC --> CDN
```

### Componentes Principales

- **Frontend**: Aplicación web responsive con tema navideño
- **Backend API**: REST API con autenticación JWT
- **Base de Datos**: PostgreSQL con esquema `parranda`
- **Servicios**: Email para magic links, almacenamiento de archivos, CDN para música

## 🌿 Flujo de Trabajo Git

### Ramas Principales

#### `main` (Rama Principal)
- **Propósito**: Contiene el código estable y listo para producción
- **Protección**: Solo acepta merges desde `develop`
- **Despliegue**: Se despliega automáticamente a producción
- **Política**: Nunca commits directos, solo merges aprobados

#### `develop` (Rama de Desarrollo)
- **Propósito**: Rama de integración para nuevas funcionalidades
- **Origen**: Todas las feature branches se integran aquí
- **Testing**: Se despliega automáticamente a staging
- **Política**: Merge desde feature branches después de code review

### Flujo de Trabajo

```mermaid
gitgraph
    commit id: "Initial"
    branch develop
    checkout develop
    commit id: "Setup"
    
    branch feature/auth
    checkout feature/auth
    commit id: "Auth system"
    commit id: "JWT tokens"
    
    checkout develop
    merge feature/auth
    commit id: "Merge auth"
    
    branch feature/novena
    checkout feature/novena
    commit id: "Novena days"
    commit id: "Progress tracking"
    
    checkout develop
    merge feature/novena
    commit id: "Merge novena"
    
    checkout main
    merge develop
    commit id: "Release v1.0"
    
    checkout develop
    commit id: "Hotfix prep"
```

### Convenciones de Ramas

- **`feature/nombre-funcionalidad`**: Nuevas características
- **`bugfix/descripcion-bug`**: Corrección de errores
- **`hotfix/descripcion-urgente`**: Fixes críticos para producción
- **`refactor/descripcion-refactor`**: Mejoras de código sin cambios funcionales

### Proceso de Contribución

1. **Crear rama desde `develop`**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nueva-funcionalidad
   ```

2. **Desarrollar y hacer commits**
   ```bash
   git add .
   git commit -m "feat: agregar nueva funcionalidad"
   git push origin feature/nueva-funcionalidad
   ```

3. **Crear Pull Request**
   - Target: `develop`
   - Incluir descripción detallada
   - Referenciar issues relacionados

4. **Code Review**
   - Al menos 1 aprobación requerida
   - Tests deben pasar
   - Sin conflictos con `develop`

5. **Merge a `develop`**
   - Squash commits si es necesario
   - Eliminar rama feature después del merge

6. **Release a `main`**
   - Solo desde `develop` cuando esté estable
   - Crear tag de versión
   - Deploy automático a producción

### Comandos Útiles

```bash
# Sincronizar con develop
git checkout develop
git pull origin develop

# Crear nueva feature
git checkout -b feature/nombre-feature

# Ver ramas
git branch -a

# Limpiar ramas locales eliminadas
git remote prune origin

# Ver estado del repositorio
git status
git log --oneline --graph
```

## 📝 Estándares de Commits

Seguimos el estándar **Conventional Commits** para mantener un historial claro y automatizar releases.

### Formato de Commit

```
<tipo>[scope opcional]: <descripción>

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commit

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat(auth): agregar login con magic link` |
| `fix` | Corrección de bug | `fix(novena): corregir cálculo de progreso` |
| `docs` | Cambios en documentación | `docs: actualizar README con nueva API` |
| `style` | Formato, espacios, etc. | `style: corregir indentación en componentes` |
| `refactor` | Refactorización de código | `refactor(recipes): optimizar consultas SQL` |
| `test` | Agregar o modificar tests | `test(auth): agregar tests para JWT` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |
| `perf` | Mejoras de rendimiento | `perf(music): optimizar carga de tracks` |
| `ci` | Cambios en CI/CD | `ci: agregar tests automatizados` |
| `build` | Cambios en build system | `build: configurar webpack para producción` |

### Scopes Recomendados

- `auth`: Autenticación y usuarios
- `novena`: Módulo de novenas
- `recipes`: Módulo de recetas
- `music`: Módulo de música
- `games`: Dinámicas y juegos
- `support`: Soporte y FAQ
- `api`: Cambios en API
- `ui`: Interfaz de usuario
- `db`: Base de datos
- `config`: Configuración

### Ejemplos de Commits

#### ✅ Buenos Ejemplos

```bash
# Nueva funcionalidad
feat(novena): agregar progreso visual por días
feat(recipes): implementar sistema de calificaciones
feat(auth): agregar registro con email

# Corrección de bugs
fix(music): corregir reproducción en móvil
fix(recipes): solucionar error al subir fotos
fix(novena): corregir cálculo de días completados

# Documentación
docs: agregar ejemplos de API en README
docs(api): documentar endpoints de música

# Refactorización
refactor(recipes): migrar ingredientes a JSONB
refactor(auth): simplificar middleware JWT

# Tests
test(novena): agregar tests para progreso
test(recipes): cubrir casos de error en upload

# Configuración
chore: actualizar dependencias de seguridad
chore: configurar ESLint para el proyecto
```

#### ❌ Malos Ejemplos

```bash
# Muy vago
fix: arreglar bug
update: cambios
new: funcionalidad

# Sin tipo
agregar login
corregir error
actualizar docs

# Muy largo
feat: agregar sistema completo de autenticación con JWT tokens, refresh tokens, middleware de seguridad, validación de usuarios, encriptación de contraseñas y sistema de roles
```

### Reglas Adicionales

1. **Línea de descripción**: Máximo 50 caracteres
2. **Primera línea**: En minúsculas, sin punto final
3. **Cuerpo**: Separado por línea en blanco, máximo 72 caracteres por línea
4. **Footer**: Para referencias a issues (`Closes #123`)

### Ejemplo Completo

```bash
feat(recipes): agregar sistema de favoritos

Implementar funcionalidad para que usuarios puedan marcar
recetas como favoritas y acceder rápidamente a ellas desde
su perfil.

- Agregar endpoint PUT /recipes/{id}/favorite
- Crear tabla user_favorites
- Implementar UI para marcar/desmarcar
- Agregar sección "Mis Favoritos" en perfil

Closes #45
```

### Automatización

Los commits siguen este estándar para:

- **Generar changelog** automáticamente
- **Determinar versiones** (semver)
- **Filtrar commits** por tipo
- **Automatizar releases** con herramientas como semantic-release

### Herramientas Recomendadas

```bash
# Instalar commitizen para commits interactivos
npm install -g commitizen cz-conventional-changelog

# Configurar en package.json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}

# Usar con: git cz
```

### Validación de Commits

```bash
# Instalar commitlint para validar formato
npm install --save-dev @commitlint/cli @commitlint/config-conventional

# Configurar en commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

## 📁 Estructura del Proyecto

```
Parranda-navide-a-/
├── README.md
├── LICENSE
├── .gitignore
├── .env.example
├── api/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── migrations/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   └── package.json
├── docs/
│   ├── api-spec.yaml
│   └── user-stories.md
└── scripts/
    ├── setup.sh
    └── deploy.sh
```

## 🎮 Uso

### Flujo Típico de Usuario

1. **Primer Acceso**
   - Usuario visita la web
   - Puede navegar sin registro o crear cuenta
   - Acceso rápido a Novenas, Recetas, Música, Dinámicas

2. **Novenas Diarias**
   - Selecciona el día actual
   - Lee por secciones (Oraciones → Gozos → Villancicos)
   - Opcionalmente "Prende velas" para ambiente
   - Marca como completado al finalizar

3. **Cocina y Comunidad**
   - Explora recetas tradicionales
   - Sigue pasos con ingredientes detallados
   - Comparte fotos de sus preparaciones
   - Califica recetas (0-5 estrellas)

4. **Música Continua**
   - Reproduce villancicos
   - Busca canciones específicas
   - Crea colas personalizadas
   - Música persiste al cambiar de sección

5. **Dinámicas Familiares**
   - Juega "Encuentra al Niño Jesús"
   - Personaliza el "Año Viejo"
   - Disfruta actividades interactivas

## 🎨 Diseño y UX

### Principios de Diseño
- **Simplicidad**: Navegación intuitiva sin manuales
- **Calidez**: Ambiente navideño con colores cálidos
- **Accesibilidad**: Compatible con lectores de pantalla
- **Responsive**: Optimizado para móvil y desktop

### Paleta de Colores
- **Fondo principal**: Oscuro (#1a1a1a)
- **Acentos**: Rojo navideño (#dc2626)
- **Texto**: Blanco/crema para legibilidad
- **Elementos**: Verde navideño (#16a34a)

### Microcopy
- **Home**: "Vive la Navidad en familia"
- **Novenas**: "Prender velas", "Marcar como completado"
- **Recetas**: "Comparte tu foto — añade tu alias"
- **Música**: "Escuchar ahora", "Añadida a continuación"

## 🧪 Testing

```bash
# Tests del backend
npm run test:api

# Tests del frontend
npm run test:frontend

# Tests de integración
npm run test:e2e
```

## 🚀 Despliegue

### Producción
```bash
# Build del frontend
cd frontend && npm run build

# Deploy del backend
npm run deploy:production
```

### Staging
```bash
npm run deploy:staging
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución
- Sigue las convenciones de código establecidas
- Incluye tests para nuevas funcionalidades
- Actualiza la documentación según sea necesario
- Respeta el tono navideño y familiar del proyecto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Daniel Steven De La Rosa Narváez**
- **David Posada Salazar**
- **Juan José Alzate Rojas**
- **Andrés Felipe Guido Montoya**

---

**Universidad Nacional de Colombia - Sede Medellín**  
*Desarrollo Web I*

---

¡Feliz Navidad! 🎄✨
