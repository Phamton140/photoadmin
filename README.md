# 📸 PhotoAdmin - Sistema de Gestión para Estudios Fotográficos

Backend API desarrollado con Laravel 12 para la gestión integral de estudios fotográficos y audiovisuales.

---

## 🎯 Características Principales

- ✅ **Sistema de Autenticación** con Laravel Sanctum
- ✅ **Control de Acceso Basado en Roles (RBAC)** con permisos granulares
- ✅ **Gestión de Clientes** con historial de proyectos
- ✅ **Gestión de Proyectos** (bodas, eventos, sesiones, etc.)
- ✅ **Control de Producción** con tareas y seguimiento de tiempos
- ✅ **Gestión Multi-Sucursal**
- ✅ **Sistema de Archivos** para proyectos
- ✅ **Auditoría Completa** de acciones del sistema
- ✅ **Reportes y KPIs** para análisis de negocio
- ✅ **API RESTful** completa y documentada

---

## 🛠️ Stack Tecnológico

- **Framework:** Laravel 12.x
- **PHP:** 8.2+
- **Base de Datos:** SQLite (desarrollo) / MySQL/PostgreSQL (producción)
- **Autenticación:** Laravel Sanctum
- **ORM:** Eloquent

---

## 📋 Requisitos

- PHP >= 8.2
- Composer
- SQLite (desarrollo) o MySQL/PostgreSQL (producción)
- Extensiones PHP: OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd photoadmin
```

### 2. Instalar dependencias

```bash
composer install
```

### 3. Configurar entorno

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Configurar base de datos

Editar `.env`:

```env
DB_CONNECTION=sqlite
# O para MySQL:
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=photoadmin
# DB_USERNAME=root
# DB_PASSWORD=
```

### 5. Ejecutar migraciones

```bash
php artisan migrate
```

### 6. Ejecutar seeders (datos iniciales)

```bash
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=SuperAdminSeeder
```

### 7. Iniciar servidor de desarrollo

```bash
php artisan serve
```

La API estará disponible en: `http://localhost:8000/api`

---

## 📚 Documentación

- **[RESUMEN_PROYECTO.md](RESUMEN_PROYECTO.md)** - Análisis completo del estado del proyecto
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** - Documentación técnica de la API
- **[GUIA_INTEGRACION_FRONTEND.md](GUIA_INTEGRACION_FRONTEND.md)** - Guía para integrar con frontend
- **[PLAN_MEJORAS.md](PLAN_MEJORAS.md)** - Plan de mejoras y roadmap

---

## 🔑 Credenciales por Defecto

Después de ejecutar los seeders:

**SuperAdmin:**

- Email: `admin@photoadmin.com`
- Password: `password123`

> ⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción

---

## 🎭 Roles y Permisos

### Roles Predefinidos

1. **SuperAdmin** - Acceso total al sistema
2. **Admin** - Administración general (sin gestión de roles/permisos)
3. **Editor** - Gestión de proyectos y producción
4. **Viewer** - Solo lectura

### Permisos Disponibles

- `users.*` - Gestión de usuarios
- `roles.*` - Gestión de roles
- `permissions.*` - Gestión de permisos
- `branches.*` - Gestión de sucursales
- `clients.*` - Gestión de clientes
- `projects.*` - Gestión de proyectos
- `production.*` - Gestión de producción
- `files.*` - Gestión de archivos
- `reports.view` - Ver reportes
- `audit.view` - Ver auditoría

---

## 🔗 Endpoints Principales

### Autenticación

```
POST   /api/login          - Iniciar sesión
POST   /api/register       - Registrar usuario
POST   /api/logout         - Cerrar sesión
GET    /api/me             - Perfil del usuario
```

### Usuarios

```
GET    /api/users          - Listar usuarios
POST   /api/users          - Crear usuario
GET    /api/users/{id}     - Ver usuario
PUT    /api/users/{id}     - Actualizar usuario
DELETE /api/users/{id}     - Eliminar usuario
```

### Proyectos

```
GET    /api/projects       - Listar proyectos
POST   /api/projects       - Crear proyecto
GET    /api/projects/{id}  - Ver proyecto
PUT    /api/projects/{id}  - Actualizar proyecto
DELETE /api/projects/{id}  - Eliminar proyecto
```

### Clientes

```
GET    /api/clients        - Listar clientes
POST   /api/clients        - Crear cliente
GET    /api/clients/{id}   - Ver cliente
PUT    /api/clients/{id}   - Actualizar cliente
DELETE /api/clients/{id}   - Eliminar cliente
```

