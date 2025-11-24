# 📊 Estructura de Base de Datos - Módulo de Reservaciones

## 🗂️ Tablas Principales

### 1. **`reservations`** - Tabla Principal de Reservaciones

| Campo | Tipo | Nulo | Default | Descripción |
|-------|------|------|---------|-------------|
| **id** | BIGINT UNSIGNED | NO | AUTO_INCREMENT | ID único de la reservación |
| **client_id** | BIGINT UNSIGNED | NO | - | FK → `clients.id` |
| **serviceable_id** | BIGINT UNSIGNED | NO | - | ID del servicio (polimórfico) |
| **serviceable_type** | VARCHAR(255) | NO | - | Tipo de servicio: `App\Models\Package` o `App\Models\Cloth` |
| **date** | DATETIME | NO | - | Fecha y hora de la reservación |
| **total_amount** | DECIMAL(10,2) | YES | NULL | Monto total de la reservación |
| **category** | VARCHAR(255) | YES | NULL | Categoría: 'Renta', 'Fiesta', 'Estudio', 'Exterior' |
| **paid_amount** | DECIMAL(10,2) | NO | 0.00 | Monto pagado hasta el momento |
| **payment_status** | ENUM | NO | 'pending' | Estado del pago: 'pending', 'partial', 'paid' |
| **payment_method** | VARCHAR(255) | YES | NULL | Método de pago: 'efectivo', 'transferencia', 'tarjeta' |
| **bank_code** | VARCHAR(255) | YES | NULL | Código del banco (para transferencias) |
| **transfer_screenshot** | VARCHAR(255) | YES | NULL | Ruta de la captura de transferencia |
| **created_at** | TIMESTAMP | YES | NULL | Fecha de creación |
| **updated_at** | TIMESTAMP | YES | NULL | Fecha de última actualización |

#### 🔑 Claves e Índices

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `client_id` → `clients(id)` ON DELETE CASCADE
- **INDEX**: `(serviceable_id, serviceable_type)` - Para búsquedas polimórficas

#### 📝 Notas

- `payment_status` se calcula automáticamente basándose en `paid_amount` vs `total_amount`
- `serviceable_*` permite asociar la reservación a un Package o Cloth (polimorfismo)
- `transfer_screenshot` almacena la ruta relativa: `transfers/filename.jpg`

---

### 2. **`reservation_services`** - Servicios Asociados a una Reservación

| Campo | Tipo | Nulo | Default | Descripción |
|-------|------|------|---------|-------------|
| **id** | BIGINT UNSIGNED | NO | AUTO_INCREMENT | ID único del servicio |
| **reservation_id** | BIGINT UNSIGNED | NO | - | FK → `reservations.id` |
| **service_id** | BIGINT UNSIGNED | NO | - | ID del servicio (Package o Cloth) |
| **service_type** | VARCHAR(255) | NO | - | Tipo: 'clothing' o 'package' |
| **unit_price** | DECIMAL(10,2) | NO | - | Precio unitario del servicio |
| **created_at** | TIMESTAMP | YES | NULL | Fecha de creación |
| **updated_at** | TIMESTAMP | YES | NULL | Fecha de última actualización |

#### 🔑 Claves e Índices

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `reservation_id` → `reservations(id)` ON DELETE CASCADE

#### 📝 Notas

- Permite asociar **múltiples servicios** a una sola reservación
- `service_type` indica si es 'clothing' (vestimenta) o 'package' (paquete)
- `unit_price` guarda el precio del servicio al momento de la reservación

---

## 🔗 Relaciones entre Tablas

