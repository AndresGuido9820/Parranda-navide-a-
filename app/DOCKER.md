# 🐳 Docker Setup - Parranda Navideña

Este documento explica cómo ejecutar la aplicación Parranda Navideña usando Docker.

## 🚀 Inicio Rápido

### 1. Usar el Script de Desarrollo (Recomendado)

```bash
# Hacer ejecutable el script
chmod +x dev.sh

# Iniciar todos los servicios
./dev.sh start

# Ver logs de la aplicación
./dev.sh logs

# Abrir shell en el contenedor
./dev.sh shell

# Detener servicios
./dev.sh stop
```

### 2. Usar Docker Compose Directamente

```bash
# Iniciar servicios
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Detener servicios
docker-compose -f docker-compose.dev.yml down
```

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `./dev.sh start` | Inicia todos los servicios |
| `./dev.sh stop` | Detiene todos los servicios |
| `./dev.sh restart` | Reinicia todos los servicios |
| `./dev.sh build` | Construye la imagen de la aplicación |
| `./dev.sh logs` | Muestra logs de la aplicación |
| `./dev.sh db-logs` | Muestra logs de la base de datos |
| `./dev.sh shell` | Abre shell en el contenedor de la app |
| `./dev.sh migrate` | Ejecuta migraciones de la base de datos |
| `./dev.sh clean` | Limpia contenedores y volúmenes |
| `./dev.sh help` | Muestra ayuda |

## 🌐 Servicios Disponibles

### Aplicación FastAPI
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Base de Datos PostgreSQL
- **Host**: localhost
- **Puerto**: 5433
- **Base de datos**: parranda
- **Usuario**: parranda_user
- **Contraseña**: parranda_pass

### pgAdmin
- **URL**: http://localhost:5050
- **Email**: admin@parranda.com
- **Contraseña**: admin123

#### Configuración de pgAdmin:
1. Abrir http://localhost:5050
2. Login con admin@parranda.com / admin123
3. Agregar servidor:
   - **Name**: Parranda DB
   - **Host**: db
   - **Port**: 5432
   - **Username**: parranda_user
   - **Password**: parranda_pass

## 🔧 Configuración

### Variables de Entorno

Las siguientes variables están configuradas en `docker-compose.dev.yml`:

```yaml
environment:
  - DATABASE_URL=postgresql://parranda_user:parranda_pass@db:5432/parranda
  - JWT_SECRET=your-jwt-secret-here-change-in-production
  - JWT_ALGORITHM=HS256
  - JWT_EXPIRE_MINUTES=30
  - FRONTEND_URL=http://localhost:3000
  - ENVIRONMENT=development
  - DEBUG=true
```

### Volúmenes

- **Código fuente**: Montado en `/app` para desarrollo con hot-reload
- **Base de datos**: Persistente en `postgres_data`
- **pgAdmin**: Persistente en `pgadmin_data`

## 🗄️ Base de Datos

### Migraciones Automáticas

El contenedor de la aplicación ejecuta automáticamente las migraciones de Alembic al iniciar.

### Estructura de la Base de Datos

```sql
-- Esquema principal
CREATE SCHEMA parranda;

-- Tipos ENUM
CREATE TYPE parranda.game_type AS ENUM ('FIND_BABY_JESUS', 'ANO_VIEJO');
CREATE TYPE parranda.game_status AS ENUM ('NOT_STARTED', 'PLAYING', 'FINISHED');
CREATE TYPE parranda.novena_section_type AS ENUM ('ORACIONES', 'GOZOS', 'VILLANCICOS');
CREATE TYPE parranda.photo_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- Extensiones
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Puerto 5432 ya en uso**:
   ```bash
   # La base de datos usa el puerto 5433 para evitar conflictos
   # Si necesitas cambiar el puerto, edita docker-compose.dev.yml
   ```

2. **Error de conexión a la base de datos**:
   ```bash
   # Verificar que la base de datos esté lista
   ./dev.sh db-logs
   
   # Reiniciar servicios
   ./dev.sh restart
   ```

3. **Error de migraciones**:
   ```bash
   # Ejecutar migraciones manualmente
   ./dev.sh migrate
   ```

4. **Limpiar todo y empezar de nuevo**:
   ```bash
   ./dev.sh clean
   ./dev.sh start
   ```

### Logs y Debugging

```bash
# Ver logs de la aplicación
./dev.sh logs

# Ver logs de la base de datos
./dev.sh db-logs

# Abrir shell en el contenedor
./dev.sh shell

# Dentro del contenedor, puedes ejecutar:
alembic upgrade head
alembic current
alembic history
```

## 📝 Desarrollo

### Hot Reload

La aplicación está configurada con hot reload para desarrollo. Los cambios en el código se reflejan automáticamente.

### Estructura del Proyecto

```
/app
├── app/                    # Código fuente de la aplicación
├── alembic/               # Migraciones de la base de datos
├── requirements.txt       # Dependencias de Python
├── Dockerfile            # Imagen de la aplicación
├── docker-compose.dev.yml # Configuración de desarrollo
└── dev.sh                # Script de desarrollo
```

## 🚀 Producción

Para producción, usa `docker-compose.yml` (sin el flag `-f docker-compose.dev.yml`):

```bash
# Construir y ejecutar en producción
docker-compose up -d

# Ver logs
docker-compose logs -f
```

## 📚 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
