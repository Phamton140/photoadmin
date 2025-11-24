# 🚀 API Endpoints - Módulo de Reservaciones

## 📋 Índice de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/reservations` | Listar todas las reservaciones (con filtros) |
| GET | `/api/reservations/calendar` | Obtener reservaciones en formato FullCalendar |
| GET | `/api/reservations/search/bank-code/{code}` | Buscar por código de banco |
| GET | `/api/reservations/{id}` | Obtener detalle de una reservación |
| GET | `/api/clients/{id}/reservations` | Historial de reservaciones de un cliente |
| POST | `/api/reservations` | Crear nueva reservación |
| PUT | `/api/reservations/{id}` | Actualizar reservación |
| POST | `/api/reservations/{id}/transfer-screenshot` | Subir captura de transferencia |
| DELETE | `/api/reservations/{id}` | Eliminar reservación |

---

## 🔐 Autenticación

Todos los endpoints requieren:

- **Header**: `Authorization: Bearer {token}`
- **Permiso**: `reservations.manage`

---

## 📖 Documentación Detallada

### 1. **Listar Reservaciones**

**GET** `/api/reservations`

Lista todas las reservaciones con filtros opcionales.

#### Query Parameters (Opcionales)

| Parámetro | Tipo | Descripción | Ejemplo |
|-----------|------|-------------|---------|
| `client_id` | integer | Filtrar por cliente | `?client_id=5` |
| `date_from` | date | Fecha desde | `?date_from=2025-01-01` |
| `date_to` | date | Fecha hasta | `?date_to=2025-12-31` |
| `serviceable_type` | string | Tipo de servicio | `?serviceable_type=package` o `cloth` |

#### Ejemplo de Request

```javascript
const response = await fetch('http://localhost:8000/api/reservations?client_id=5&date_from=2025-01-01', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});

const reservations = await response.json();
```

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "client_id": 5,
    "serviceable_id": 2,
    "serviceable_type": "App\\Models\\Package",
    "date": "2025-12-25T14:00:00.000000Z",
    "total_amount": "50000.00",
    "category": "Boda",
    "paid_amount": "10000.00",
    "payment_status": "partial",
    "payment_method": "transferencia",
    "bank_code": "0102",
    "transfer_screenshot": "transfers/abc123.jpg",
    "transfer_screenshot_url": "http://localhost:8000/storage/transfers/abc123.jpg",
    "created_at": "2025-11-24T12:00:00.000000Z",
    "updated_at": "2025-11-24T12:30:00.000000Z",
    "client": {
      "id": 5,
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "809-555-1234"
    },
    "serviceable": {
      "id": 2,
      "name": "Paquete Boda Premium Gold",
      "price": "45000.00"
    }
  }
]
```

---

### 2. **Calendario de Reservaciones**

**GET** `/api/reservations/calendar`

Retorna reservaciones en formato compatible con FullCalendar.

#### Query Parameters (Opcionales)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `start` | date | Fecha inicio del calendario |
| `end` | date | Fecha fin del calendario |

#### Ejemplo de Request

```javascript
const response = await fetch('http://localhost:8000/api/reservations/calendar?start=2025-12-01&end=2025-12-31', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});

const events = await response.json();
```

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "title": "Juan Pérez - Paquete Boda Premium Gold",
    "start": "2025-12-25T14:00:00.000000Z",
    "end": "2025-12-25T14:00:00.000000Z",
    "extendedProps": {
      "client_id": 5,
      "client_name": "Juan Pérez",
      "service_type": "Package",
      "service_name": "Paquete Boda Premium Gold",
      "total_amount": "50000.00"
    }
  }
]
```

#### Integración con FullCalendar

```javascript
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

function Calendar() {
  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={async (info, successCallback) => {
        const response = await fetch(
          `http://localhost:8000/api/reservations/calendar?start=${info.startStr}&end=${info.endStr}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            }
          }
        );
        const events = await response.json();
        successCallback(events);
      }}
    />
  );
}
```

---

### 3. **Buscar por Código de Banco**

**GET** `/api/reservations/search/bank-code/{code}`

Busca todas las reservaciones que tengan un código de banco específico.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `code` | string | Código del banco |

#### Ejemplo de Request

```javascript
const bankCode = '0102';
const response = await fetch(`http://localhost:8000/api/reservations/search/bank-code/${bankCode}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});

const reservations = await response.json();
```

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "bank_code": "0102",
    "payment_method": "transferencia",
    "payment_status": "partial",
    "client": { ... },
    "serviceable": { ... },
    "reservationServices": [ ... ]
  }
]
```

---

### 4. **Obtener Detalle de Reservación**

**GET** `/api/reservations/{id}`

Obtiene los detalles completos de una reservación específica.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID de la reservación |

#### Ejemplo de Request

```javascript
const reservationId = 1;
const response = await fetch(`http://localhost:8000/api/reservations/${reservationId}`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});

