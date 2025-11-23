# 📚 DOCUMENTACIÓN API - PhotoAdmin Backend

**Versión:** 1.0.0  
**Base URL:** `/api`  
**Autenticación:** Bearer Token (Laravel Sanctum)

---

## 📋 ÍNDICE

1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Roles y Permisos](#roles-y-permisos)
4. [Sucursales](#sucursales)
5. [Clientes](#clientes)
6. [Proyectos](#proyectos)
7. [Tareas de Producción](#tareas-de-producción)
8. [Archivos](#archivos)
9. [Reportes](#reportes)
10. [Códigos de Estado](#códigos-de-estado)

---

## 🔐 AUTENTICACIÓN

### POST /login

Inicia sesión y obtiene un token de acceso.

**Request:**

```json
{
    "email": "usuario@example.com",
    "password": "contraseña123"
}
```

**Response 200:**

```json
{
    "token": "1|abcdefghijklmnopqrstuvwxyz",
    "user": {
        "id": 1,
        "name": "Usuario Ejemplo",
        "email": "usuario@example.com",
        "roles": [
            {
                "id": 1,
                "name": "Admin",
                "description": "Administración general"
            }
        ],
        "permissions": [
            "users.manage",
            "projects.view",
            "projects.manage"
        ]
    }
}
```

**Response 401:**

```json
{
    "error": "Credenciales incorrectas"
}
```

---

### POST /register

Registra un nuevo usuario.

**Request:**

```json
{
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "password": "contraseña123",
    "password_confirmation": "contraseña123"
}
```

**Response 201:**

```json
{
    "token": "2|xyz...",
    "user": {
        "id": 2,
        "name": "Nuevo Usuario",
        "email": "nuevo@example.com"
    }
}
```

---

### GET /me

Obtiene el perfil del usuario autenticado.

**Headers:**

```
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "id": 1,
    "name": "Usuario Ejemplo",
    "email": "usuario@example.com",
    "roles": [...],
    "permissions": [...]
}
```

---

### POST /logout

Cierra la sesión del usuario.

**Headers:**

```
Authorization: Bearer {token}
```

**Response 200:**

```json
{
    "message": "Sesión cerrada exitosamente"
}
```

---

## 👥 USUARIOS

### GET /users

Lista todos los usuarios.

**Permisos requeridos:** `Admin` o `SuperAdmin`

**Query Parameters:**

- `page` (opcional): Número de página
- `per_page` (opcional): Elementos por página

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "Usuario 1",
        "email": "usuario1@example.com",
        "created_at": "2025-11-20T10:00:00.000000Z",
        "updated_at": "2025-11-20T10:00:00.000000Z"
    }
]
```

---

### POST /users

Crea un nuevo usuario.

**Permisos requeridos:** `Admin` o `SuperAdmin`

**Request:**

```json
{
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "password": "contraseña123"
}
```

**Validaciones:**

- `name`: requerido, string, máx 255 caracteres
- `email`: requerido, email válido, único
- `password`: requerido, mín 8 caracteres

**Response 201:**

```json
{
    "id": 3,
    "name": "Nuevo Usuario",
    "email": "nuevo@example.com",
    "created_at": "2025-11-23T10:00:00.000000Z"
}
```

---

### GET /users/{id}

Obtiene un usuario específico.

**Response 200:**

```json
{
    "id": 1,
    "name": "Usuario 1",
    "email": "usuario1@example.com",
    "roles": [...],
    "created_at": "2025-11-20T10:00:00.000000Z"
}
```

---

### PUT /users/{id}

Actualiza un usuario.

**Request:**

```json
{
    "name": "Nombre Actualizado",
    "email": "actualizado@example.com"
}
```

**Response 200:**

```json
{
    "id": 1,
    "name": "Nombre Actualizado",
    "email": "actualizado@example.com"
}
```

---

### DELETE /users/{id}

Elimina un usuario.

**Response 200:**

```json
{
    "message": "Usuario eliminado"
}
```

---

## 🎭 ROLES Y PERMISOS

### GET /roles

Lista todos los roles.

**Permisos requeridos:** `SuperAdmin`

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "SuperAdmin",
        "description": "Acceso total al sistema",
        "created_at": "2025-11-20T10:00:00.000000Z"
    }
]
```

---

### POST /roles

Crea un nuevo rol.

**Request:**

```json
{
    "name": "Editor",
    "description": "Gestión de proyectos"
}
```

**Response 201:**

```json
{
    "id": 5,
    "name": "Editor",
    "description": "Gestión de proyectos"
}
```

---

### POST /roles/{id}/permissions

Asigna permisos a un rol.

**Request:**

```json
{
    "permission_ids": [1, 2, 3, 4]
}
```

**Response 200:**

```json
{
    "message": "Permisos asignados exitosamente"
}
```

---

### GET /permissions

Lista todos los permisos.

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "users.manage",
        "description": "Gestionar usuarios"
    },
    {
        "id": 2,
        "name": "projects.view",
        "description": "Ver proyectos"
    }
]
```

---

### POST /users/{user}/roles

Asigna un rol a un usuario.

**Request:**

```json
{
    "role_id": 2
}
```

**Response 200:**

```json
{
    "message": "Rol asignado exitosamente"
}
```

---

## 🏢 SUCURSALES

### GET /branches

Lista todas las sucursales.

**Permisos requeridos:** `branches.view`

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "Sucursal Centro",
        "address": "Calle Principal 123",
        "city": "Ciudad",
        "manager_name": "Juan Pérez",
        "status": "active",
        "created_at": "2025-11-20T10:00:00.000000Z"
    }
]
```

---

### POST /branches

Crea una nueva sucursal.

**Permisos requeridos:** `branches.manage`

**Request:**

```json
{
    "name": "Sucursal Norte",
    "address": "Av. Norte 456",
    "city": "Ciudad",
    "manager_name": "María García",
    "status": "active"
}
```

**Validaciones:**

- `name`: requerido, string, máx 255
- `address`: opcional, string
- `city`: opcional, string
- `manager_name`: opcional, string
- `status`: opcional, enum (active, inactive)

**Response 201:**

```json
{
    "id": 2,
    "name": "Sucursal Norte",
    "address": "Av. Norte 456",
    "city": "Ciudad",
    "manager_name": "María García",
    "status": "active"
}
```

---

### PUT /branches/{id}

Actualiza una sucursal.

**Request:**

```json
{
    "name": "Sucursal Centro Actualizada",
    "status": "inactive"
}
```

**Response 200:**

```json
{
    "id": 1,
    "name": "Sucursal Centro Actualizada",
    "status": "inactive"
}
```

---

### DELETE /branches/{id}

Elimina una sucursal.

**Response 200:**

```json
{
    "message": "Sucursal eliminada"
}
```

---

## 👤 CLIENTES

### GET /clients

Lista todos los clientes.

**Permisos requeridos:** `clients.view`

**Query Parameters:**

- `search` (opcional): Búsqueda por nombre, email o teléfono
- `status` (opcional): Filtrar por estado

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "Cliente Ejemplo",
        "phone": "+1234567890",
        "email": "cliente@example.com",
        "notes": "Cliente VIP",
        "status": "active",
        "registered_at": "2025-11-20T10:00:00.000000Z",
        "created_at": "2025-11-20T10:00:00.000000Z"
    }
]
```

---

### POST /clients

Crea un nuevo cliente.

**Permisos requeridos:** `clients.manage`

**Request:**

```json
{
    "name": "Nuevo Cliente",
    "phone": "+1234567890",
    "email": "nuevo@example.com",
    "notes": "Notas del cliente",
    "status": "active",
    "registered_at": "2025-11-23T10:00:00.000000Z"
}
```

**Validaciones:**

- `name`: requerido, string, máx 255
- `phone`: opcional, string
- `email`: opcional, email válido
- `notes`: opcional, texto
- `status`: opcional, enum (active, inactive)
- `registered_at`: opcional, fecha

**Response 201:**

```json
{
    "id": 2,
    "name": "Nuevo Cliente",
    "phone": "+1234567890",
    "email": "nuevo@example.com",
    "status": "active"
}
```

---

### GET /clients/{id}

Obtiene un cliente específico.

**Response 200:**

```json
{
    "id": 1,
    "name": "Cliente Ejemplo",
    "phone": "+1234567890",
    "email": "cliente@example.com",
    "projects": [
        {
            "id": 1,
            "title": "Proyecto 1",
            "status": "in_progress"
        }
    ]
}
```

---

### PUT /clients/{id}

Actualiza un cliente.

**Request:**

```json
{
    "name": "Cliente Actualizado",
    "status": "inactive"
}
```

**Response 200:**

```json
{
    "id": 1,
    "name": "Cliente Actualizado",
    "status": "inactive"
}
```

---

### DELETE /clients/{id}

Elimina un cliente.

**Response 200:**

```json
{
    "message": "Cliente eliminado"
}
```

---

## 📁 PROYECTOS

### GET /projects

Lista todos los proyectos.

**Permisos requeridos:** `projects.view`

**Query Parameters:**

- `search` (opcional): Búsqueda por título
- `status` (opcional): Filtrar por estado
- `client_id` (opcional): Filtrar por cliente
- `branch_id` (opcional): Filtrar por sucursal
- `priority` (opcional): Filtrar por prioridad

**Response 200:**

```json
[
    {
        "id": 1,
        "client_id": 1,
        "branch_id": 1,
        "responsible_id": 2,
        "title": "Boda María y Juan",
        "type": "boda",
        "session_date": "2025-12-15T14:00:00.000000Z",
        "estimated_delivery_date": "2026-01-15T00:00:00.000000Z",
        "delivered_at": null,
        "status": "in_progress",
        "internal_notes": "Cliente VIP, prioridad alta",
        "priority": 2,
        "created_at": "2025-11-20T10:00:00.000000Z",
        "client": {
            "id": 1,
            "name": "María García"
        },
        "branch": {
            "id": 1,
            "name": "Sucursal Centro"
        },
        "responsible": {
            "id": 2,
            "name": "Juan Pérez"
        }
    }
]
```

---

### POST /projects

Crea un nuevo proyecto.

**Permisos requeridos:** `projects.manage`

**Request:**

```json
{
    "client_id": 1,
    "branch_id": 1,
    "responsible_id": 2,
    "title": "Sesión Familiar",
    "type": "familia",
    "session_date": "2025-12-20T10:00:00.000000Z",
    "estimated_delivery_date": "2026-01-20T00:00:00.000000Z",
    "priority": 1,
    "internal_notes": "Cliente nuevo",
    "status": "pending"
}
```

**Validaciones:**

- `client_id`: requerido, existe en tabla clients
- `branch_id`: opcional, existe en tabla branches
- `responsible_id`: opcional, existe en tabla users
- `title`: requerido, string, máx 255
- `type`: opcional, string
- `session_date`: opcional, fecha
- `estimated_delivery_date`: opcional, fecha
- `priority`: opcional, entero entre 1 y 10
- `internal_notes`: opcional, texto
- `status`: enum (pending, in_progress, delivered, cancelled)

**Response 201:**

```json
{
    "id": 2,
    "client_id": 1,
    "title": "Sesión Familiar",
    "status": "pending",
    "created_at": "2025-11-23T10:00:00.000000Z"
}
```

---

### GET /projects/{id}

Obtiene un proyecto específico con todas sus relaciones.

**Response 200:**

```json
{
    "id": 1,
    "title": "Boda María y Juan",
    "client": {...},
    "branch": {...},
    "responsible": {...},
    "production_tasks": [
        {
            "id": 1,
            "name": "Edición inicial",
            "status": "in_progress"
        }
    ],
    "files": [
        {
            "id": 1,
            "file_name": "foto1.jpg",
            "type": "raw"
        }
    ]
}
```

---

### PUT /projects/{id}

Actualiza un proyecto.

**Request:**

```json
{
    "status": "delivered",
    "delivered_at": "2025-11-23T10:00:00.000000Z"
}
```

**Response 200:**

```json
{
    "id": 1,
    "status": "delivered",
    "delivered_at": "2025-11-23T10:00:00.000000Z"
}
```

---

### DELETE /projects/{id}

Elimina un proyecto.

**Response 200:**

```json
{
    "message": "Proyecto eliminado"
}
```

---

## 📋 TAREAS DE PRODUCCIÓN

### GET /production

Lista todas las tareas de producción.

**Permisos requeridos:** `production.view`

**Response 200:**

```json
[
    {
        "id": 1,
        "project_id": 1,
        "editor_id": 3,
        "name": "Edición de fotos seleccionadas",
        "status": "in_progress",
        "started_at": "2025-11-22T09:00:00.000000Z",
        "finished_at": null,
        "estimated_minutes": 120,
        "spent_minutes": 60,
        "notes": "50% completado",
        "created_at": "2025-11-22T08:00:00.000000Z"
    }
]
```

---

### POST /production

Crea una nueva tarea de producción.

**Permisos requeridos:** `production.manage`

**Request:**

```json
{
    "project_id": 1,
    "editor_id": 3,
    "name": "Retoque final",
    "status": "pending",
    "estimated_minutes": 180,
    "notes": "Aplicar filtros especiales"
}
```

**Validaciones:**

- `project_id`: requerido, existe en tabla projects
- `editor_id`: opcional, existe en tabla users
- `name`: requerido, string, máx 255
- `status`: enum (pending, in_progress, review, completed, cancelled)
- `started_at`: opcional, fecha
- `finished_at`: opcional, fecha
- `estimated_minutes`: opcional, entero
- `spent_minutes`: opcional, entero
- `notes`: opcional, texto

**Response 201:**

```json
{
    "id": 2,
    "project_id": 1,
    "name": "Retoque final",
    "status": "pending"
}
```

---

### PUT /production/{id}

Actualiza una tarea de producción.

**Request:**

```json
{
    "status": "completed",
    "finished_at": "2025-11-23T15:00:00.000000Z",
    "spent_minutes": 150
}
```

**Response 200:**

```json
{
    "id": 1,
    "status": "completed",
    "finished_at": "2025-11-23T15:00:00.000000Z",
    "spent_minutes": 150
}
```

---

### DELETE /production/{id}

Elimina una tarea de producción.

**Response 200:**

```json
{
    "message": "Tarea eliminada"
}
```

---

## 📎 ARCHIVOS

### POST /project-files

Sube un archivo a un proyecto.

**Permisos requeridos:** `files.upload`

**Content-Type:** `multipart/form-data`

**Request:**

```
project_id: 1
file: [archivo binario]
type: raw
```

**Validaciones:**

- `project_id`: requerido, existe en tabla projects
- `file`: requerido, archivo
- `type`: opcional, enum (raw, edited, final, other)

**Response 201:**

```json
{
    "id": 1,
    "project_id": 1,
    "uploaded_by": 2,
    "file_path": "project_files/1637654321_foto.jpg",
    "file_name": "foto.jpg",
    "disk": "public",
    "mime_type": "image/jpeg",
    "size_bytes": 2048576,
    "type": "raw",
    "created_at": "2025-11-23T10:00:00.000000Z"
}
```

---

## 📊 REPORTES

### GET /reports/summary

Obtiene KPIs principales del sistema.

**Permisos requeridos:** `reports.view`

**Response 200:**

```json
{
    "total_users": 15,
    "total_clients": 45,
    "projects_active": 12,
    "projects_month": 8
}
```

---

### GET /reports/projects-by-branch

Obtiene cantidad de proyectos por sucursal.

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "Sucursal Centro",
        "projects_count": 25
    },
    {
        "id": 2,
        "name": "Sucursal Norte",
        "projects_count": 18
    }
]
```

---

### GET /reports/productivity

Obtiene productividad por usuario (basado en auditoría).

**Response 200:**

```json
[
    {
        "id": 1,
        "name": "Usuario 1",
        "audit_logs_count": 150
    },
    {
        "id": 2,
        "name": "Usuario 2",
        "audit_logs_count": 98
    }
]
```

---

## 📋 CÓDIGOS DE ESTADO

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Petición mal formada |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Error de validación |
| 500 | Internal Server Error - Error del servidor |

---

## 🔒 HEADERS REQUERIDOS

### Para todas las peticiones

```
Accept: application/json
Content-Type: application/json
```

### Para peticiones autenticadas

```
Authorization: Bearer {token}
```

### Para upload de archivos

```
Content-Type: multipart/form-data
Authorization: Bearer {token}
```

---

## 🚨 MANEJO DE ERRORES

### Error de Validación (422)

```json
{
    "message": "The given data was invalid.",
    "errors": {
        "email": [
            "El campo email es obligatorio."
        ],
        "password": [
            "La contraseña debe tener al menos 8 caracteres."
        ]
    }
}
```

### Error de Autenticación (401)

```json
{
    "error": "No autenticado"
}
```

### Error de Permisos (403)

```json
{
    "error": "Acceso denegado: permiso insuficiente",
    "required_permissions": ["projects.manage"]
}
```

### Error de Recurso No Encontrado (404)

```json
{
    "message": "No query results for model [App\\Models\\Project] 999"
}
```

---

## 📝 NOTAS ADICIONALES

1. **Paginación:** Todos los endpoints de listado soportan paginación mediante `?page=1&per_page=20`

2. **Filtros:** Los endpoints de listado soportan filtros mediante query parameters

3. **Ordenamiento:** Por defecto, los listados se ordenan por `id DESC`

4. **Relaciones:** Los endpoints `show` incluyen relaciones cargadas con `with()`

5. **Auditoría:** Todas las acciones de creación, actualización y eliminación se registran automáticamente

6. **Timestamps:** Todos los modelos incluyen `created_at` y `updated_at`

7. **Soft Deletes:** Actualmente no implementado, pero recomendado para producción

---

**Versión de la documentación:** 1.0.0  
**Última actualización:** 23 de Noviembre, 2025
