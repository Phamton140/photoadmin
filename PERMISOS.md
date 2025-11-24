# 🔐 Permisos del Sistema - PhotoAdmin

## ✅ Estado Actual

**Total de permisos:** 15

### Permisos Disponibles

| ID | Nombre | Key | Módulo |
|----|--------|-----|--------|
| 1 | Ver sucursales | `branches.view` | branches |
| 2 | Gestionar sucursales | `branches.manage` | branches |
| 3 | Ver clientes | `clients.view` | clients |
| 4 | Gestionar clientes | `clients.manage` | clients |
| 5 | Ver proyectos | `projects.view` | projects |
| 6 | Gestionar proyectos | `projects.manage` | projects |
| 7 | Ver tareas de producción | `production.view` | production |
| 8 | Gestionar tareas de producción | `production.manage` | production |
| 9 | Subir archivos de proyecto | `files.upload` | files |
| 10 | Ver reportes | `reports.view` | reports |
| 11 | Gestionar categorías | `categories.manage` | categories |
| 12 | Gestionar paquetes | `packages.manage` | packages |
| 13 | Gestionar vestimentas | `clothes.manage` | clothes |
| 14 | Gestionar reservas | `reservations.manage` | reservations |

---

## 👥 Asignación de Permisos por Rol

### SuperAdmin

**Descripción:** Acceso total al sistema

**Permisos (14):**

- ✅ `branches.view` - Ver sucursales
- ✅ `branches.manage` - Gestionar sucursales
- ✅ `clients.view` - Ver clientes
- ✅ `clients.manage` - Gestionar clientes
- ✅ `projects.view` - Ver proyectos
- ✅ `projects.manage` - Gestionar proyectos
- ✅ `production.view` - Ver tareas de producción
- ✅ `production.manage` - Gestionar tareas de producción
- ✅ `files.upload` - Subir archivos de proyecto
- ✅ `reports.view` - Ver reportes
- ✅ `categories.manage` - Gestionar categorías ⭐ NUEVO
- ✅ `packages.manage` - Gestionar paquetes ⭐ NUEVO
- ✅ `clothes.manage` - Gestionar vestimentas ⭐ NUEVO
- ✅ `reservations.manage` - Gestionar reservas ⭐ NUEVO

---

### Admin

**Descripción:** Administración general

**Permisos (14):**

- ✅ `branches.view` - Ver sucursales
- ✅ `branches.manage` - Gestionar sucursales
- ✅ `clients.view` - Ver clientes
- ✅ `clients.manage` - Gestionar clientes
- ✅ `projects.view` - Ver proyectos
- ✅ `projects.manage` - Gestionar proyectos
- ✅ `production.view` - Ver tareas de producción
- ✅ `production.manage` - Gestionar tareas de producción
- ✅ `files.upload` - Subir archivos de proyecto
- ✅ `reports.view` - Ver reportes
- ✅ `categories.manage` - Gestionar categorías ⭐ NUEVO
- ✅ `packages.manage` - Gestionar paquetes ⭐ NUEVO
- ✅ `clothes.manage` - Gestionar vestimentas ⭐ NUEVO
- ✅ `reservations.manage` - Gestionar reservas ⭐ NUEVO

---

### Editor

**Descripción:** Gestión de proyectos, producción y servicios

**Permisos (9):**

- ✅ `projects.view` - Ver proyectos
- ✅ `projects.manage` - Gestionar proyectos
- ✅ `production.view` - Ver tareas de producción
- ✅ `production.manage` - Gestionar tareas de producción
- ✅ `files.upload` - Subir archivos de proyecto
- ✅ `categories.manage` - Gestionar categorías ⭐ NUEVO
- ✅ `packages.manage` - Gestionar paquetes ⭐ NUEVO
- ✅ `clothes.manage` - Gestionar vestimentas ⭐ NUEVO
- ✅ `reservations.manage` - Gestionar reservas ⭐ NUEVO

---

### Viewer

**Descripción:** Solo lectura

**Permisos (4):**