const reservation = await response.json();
```

#### Response (200 OK)

```json
{
  "id": 1,
  "client_id": 5,
  "date": "2025-12-25T14:00:00.000000Z",
  "category": "Boda",
  "total_amount": "50000.00",
  "paid_amount": "10000.00",
  "payment_status": "partial",
  "payment_method": "transferencia",
  "bank_code": "0102",
  "transfer_screenshot": "transfers/abc123.jpg",
  "transfer_screenshot_url": "http://localhost:8000/storage/transfers/abc123.jpg",
  "client": {
    "id": 5,
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "phone": "809-555-1234"
  },
  "serviceable": {
    "id": 2,
    "name": "Paquete Boda Premium Gold",
    "price": "45000.00"
  },
  "reservationServices": [
    {
      "id": 1,
      "reservation_id": 1,
      "service_id": 2,
      "service_type": "package",
      "unit_price": "30000.00",
      "serviceable": {
        "id": 2,
        "name": "Paquete Boda Premium Gold"
      }
    },
    {
      "id": 2,
      "reservation_id": 1,
      "service_id": 5,
      "service_type": "clothing",
      "unit_price": "20000.00",
      "serviceable": {
        "id": 5,
        "name": "Vestido de Novia Clásico"
      }
    }
  ]
}
```

---

### 5. **Historial de Reservaciones de un Cliente**

**GET** `/api/clients/{id}/reservations`

Obtiene todas las reservaciones de un cliente específico.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID del cliente |

#### Ejemplo de Request

```javascript
const clientId = 5;
const response = await fetch(`http://localhost:8000/api/clients/${clientId}/reservations`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  }
});

