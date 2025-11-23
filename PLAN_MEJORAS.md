# 📋 PLAN DE MEJORAS - PhotoAdmin Backend

## 🎯 FASE 1: MEJORAS CRÍTICAS (1 semana)

### 1.1 Paginación en Listados (1 día)

**Archivos a modificar:**

- `app/Http/Controllers/ProjectController.php`
- `app/Http/Controllers/ClientController.php`
- `app/Http/Controllers/BranchController.php`
- `app/Http/Controllers/ProductionTaskController.php`
- `app/Http/Controllers/UserController.php`

**Implementación:**

```php
// Antes:
public function index()
{
    return response()->json(
        Project::with(['client','branch','responsible'])->orderBy('id','desc')->get()
    );
}

// Después:
public function index(Request $request)
{
    $perPage = $request->input('per_page', 20); // Default 20
    
    return response()->json(
        Project::with(['client','branch','responsible'])
            ->orderBy('id','desc')
            ->paginate($perPage)
    );
}
```

**Uso desde frontend:**

```
GET /api/projects?page=1&per_page=20
```

---

### 1.2 Filtros y Búsqueda (2-3 días)

**Crear nuevo trait:** `app/Traits/Filterable.php`

```php
<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait Filterable
{
    public function scopeFilter(Builder $query, array $filters)
    {
        foreach ($filters as $field => $value) {
            if (empty($value)) continue;
            
            // Búsqueda por texto
            if ($field === 'search') {
                $searchableFields = $this->searchable ?? ['name'];
                $query->where(function($q) use ($searchableFields, $value) {
                    foreach ($searchableFields as $field) {
                        $q->orWhere($field, 'LIKE', "%{$value}%");
                    }
                });
            }
            // Filtros exactos
            elseif (in_array($field, $this->filterable ?? [])) {
                $query->where($field, $value);
            }
            // Rangos de fecha
            elseif ($field === 'date_from') {
                $query->where('created_at', '>=', $value);
            }
            elseif ($field === 'date_to') {
                $query->where('created_at', '<=', $value);
            }
        }
        
        return $query;
    }
}
```

**Usar en modelos:**

```php
// En Project.php
use App\Traits\Filterable;

class Project extends Model
{
    use Filterable;
    
    protected $searchable = ['title', 'internal_notes'];
    protected $filterable = ['status', 'client_id', 'branch_id', 'priority'];
}
```

**Actualizar controladores:**

```php
public function index(Request $request)
{
    $filters = $request->only(['search', 'status', 'client_id', 'branch_id', 'date_from', 'date_to']);
    
    return response()->json(
        Project::with(['client','branch','responsible'])
            ->filter($filters)
            ->orderBy('id','desc')
            ->paginate($request->input('per_page', 20))
    );
}
```

**Uso desde frontend:**

```
GET /api/projects?search=boda&status=in_progress&branch_id=1&date_from=2025-01-01
```

---

### 1.3 Validación Mejorada de Archivos (2 días)

**Actualizar:** `app/Http/Controllers/ProjectFileController.php`

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'project_id' => 'required|exists:projects,id',
        'file' => [
            'required',
            'file',
            'max:102400', // 100MB
            'mimes:jpg,jpeg,png,gif,pdf,mp4,mov,avi,zip,rar'
        ],
        'type' => 'nullable|in:raw,edited,final,other'
    ]);
    
    $file = $request->file('file');
    
    // Generar nombre único
    $fileName = time() . '_' . $file->getClientOriginalName();
    
    // Guardar en storage
    $path = $file->storeAs('project_files', $fileName, 'public');
    
    // Crear registro
    $projectFile = ProjectFile::create([
        'project_id' => $validated['project_id'],
        'uploaded_by' => auth()->id(),
        'file_path' => $path,
        'file_name' => $file->getClientOriginalName(),
        'disk' => 'public',
        'mime_type' => $file->getMimeType(),
        'size_bytes' => $file->getSize(),
        'type' => $validated['type'] ?? 'other'
    ]);
    
    // Auditoría
    AuditLog::create([
        'user_id' => auth()->id(),
        'action' => 'upload_file',
        'ip_address' => $request->ip(),
        'details' => json_encode([
            'file_name' => $fileName,
            'project_id' => $validated['project_id']
        ])
    ]);
    
    return response()->json($projectFile, 201);
}

public function download($id)
{
    $file = ProjectFile::findOrFail($id);
    
    // Verificar permiso
    if (!auth()->user()->hasPermission('files.download')) {
        return response()->json(['error' => 'Sin permiso'], 403);
    }
    
    return Storage::disk($file->disk)->download($file->file_path, $file->file_name);
}