- ✅ `branches.view` - Ver sucursales
- ✅ `clients.view` - Ver clientes
- ✅ `projects.view` - Ver proyectos
- ✅ `reports.view` - Ver reportes

---

## 🔧 Comandos Útiles

### Ver todos los permisos y asignaciones

```bash
php artisan permissions:show
```

### Ejecutar seeders de permisos

```bash
# Solo permisos
php artisan db:seed --class=PermissionSeeder

# Asignar permisos a roles
php artisan db:seed --class=RolePermissionSeeder

# Todos los seeders
php artisan db:seed
```

### Verificar permisos en Tinker

```bash
php artisan tinker
```

```php
// Ver todos los permisos
Permission::all()->pluck('key', 'name');

// Ver permisos de un rol
$admin = Role::where('name', 'Admin')->first();
$admin->permissions->pluck('key');

// Ver roles de un usuario
$user = User::find(1);
$user->roles->pluck('name');

// Verificar si un usuario tiene un permiso
$user->roles->flatMap->permissions->pluck('key')->contains('categories.manage');
```

---

## 📋 Módulos y sus Permisos

### Sucursales (Branches)

- `branches.view` - Ver listado de sucursales
- `branches.manage` - Crear, editar, eliminar sucursales

### Clientes (Clients)

- `clients.view` - Ver listado de clientes
- `clients.manage` - Crear, editar, eliminar clientes

### Proyectos (Projects)

- `projects.view` - Ver listado de proyectos
- `projects.manage` - Crear, editar, eliminar proyectos

### Producción (Production)

- `production.view` - Ver tareas de producción
- `production.manage` - Crear, editar, eliminar tareas

### Archivos (Files)

- `files.upload` - Subir archivos a proyectos

### Reportes (Reports)

- `reports.view` - Ver reportes y estadísticas

### Categorías (Categories) ⭐ NUEVO

- `categories.manage` - Gestionar categorías y subcategorías

### Paquetes (Packages) ⭐ NUEVO

- `packages.manage` - Gestionar paquetes de servicios

### Vestimentas (Clothes) ⭐ NUEVO

- `clothes.manage` - Gestionar vestimentas

### Reservas (Reservations) ⭐ NUEVO

- `reservations.manage` - Gestionar reservas de servicios

---

## 🎯 Cómo Funciona el Sistema de Permisos

### 1. Middleware de Permisos

Las rutas están protegidas con middleware:

```php
Route::middleware(['permission:categories.manage'])->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    // ...
});
```

### 2. Verificación en el Backend

El middleware verifica que el usuario autenticado tenga el permiso requerido a través de sus roles asignados.

### 3. Asignación de Permisos

Los permisos se asignan a **roles**, no directamente a usuarios:

- Usuario → tiene → Roles
- Roles → tienen → Permisos

### 4. Verificación Manual (opcional)

```php
// En un controlador
if (! auth()->user()->roles->flatMap->permissions->pluck('key')->contains('categories.manage')) {
    abort(403, 'No tienes permiso para esta acción');
}
```

---

## 🔄 Actualizar Permisos

Si necesitas agregar nuevos permisos:

1. **Editar `PermissionSeeder.php`**

```php
['name' => 'Nuevo permiso', 'key' => 'module.action', 'module' => 'module'],
```

2. **Editar `RolePermissionSeeder.php`** (si quieres asignarlo a roles)

```php
Permission::whereIn('key', [
    'module.action', // nuevo permiso
])->pluck('id')->toArray()
```

3. **Ejecutar seeders**

```bash
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=RolePermissionSeeder
```

---

## ✅ Verificación

Para verificar que todo está correcto:

```bash
# 1. Ver permisos
php artisan permissions:show

# 2. Verificar que hay 15 permisos
php artisan tinker --execute="echo App\Models\Permission::count();"

# 3. Verificar que SuperAdmin tiene todos
php artisan tinker --execute="echo App\Models\Role::where('name','SuperAdmin')->first()->permissions->count();"
```

---

**Última actualización:** 2025-11-23
**Total de permisos:** 15
**Total de roles:** 4