```
┌─────────────────────────────────────────────────────────────────┐
│                         RESERVATIONS                            │
├─────────────────────────────────────────────────────────────────┤
│ id (PK)                                                         │
│ client_id (FK → clients)                                        │
│ serviceable_id (Polimórfico)                                    │
│ serviceable_type (Polimórfico)                                  │
│ date                                                            │
│ total_amount                                                    │
│ category                                                        │
│ paid_amount                                                     │
│ payment_status (ENUM: pending, partial, paid)                  │
│ payment_method (efectivo, transferencia, tarjeta)              │
│ bank_code                                                       │
│ transfer_screenshot                                             │
│ created_at, updated_at                                          │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
         ▼                    ▼                    ▼
    ┌─────────┐      ┌──────────────┐    ┌──────────────────┐
    │ CLIENTS │      │   PACKAGES   │    │ RESERVATION_     │
    │         │      │      o       │    │   SERVICES       │
    │ id (PK) │      │   CLOTHES    │    ├──────────────────┤
    │ name    │      │              │    │ id (PK)          │
    │ phone   │      │ id (PK)      │    │ reservation_id   │
    │ email   │      │ name         │    │ service_id       │
    │ ...     │      │ price        │    │ service_type     │
    └─────────┘      │ ...          │    │ unit_price       │
                     └──────────────┘    └──────────────────┘
```

---

## 📐 Diagrama de Relaciones Detallado

```
CLIENTS (1) ──────────────────────── (N) RESERVATIONS
    │                                        │
    │                                        │ (1)
    │                                        │
    │                                        ▼ (N)
    │                              RESERVATION_SERVICES
    │                                        │
    │                                        │
    │                                        ▼
    │                              ┌─────────────────┐
    │                              │   PACKAGES (N)  │
    │                              │       o         │
    │                              │   CLOTHES (N)   │
    │                              └─────────────────┘
    │
    └──► Una reservación pertenece a UN cliente
         Una reservación puede tener MÚLTIPLES servicios
         Cada servicio puede ser un Package o un Cloth
```

---

## 🎯 Relaciones en Eloquent

### **Modelo: `Reservation`**

```php
class Reservation extends Model
{
    // Relación: Pertenece a un cliente
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Relación polimórfica: Servicio principal (Package o Cloth)
    public function serviceable(): MorphTo
    {
        return $this->morphTo();
    }

    // Relación: Tiene múltiples servicios
    public function reservationServices(): HasMany
    {
        return $this->hasMany(ReservationService::class);
    }
}
```

### **Modelo: `ReservationService`**

```php
class ReservationService extends Model
{
    // Relación: Pertenece a una reservación
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    // Relación polimórfica: Servicio (Package o Cloth)
    public function serviceable(): MorphTo
    {
        return $this->morphTo('serviceable', 'service_type', 'service_id');
    }
}
```

### **Modelo: `Client`**

```php
class Client extends Model
{
    // Relación: Tiene múltiples reservaciones
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
```

### **Modelo: `Package` / `Cloth`**

```php
class Package extends Model
{
    // Relación polimórfica inversa
    public function reservations(): MorphMany
    {
        return $this->morphMany(Reservation::class, 'serviceable');
    }
}
```

---

## 💡 Ejemplos de Uso

### 1. **Obtener una reservación con todos sus datos**

```php
$reservation = Reservation::with([
    'client',
    'serviceable',
    'reservationServices.serviceable'
])->find(1);

// Acceder a los datos
echo $reservation->client->name;
echo $reservation->serviceable->name; // Package o Cloth principal
echo $reservation->payment_status; // pending, partial, paid

// Servicios adicionales
foreach ($reservation->reservationServices as $service) {
    echo $service->serviceable->name;
    echo $service->unit_price;
}
```

### 2. **Crear una reservación con múltiples servicios**

```php
$reservation = Reservation::create([
    'client_id' => 1,
    'date' => '2025-12-25 14:00:00',
    'category' => 'Boda',
    'total_amount' => 50000,
    'paid_amount' => 10000,
    'payment_method' => 'transferencia',
    'bank_code' => '0102',
]);

// Agregar servicios
ReservationService::create([
    'reservation_id' => $reservation->id,
    'service_id' => 1,
    'service_type' => 'package',
    'unit_price' => 30000,
]);

ReservationService::create([
    'reservation_id' => $reservation->id,
    'service_id' => 5,
    'service_type' => 'clothing',
    'unit_price' => 20000,
]);

// Calcular estado de pago automáticamente
$reservation->updatePaymentStatus(); // → 'partial'
```

### 3. **Buscar reservaciones por estado de pago**