public function destroy($id)
{
    $file = ProjectFile::findOrFail($id);
    
    // Eliminar archivo físico
    Storage::disk($file->disk)->delete($file->file_path);
    
    // Eliminar registro
    $file->delete();
    
    return response()->json(['message' => 'Archivo eliminado']);
}
```

**Agregar rutas:**

```php
// En routes/api.php
Route::middleware(['permission:files.download'])->get('/project-files/{id}/download', [
    ProjectFileController::class,
    'download'
]);

Route::middleware(['permission:files.upload'])->delete('/project-files/{id}', [
    ProjectFileController::class,
    'destroy'
]);
```

**Agregar permiso:**

```php
// En PermissionSeeder.php
['name' => 'files.download', 'description' => 'Descargar archivos'],
['name' => 'files.delete', 'description' => 'Eliminar archivos'],
```

---

### 1.4 Configuración de CORS (30 minutos)

**Actualizar:** `config/cors.php`

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        // Agregar dominio de producción
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
```

**Agregar a `.env`:**

```env
FRONTEND_URL=https://tu-frontend.hostinger.com
SANCTUM_STATEFUL_DOMAINS=tu-frontend.hostinger.com
SESSION_DOMAIN=.tu-dominio.com
```

---

## 🎯 FASE 2: MEJORAS IMPORTANTES (1-2 semanas)

### 2.1 Soft Deletes (1 día)

**Crear migración:**

```bash
php artisan make:migration add_soft_deletes_to_tables
```

```php
public function up()
{
    Schema::table('projects', function (Blueprint $table) {
        $table->softDeletes();
    });
    
    Schema::table('clients', function (Blueprint $table) {
        $table->softDeletes();
    });
    
    Schema::table('production_tasks', function (Blueprint $table) {
        $table->softDeletes();
    });
}
```

**Actualizar modelos:**

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;
}
```

**Agregar endpoints de restauración:**

```php
// En ProjectController
public function restore($id)
{
    $project = Project::withTrashed()->findOrFail($id);
    $project->restore();
    
    return response()->json(['message' => 'Proyecto restaurado']);
}

public function forceDelete($id)
{
    $project = Project::withTrashed()->findOrFail($id);
    $project->forceDelete();
    
    return response()->json(['message' => 'Proyecto eliminado permanentemente']);
}
```

---

### 2.2 Notificaciones por Email (2-3 días)

**Configurar email en `.env`:**

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=tu-email@dominio.com
MAIL_PASSWORD=tu-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@dominio.com
MAIL_FROM_NAME="PhotoAdmin"
```

**Crear notificación:**

```bash
php artisan make:notification ProjectCreated
```

```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Models\Project;

class ProjectCreated extends Notification
{
    protected $project;
    
    public function __construct(Project $project)
    {
        $this->project = $project;
    }
    
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }
    
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nuevo Proyecto Creado')
            ->greeting('Hola ' . $notifiable->name)
            ->line('Se ha creado un nuevo proyecto: ' . $this->project->title)
            ->line('Cliente: ' . $this->project->client->name)
            ->action('Ver Proyecto', url('/projects/' . $this->project->id))
            ->line('¡Gracias por usar PhotoAdmin!');
    }
    
    public function toArray($notifiable)
    {
        return [
            'project_id' => $this->project->id,
            'project_title' => $this->project->title,
            'client_name' => $this->project->client->name
        ];
    }
}
```

**Crear migración para notificaciones:**

```bash
php artisan notifications:table
php artisan migrate
```

**Usar en controlador:**

```php
// En ProjectController::store()
$project = Project::create($validated);

// Notificar al responsable
if ($project->responsible) {
    $project->responsible->notify(new ProjectCreated($project));
}

// Notificar a admins
$admins = User::whereHas('roles', function($q) {
    $q->where('name', 'Admin');
})->get();

foreach ($admins as $admin) {
    $admin->notify(new ProjectCreated($project));
}
```

**Endpoint para ver notificaciones:**

```php
// En ProfileController
public function notifications()
{
    return response()->json(
        auth()->user()->notifications()->paginate(20)
    );
}

public function markAsRead($id)
{
    $notification = auth()->user()->notifications()->findOrFail($id);
    $notification->markAsRead();
    
    return response()->json(['message' => 'Notificación marcada como leída']);
}
```

---

### 2.3 Rate Limiting (1 hora)

**Actualizar:** `app/Providers/RouteServiceProvider.php`

```php
protected function configureRateLimiting()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });
    
    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });
}
```

**Aplicar en rutas:**

```php
// En routes/api.php
Route::middleware(['throttle:login'])->group(function () {
    Route::post('/login', [LoginController::class, 'login']);
    Route::post('/register', [RegisterController::class, 'register']);
});

Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    // rutas protegidas
});
```

---

### 2.4 Caché de Reportes (1 día)

**Actualizar:** `app/Http/Controllers/ReportController.php`

