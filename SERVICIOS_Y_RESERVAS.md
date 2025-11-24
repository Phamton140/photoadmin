# 📦 Sistema de Servicios y Reservas - PhotoAdmin

## ✅ Estado de la Base de Datos

### Migraciones Ejecutadas

- ✅ `categories` - Categorías y subcategorías (jerárquicas)
- ✅ `packages` - Paquetes de servicios
- ✅ `clothes` - Vestimentas
- ✅ `reservations` - Reservas (polimórficas)
- ✅ `branches` - Sucursales (actualizado: campo `phone` en lugar de `city`)
- ✅ `clients` - Clientes

### Datos Iniciales (Seeders)

- ✅ **24 Categorías** creadas (incluyendo subcategorías)
  - Bodas (Básica, Premium, Destino)
  - Quinceaños
  - Eventos Corporativos
  - Vestidos de Novia (Clásicos, Modernos, Vintage)
  - Trajes
  - Accesorios

- ✅ **14 Permisos** configurados:
  - `branches.view`, `branches.manage`
  - `clients.view`, `clients.manage`
  - `projects.view`, `projects.manage`
  - `production.view`, `production.manage`
  - `files.upload`
  - `reports.view`
  - `packages.manage` ⭐ NUEVO
  - `clothes.manage` ⭐ NUEVO
  - `reservations.manage` ⭐ NUEVO

- ✅ **4 Roles** creados:
  - SuperAdmin (todos los permisos)
  - Admin
  - Editor
  - Viewer

---

## 🔌 API Endpoints Disponibles

### 📦 Paquetes (Packages)

**Requiere permiso:** `packages.manage`

```http
GET    /api/packages           # Listar todos los paquetes
POST   /api/packages           # Crear nuevo paquete
GET    /api/packages/{id}      # Ver detalles de un paquete
PUT    /api/packages/{id}      # Actualizar paquete
DELETE /api/packages/{id}      # Eliminar paquete
```

**Campos de un Paquete:**

```json
{
  "name": "Boda Premium",
  "category_id": 1,
  "subcategory_id": 2,          // opcional
  "description": "Paquete completo para bodas premium...",
  "price": 5000.00,
  "duration": 8,
  "duration_unit": "hours"      // "hours" o "days"
}
```

---

### 👗 Vestimentas (Clothes)

**Requiere permiso:** `clothes.manage`

```http
GET    /api/clothes            # Listar todas las vestimentas
POST   /api/clothes            # Crear nueva vestimenta (con imagen)
GET    /api/clothes/{id}       # Ver detalles de una vestimenta
PUT    /api/clothes/{id}       # Actualizar vestimenta
DELETE /api/clothes/{id}       # Eliminar vestimenta
```

**Campos de una Vestimenta:**

```json
{
  "image": "archivo_imagen.jpg",  // upload multipart/form-data
  "name": "Vestido de Novia Clásico",
  "category_id": 7,
  "subcategory_id": 10,           // opcional
  "branch_id": 1,
  "price": 800.00,                // opcional
  "status": "available"           // available, reserved, laundry, broken, in_session
}
```

**Estados de Vestimenta:**

- `available` - Disponible (por defecto)
- `reserved` - Reservado
- `laundry` - En lavandería
- `broken` - Averiado
- `in_session` - En sesión

---

### 📅 Reservas (Reservations)

**Requiere permiso:** `reservations.manage`

```http
GET    /api/reservations                # Listar reservas (con filtros)
GET    /api/reservations/calendar       # Formato FullCalendar
POST   /api/reservations                # Crear nueva reserva
GET    /api/reservations/{id}           # Ver detalles de una reserva
PUT    /api/reservations/{id}           # Actualizar reserva
DELETE /api/reservations/{id}           # Cancelar reserva
```

**Crear una Reserva:**

```json
{
  "client_id": 1,
  "serviceable_type": "package",    // "package" o "cloth"
  "serviceable_id": 1,
  "date": "2025-12-25 14:00:00",
  "total_amount": 500.00
}
```

**Filtros disponibles en GET /api/reservations:**

- `?client_id=1` - Filtrar por cliente
- `?date_from=2025-12-01` - Desde fecha
- `?date_to=2025-12-31` - Hasta fecha
- `?serviceable_type=package` - Tipo de servicio

---

## 📅 Integración con FullCalendar

### Endpoint del Calendario

```http
GET /api/reservations/calendar?start=2025-12-01&end=2025-12-31
```

**Respuesta (formato FullCalendar):**

```json
[
  {
    "id": 1,
    "title": "Juan Pérez - Boda Premium",
    "start": "2025-12-25 14:00:00",
    "end": "2025-12-25 14:00:00",
    "extendedProps": {
      "client_id": 1,
      "client_name": "Juan Pérez",
      "service_type": "Package",
      "service_name": "Boda Premium",
      "total_amount": 5000.00
    }
  }
]
```