const reservations = await response.json();
```

#### Response (200 OK)

```json
[
  {
    "id": 1,
    "date": "2025-12-25T14:00:00.000000Z",
    "category": "Boda",
    "total_amount": "50000.00",
    "payment_status": "partial",
    "serviceable": { ... },
    "reservationServices": [ ... ]
  },
  {
    "id": 2,
    "date": "2025-11-15T10:00:00.000000Z",
    "category": "Quinceaños",
    "total_amount": "22000.00",
    "payment_status": "paid",
    "serviceable": { ... },
    "reservationServices": [ ... ]
  }
]
```

---

### 6. **Crear Nueva Reservación**

**POST** `/api/reservations`

Crea una nueva reservación con múltiples servicios.

#### Request Body

```json
{
  "client_id": 5,
  "date": "2025-12-25T14:00:00",
  "category": "Boda",
  "total_amount": 50000.00,
  "paid_amount": 10000.00,
  "payment_method": "transferencia",
  "bank_code": "0102",
  "services": [
    {
      "service_id": 2,
      "service_type": "package",
      "unit_price": 30000.00
    },
    {
      "service_id": 5,
      "service_type": "clothing",
      "unit_price": 20000.00
    }
  ]
}
```

#### Validaciones

| Campo | Reglas |
|-------|--------|
| `client_id` | Requerido, debe existir en tabla `clients` |
| `date` | Requerido, formato fecha válido |
| `category` | Requerido, string |
| `total_amount` | Requerido, numérico |
| `paid_amount` | Opcional, numérico |
| `payment_method` | Opcional, valores: 'efectivo', 'transferencia', 'tarjeta' |
| `bank_code` | Opcional, string |
| `services` | Requerido, array con mínimo 1 servicio |
| `services.*.service_id` | Requerido, entero |
| `services.*.service_type` | Requerido, valores: 'clothing', 'package' |
| `services.*.unit_price` | Requerido, numérico |

#### Ejemplo de Request

```javascript
async function createReservation(data, token) {
  const response = await fetch('http://localhost:8000/api/reservations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: data.clientId,
      date: data.date,
      category: data.category,
      total_amount: data.totalAmount,
      paid_amount: data.paidAmount || 0,
      payment_method: data.paymentMethod,
      bank_code: data.bankCode,
      services: data.services
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
```

#### Response (201 Created)

```json
{
  "id": 15,
  "client_id": 5,
  "date": "2025-12-25T14:00:00.000000Z",
  "category": "Boda",
  "total_amount": "50000.00",
  "paid_amount": "10000.00",
  "payment_status": "partial",
  "payment_method": "transferencia",
  "bank_code": "0102",
  "transfer_screenshot": null,
  "transfer_screenshot_url": null,
  "created_at": "2025-11-24T12:00:00.000000Z",
  "updated_at": "2025-11-24T12:00:00.000000Z"
}
```

**Nota**: El `payment_status` se calcula automáticamente. No es necesario enviarlo.

---

### 7. **Actualizar Reservación**

**PUT** `/api/reservations/{id}`

Actualiza los datos de una reservación existente.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID de la reservación |

#### Request Body (todos los campos son opcionales)

```json
{
  "date": "2025-12-26T15:00:00",
  "category": "Boda Premium",
  "paid_amount": 25000.00,
  "total_amount": 55000.00,
  "payment_method": "tarjeta",
  "bank_code": null
}
```

#### Ejemplo de Request

```javascript
async function updateReservation(id, data, token) {
  const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}
```

#### Response (200 OK)

```json
{
  "id": 15,
  "client_id": 5,
  "date": "2025-12-26T15:00:00.000000Z",
  "category": "Boda Premium",
  "total_amount": "55000.00",
  "paid_amount": "25000.00",
  "payment_status": "partial",
  "payment_method": "tarjeta",
  "bank_code": null,
  "updated_at": "2025-11-24T13:00:00.000000Z"
}
```

**Nota**: Si actualizas `paid_amount` o `total_amount`, el `payment_status` se recalcula automáticamente.

---

### 8. **Subir Captura de Transferencia**

**POST** `/api/reservations/{id}/transfer-screenshot`

Sube una imagen de captura de transferencia bancaria.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID de la reservación |

#### Request Body (FormData)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `transfer_screenshot` | File | Archivo de imagen (jpg, png, gif, webp) |

#### Validaciones

- ✅ Archivo requerido
- ✅ Debe ser una imagen
- ✅ Tamaño máximo: 10MB

#### Ejemplo de Request

```javascript
async function uploadTransferScreenshot(reservationId, imageFile, token) {
  const formData = new FormData();
  formData.append('transfer_screenshot', imageFile);

  const response = await fetch(
    `http://localhost:8000/api/reservations/${reservationId}/transfer-screenshot`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // NO incluir 'Content-Type' cuando usas FormData
      },
      body: formData
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return await response.json();
}

// Uso en un formulario
function handleFileUpload(e) {
  const file = e.target.files[0];
  const reservationId = 15;
  const token = localStorage.getItem('token');
  
  uploadTransferScreenshot(reservationId, file, token)
    .then(result => {
      console.log('Captura subida:', result.reservation.transfer_screenshot_url);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
```

#### Response (200 OK)

```json
{
  "message": "Captura de transferencia subida exitosamente",
  "reservation": {
    "id": 15,
    "transfer_screenshot": "transfers/abc123def456.jpg",
    "transfer_screenshot_url": "http://localhost:8000/storage/transfers/abc123def456.jpg",
    "payment_method": "transferencia",
    "bank_code": "0102",
    "updated_at": "2025-11-24T13:30:00.000000Z"
  }
}
```

---

### 9. **Eliminar Reservación**

**DELETE** `/api/reservations/{id}`

Elimina una reservación y todos sus servicios asociados.

#### Path Parameters

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | integer | ID de la reservación |

#### Ejemplo de Request

```javascript
async function deleteReservation(id, token) {
  const response = await fetch(`http://localhost:8000/api/reservations/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return true; // No content
}
```

#### Response (204 No Content)

Sin contenido en el body.

---

## 🎨 Componentes de Ejemplo

### Formulario de Creación de Reservación (React)

```jsx
import React, { useState } from 'react';

function CreateReservationForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    client_id: '',
    date: '',
    category: '',
    total_amount: 0,
    paid_amount: 0,
    payment_method: 'efectivo',
    bank_code: '',
    services: [{ service_id: '', service_type: 'package', unit_price: 0 }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/api/reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const reservation = await response.json();
      onSuccess(reservation);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const addService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { service_id: '', service_type: 'package', unit_price: 0 }]
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nueva Reservación</h2>
      
      <div>
        <label>Cliente ID:</label>
        <input
          type="number"
          value={formData.client_id}
          onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Fecha:</label>
        <input
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Categoría:</label>
        <input
          type="text"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Monto Total:</label>
        <input
          type="number"
          step="0.01"
          value={formData.total_amount}
          onChange={(e) => setFormData({ ...formData, total_amount: parseFloat(e.target.value) })}
          required
        />
      </div>

      <div>
        <label>Monto Pagado:</label>
        <input
          type="number"
          step="0.01"
          value={formData.paid_amount}
          onChange={(e) => setFormData({ ...formData, paid_amount: parseFloat(e.target.value) })}
        />
      </div>

      <div>
        <label>Método de Pago:</label>
        <select
          value={formData.payment_method}
          onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
        >
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>

      {formData.payment_method === 'transferencia' && (
        <div>
          <label>Código de Banco:</label>
          <input
            type="text"
            value={formData.bank_code}
            onChange={(e) => setFormData({ ...formData, bank_code: e.target.value })}
          />
        </div>
      )}

      <h3>Servicios</h3>
      {formData.services.map((service, index) => (
        <div key={index}>
          <input
            type="number"
            placeholder="Service ID"
            value={service.service_id}
            onChange={(e) => {
              const newServices = [...formData.services];
              newServices[index].service_id = e.target.value;
              setFormData({ ...formData, services: newServices });
            }}
            required
          />
          <select
            value={service.service_type}
            onChange={(e) => {
              const newServices = [...formData.services];
              newServices[index].service_type = e.target.value;
              setFormData({ ...formData, services: newServices });
            }}
          >
            <option value="package">Paquete</option>
            <option value="clothing">Vestimenta</option>
          </select>
          <input
            type="number"
            step="0.01"
            placeholder="Precio"
            value={service.unit_price}
            onChange={(e) => {
              const newServices = [...formData.services];
              newServices[index].unit_price = parseFloat(e.target.value);
              setFormData({ ...formData, services: newServices });
            }}
            required
          />
        </div>
      ))}
      
      <button type="button" onClick={addService}>+ Agregar Servicio</button>
      <button type="submit">Crear Reservación</button>
    </form>
  );
}

export default CreateReservationForm;
```

---

## 📊 Códigos de Respuesta HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado exitosamente |
| 204 | No Content - Eliminación exitosa |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - Token inválido o faltante |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 422 | Unprocessable Entity - Errores de validación |
| 500 | Internal Server Error - Error del servidor |

---

## 🔍 Errores Comunes

### Error 422 - Validación

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "client_id": ["The client id field is required."],
    "services": ["The services must have at least 1 items."]
  }
}
```

### Error 404 - No Encontrado

```json
{
  "message": "No query results for model [App\\Models\\Reservation] 999"
}
```

### Error 401 - No Autenticado

```json
{
  "message": "Unauthenticated."
}
```

---

## ✅ Checklist de Integración Frontend

- [ ] Implementar autenticación con Bearer token
- [ ] Crear formulario de nueva reservación
- [ ] Implementar listado con filtros
- [ ] Integrar calendario (FullCalendar)
- [ ] Agregar subida de capturas de transferencia
- [ ] Mostrar estado de pago con colores
- [ ] Implementar búsqueda por código de banco
- [ ] Agregar vista de detalle de reservación
- [ ] Mostrar historial por cliente
- [ ] Implementar confirmación de eliminación
- [ ] Manejar errores de validación
- [ ] Mostrar mensajes de éxito/error

---

## 🚀 URL Base

**Desarrollo**: `http://localhost:8000/api`  
**Producción**: `https://tudominio.com/api`

---

## 📞 Soporte

Para más detalles, consulta:

- `GUIA_PAGOS_RESERVACIONES.md` - Guía de pagos
- `ESTRUCTURA_BD_RESERVACIONES.md` - Estructura de base de datos