```php
// Reservaciones pendientes
$pending = Reservation::where('payment_status', 'pending')->get();

// Reservaciones con pago parcial
$partial = Reservation::where('payment_status', 'partial')->get();

// Reservaciones pagadas completamente
$paid = Reservation::where('payment_status', 'paid')->get();
```

### 4. **Buscar por código de banco**

```php
$reservations = Reservation::where('bank_code', '0102')
    ->with(['client', 'reservationServices'])
    ->get();
```

---

## 🔄 Flujo de Estados de Pago

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT STATUS FLOW                      │
└─────────────────────────────────────────────────────────────┘

    PENDING                PARTIAL                  PAID
  (paid = 0)      (0 < paid < total)        (paid >= total)
      │                    │                        │
      │                    │                        │
      ▼                    ▼                        ▼
┌──────────┐         ┌──────────┐            ┌──────────┐
│  🔴 Sin  │         │  🟡 Pago │            │  🟢 Pago │
│   Pagar  │────────▶│ Parcial  │───────────▶│ Completo │
└──────────┘         └──────────┘            └──────────┘
      │                    │                        │
      │                    │                        │
      └────────────────────┴────────────────────────┘
                           │
                           ▼
              Calculado automáticamente por
              updatePaymentStatus()
```

---

## 📊 Estadísticas de la Base de Datos

### Tablas Relacionadas

- ✅ `reservations` (Principal)
- ✅ `reservation_services` (Servicios múltiples)
- ✅ `clients` (Clientes)
- ✅ `packages` (Paquetes de servicios)
- ✅ `clothes` (Vestimentas)
- ✅ `audit_logs` (Registro de auditoría)

### Total de Campos en `reservations`: **14 campos**

- 3 campos de identificación (id, client_id, serviceable_*)
- 2 campos de fecha (date, timestamps)
- 3 campos de montos (total_amount, paid_amount, payment_status)
- 3 campos de pago (payment_method, bank_code, transfer_screenshot)
- 1 campo de categoría
- 2 campos de auditoría (created_at, updated_at)

### Total de Campos en `reservation_services`: **7 campos**

---

## 🛠️ Migraciones Aplicadas

1. ✅ `2025_11_23_000004_create_reservations_table.php` - Tabla base
2. ✅ `2025_11_24_000001_add_fields_to_reservations_table.php` - Campos de categoría y pago
3. ✅ `2025_11_24_000002_create_reservation_services_table.php` - Servicios múltiples
4. ✅ `2025_11_24_000003_add_payment_fields_to_reservations_table.php` - Campos de método de pago

---

## 🔐 Integridad Referencial

### Cascadas Configuradas

```sql
-- Si se elimina un cliente, se eliminan sus reservaciones
client_id → ON DELETE CASCADE

-- Si se elimina una reservación, se eliminan sus servicios
reservation_id → ON DELETE CASCADE
```

### Validaciones a Nivel de Aplicación

- ✅ `payment_method` debe ser: 'efectivo', 'transferencia', 'tarjeta'
- ✅ `payment_status` debe ser: 'pending', 'partial', 'paid'
- ✅ `service_type` debe ser: 'clothing', 'package'
- ✅ `paid_amount` no puede ser negativo
- ✅ `transfer_screenshot` debe ser una imagen válida (max 10MB)

---

## 📝 Notas Importantes

1. **Polimorfismo**: La tabla `reservations` usa relaciones polimórficas para asociarse tanto con `packages` como con `clothes`.

2. **Múltiples Servicios**: Una reservación puede tener múltiples servicios a través de la tabla `reservation_services`.

3. **Cálculo Automático**: El campo `payment_status` se calcula automáticamente y no debe ser modificado manualmente.

4. **Audit Trail**: Todas las operaciones CRUD se registran en la tabla `audit_logs`.

5. **Almacenamiento de Imágenes**: Las capturas de transferencia se guardan en `storage/app/public/transfers/`.

---

## 🚀 Comandos Útiles

```bash
# Ver estructura de la tabla
php artisan db:show reservations

# Ejecutar migraciones
php artisan migrate

# Revertir última migración
php artisan migrate:rollback

# Refrescar base de datos con seeders
php artisan migrate:fresh --seed
```