### Ejemplo de Integración (JavaScript)

```javascript
$('#calendar').fullCalendar({
  events: {
    url: '/api/reservations/calendar',
    type: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    data: function() {
      return {
        start: moment().startOf('month').format('YYYY-MM-DD'),
        end: moment().endOf('month').format('YYYY-MM-DD')
      };
    }
  },
  eventClick: function(event) {
    // Mostrar detalles de la reserva
    console.log(event.extendedProps);
  }
});
```

---

## 🔐 Autenticación

Todas las rutas de servicios y reservas requieren autenticación con **Sanctum**.

### Obtener Token

```http
POST /api/login
Content-Type: application/json

{
  "email": "superadmin@system.com",
  "password": "password123"
}
```

**Respuesta:**

```json
{
  "token": "1|abc123...",
  "user": { ... }
}
```

### Usar el Token

```http
GET /api/packages
Authorization: Bearer 1|abc123...
```

---

## 🧪 Pruebas Rápidas

### 1. Crear una Categoría

```bash
curl -X POST http://localhost:8000/api/categories \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bodas VIP","parent_id":null}'
```

### 2. Crear un Paquete

```bash
curl -X POST http://localhost:8000/api/packages \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Paquete Boda Completa",
    "category_id":1,
    "description":"Incluye fotografía, video, decoración",
    "price":8000,
    "duration":10,
    "duration_unit":"hours"
  }'
```

### 3. Crear una Vestimenta

```bash
curl -X POST http://localhost:8000/api/clothes \
  -H "Authorization: Bearer {token}" \
  -F "name=Vestido de Novia Elegante" \
  -F "category_id=7" \
  -F "branch_id=1" \
  -F "price=1200" \
  -F "status=available" \
  -F "image=@/ruta/a/imagen.jpg"
```

### 4. Crear una Reserva

```bash
curl -X POST http://localhost:8000/api/reservations \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id":1,
    "serviceable_type":"package",
    "serviceable_id":1,
    "date":"2025-12-25 15:00:00",
    "total_amount":8000
  }'
```

### 5. Ver Calendario

```bash
curl -X GET "http://localhost:8000/api/reservations/calendar?start=2025-12-01&end=2025-12-31" \
  -H "Authorization: Bearer {token}"
```

---

## 📊 Estructura de la Base de Datos

### Tabla: categories

```sql
id              BIGINT PK
name            VARCHAR
parent_id       BIGINT NULL → FK categories(id)
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: packages

```sql
id              BIGINT PK
name            VARCHAR
category_id     BIGINT → FK categories(id)
subcategory_id  BIGINT NULL → FK categories(id)
description     TEXT NULL
price           DECIMAL(10,2) NULL
duration        INT NULL
duration_unit   ENUM('hours','days')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: clothes

```sql
id              BIGINT PK
image           VARCHAR NULL
name            VARCHAR
category_id     BIGINT → FK categories(id)
subcategory_id  BIGINT NULL → FK categories(id)
branch_id       BIGINT → FK branches(id)
price           DECIMAL(10,2) NULL
status          ENUM('reserved','available','laundry','broken','in_session')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### Tabla: reservations (Polimórfica)

```sql
id                  BIGINT PK
client_id           BIGINT → FK clients(id)
serviceable_id      BIGINT
serviceable_type    VARCHAR (App\Models\Package o App\Models\Cloth)
date                DATETIME
total_amount        DECIMAL(10,2) NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

---

## 🚀 Próximos Pasos Sugeridos

1. **Validación de Disponibilidad**
   - Evitar doble reserva de vestimentas
   - Verificar conflictos de horario

2. **Estados de Pago**
   - Agregar campo `payment_status` (pending, paid, cancelled)
   - Registro de pagos parciales

3. **Notificaciones**
   - Email al crear reserva
   - Recordatorios automáticos

4. **Reportes**
   - Ingresos por período
   - Vestimentas más reservadas
   - Clientes frecuentes

5. **Frontend**
   - Implementar filtros avanzados
   - Vista de calendario interactiva
   - Galería de vestimentas

---

## 📝 Credenciales de Prueba

**SuperAdmin:**

- Email: `superadmin@system.com`
- Password: `password123`

---

## 🛠️ Comandos Útiles

```bash
# Ver estado de migraciones
php artisan migrate:status

# Ejecutar seeders
php artisan db:seed

# Limpiar caché
php artisan config:clear
php artisan route:clear
php artisan cache:clear

# Ver todas las rutas
php artisan route:list

# Ver rutas de servicios
php artisan route:list --path=packages
php artisan route:list --path=clothes
php artisan route:list --path=reservations
```

---

**Última actualización:** 2025-11-23
**Versión:** 1.0.0