### Reportes

```
GET /api/reports/summary            - KPIs principales
GET /api/reports/projects-by-branch - Proyectos por sucursal
GET /api/reports/productivity       - Productividad por usuario
```

> Ver [API_DOCUMENTATION.md](API_DOCUMENTATION.md) para documentación completa

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
php artisan test

# Ejecutar tests específicos
php artisan test --filter=AuthTest

# Con cobertura
php artisan test --coverage
```

---

## 🚢 Deployment

### Preparación para Producción

1. **Configurar `.env` de producción:**

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=tu-host
DB_DATABASE=photoadmin_prod
DB_USERNAME=usuario
DB_PASSWORD=contraseña-segura

SANCTUM_STATEFUL_DOMAINS=tu-frontend.com
```

2. **Optimizar aplicación:**

```bash
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

3. **Ejecutar migraciones:**

```bash
php artisan migrate --force
```

4. **Configurar permisos:**

```bash
chmod -R 755 storage bootstrap/cache
```

> Ver [PLAN_MEJORAS.md](PLAN_MEJORAS.md) para guía detallada de deployment

---

## 🔒 Seguridad

- ✅ Autenticación con tokens Sanctum
- ✅ Middleware de roles y permisos
- ✅ Validación de datos de entrada
- ✅ Protección CSRF
- ✅ Hashing de passwords con bcrypt
- ✅ Auditoría de acciones

### Recomendaciones Adicionales

- Usar HTTPS en producción
- Configurar CORS apropiadamente
- Implementar rate limiting
- Validar uploads de archivos
- Backups automáticos de base de datos

---

## 📊 Estructura de Base de Datos

### Tablas Principales

- `users` - Usuarios del sistema
- `roles` - Roles de usuario
- `permissions` - Permisos del sistema
- `role_user` - Relación usuarios-roles
- `permission_role` - Relación roles-permisos
- `permission_user` - Permisos directos a usuarios
- `branches` - Sucursales
- `clients` - Clientes
- `projects` - Proyectos
- `production_tasks` - Tareas de producción
- `project_files` - Archivos de proyectos
- `audit_logs` - Registro de auditoría

---

## 🤝 Integración con Frontend

### Headers Requeridos

```javascript
{
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer {token}'
}
```

### Ejemplo de Petición

```javascript
const response = await fetch('http://localhost:8000/api/projects', {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

const projects = await response.json();
```

> Ver [GUIA_INTEGRACION_FRONTEND.md](GUIA_INTEGRACION_FRONTEND.md) para ejemplos completos

---

## 📈 Roadmap

### Fase 1 - Mejoras Críticas (1 semana)

- [ ] Paginación en listados
- [ ] Filtros y búsqueda avanzada
- [ ] Validación mejorada de archivos
- [ ] Configuración de CORS

### Fase 2 - Mejoras Importantes (1-2 semanas)

- [ ] Soft deletes
- [ ] Notificaciones por email
- [ ] Rate limiting
- [ ] Caché de reportes
- [ ] Testing automatizado

### Fase 3 - Funcionalidades Avanzadas

- [ ] Webhooks
- [ ] Exportación de datos (Excel, PDF)
- [ ] GraphQL API
- [ ] Multi-tenancy

> Ver [PLAN_MEJORAS.md](PLAN_MEJORAS.md) para detalles completos

---

## 🐛 Troubleshooting

### Error: "Class not found"

```bash
composer dump-autoload
```

### Error: "Permission denied" en storage

```bash
chmod -R 775 storage bootstrap/cache
```

### Error: "SQLSTATE[HY000]"

```bash
# Verificar configuración de base de datos en .env
# Crear base de datos si no existe
php artisan migrate:fresh
```

### Error: "Unauthenticated"

```bash
# Verificar que el token esté en el header Authorization
# Verificar que el token no haya expirado
```

---

## 📞 Soporte

Para reportar bugs o solicitar features, crear un issue en el repositorio.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

## 👥 Créditos

Desarrollado con ❤️ usando Laravel

---

## 📝 Changelog

### v1.0.0 (2025-11-23)

- ✅ Implementación inicial del backend
- ✅ Sistema de autenticación
- ✅ CRUD completo de todos los módulos
- ✅ Sistema de roles y permisos
- ✅ Auditoría
- ✅ Reportes básicos
- ✅ Documentación completa

---

**Estado del Proyecto:** ✅ Backend Funcional - Listo para Integración Frontend

**Próximo Paso:** Implementar mejoras de Fase 1 e integrar con frontend