```php
use Illuminate\Support\Facades\Cache;

public function summary()
{
    return response()->json(
        Cache::remember('reports.summary', 3600, function() {
            return [
                'total_users' => User::count(),
                'total_clients' => Client::count(),
                'projects_active' => Project::where('status','in_progress')->count(),
                'projects_month' => Project::whereMonth('created_at', now()->month)->count(),
                'total_branches' => Branch::count(),
                'tasks_pending' => ProductionTask::where('status', 'pending')->count(),
            ];
        })
    );
}

public function projectsByBranch()
{
    return response()->json(
        Cache::remember('reports.projects_by_branch', 3600, function() {
            return Branch::withCount('projects')->get();
        })
    );
}

// Invalidar caché cuando se crean/actualizan datos
// En ProjectController::store()
Cache::forget('reports.summary');
Cache::forget('reports.projects_by_branch');
```

---

### 2.5 Testing Básico (1 semana)

**Crear tests:**

```bash
php artisan make:test AuthTest
php artisan make:test ProjectTest
php artisan make:test ClientTest
```

**Ejemplo:** `tests/Feature/AuthTest.php`

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_can_login_with_correct_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);
        
        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonStructure(['token', 'user']);
    }
    
    public function test_user_cannot_login_with_incorrect_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'wrong@example.com',
            'password' => 'wrongpassword'
        ]);
        
        $response->assertStatus(401);
    }
}
```

**Ejecutar tests:**

```bash
php artisan test
```

---

## 🎯 FASE 3: DEPLOYMENT (1 día)

### 3.1 Preparación

**1. Crear archivo de deployment:** `deploy.sh`

```bash
#!/bin/bash

echo "🚀 Iniciando deployment..."

# Actualizar código
git pull origin main

# Instalar dependencias
composer install --no-dev --optimize-autoloader

# Optimizaciones
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Migraciones
php artisan migrate --force

# Permisos
chmod -R 755 storage bootstrap/cache

echo "✅ Deployment completado!"
```

**2. Configurar `.env` de producción:**

```env
APP_NAME=PhotoAdmin
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://api.tu-dominio.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=photoadmin_prod
DB_USERNAME=usuario_db
DB_PASSWORD=contraseña_segura

SANCTUM_STATEFUL_DOMAINS=tu-frontend.com
SESSION_DOMAIN=.tu-dominio.com

MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
...
```

**3. Configurar Nginx (si aplica):**

```nginx
server {
    listen 80;
    server_name api.tu-dominio.com;
    root /home/usuario/photoadmin/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

## 📊 RESUMEN DE TIEMPOS

| Fase | Tarea | Tiempo Estimado |
|------|-------|-----------------|
| **FASE 1** | Paginación | 1 día |
| | Filtros y Búsqueda | 2-3 días |
| | Validación de Archivos | 2 días |
| | CORS | 30 min |
| | **Subtotal Fase 1** | **5-6 días** |
| **FASE 2** | Soft Deletes | 1 día |
| | Notificaciones | 2-3 días |
| | Rate Limiting | 1 hora |
| | Caché | 1 día |
| | Testing | 1 semana |
| | **Subtotal Fase 2** | **11-12 días** |
| **FASE 3** | Deployment | 1 día |
| | **TOTAL** | **17-19 días** |

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1 (Crítico)

- [ ] Implementar paginación en todos los listados
- [ ] Crear trait Filterable
- [ ] Agregar filtros a Project, Client, Branch
- [ ] Mejorar validación de archivos
- [ ] Agregar endpoints download/delete de archivos
- [ ] Configurar CORS
- [ ] Probar integración con frontend

### Fase 2 (Importante)

- [ ] Agregar soft deletes a modelos críticos
- [ ] Crear migración de soft deletes
- [ ] Configurar email en producción
- [ ] Crear notificaciones básicas
- [ ] Implementar rate limiting
- [ ] Agregar caché a reportes
- [ ] Escribir tests básicos
- [ ] Alcanzar 70%+ de cobertura

### Fase 3 (Deployment)

- [ ] Crear script de deployment
- [ ] Configurar .env de producción
- [ ] Configurar servidor web
- [ ] Migrar base de datos
- [ ] Ejecutar seeders
- [ ] Probar endpoints en producción
- [ ] Configurar backups automáticos
- [ ] Monitoreo de logs

---

## 🎓 RECOMENDACIONES FINALES

1. **Prioriza según necesidad:** Si el frontend ya está listo, enfócate en Fase 1 + Deployment
2. **Testing es importante:** Aunque tome tiempo, evita bugs en producción
3. **Documenta mientras desarrollas:** Facilita mantenimiento futuro
4. **Usa Git branches:** Crea branches para cada feature
5. **Backups regulares:** Especialmente antes de deployments
6. **Monitoreo:** Implementa logs y alertas desde el inicio

---

**¿Listo para empezar?** 🚀

Sugiero comenzar con la **Fase 1** para tener un backend robusto y listo para producción en 1 semana.
