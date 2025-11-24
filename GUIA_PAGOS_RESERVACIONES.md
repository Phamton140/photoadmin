# Guía de Integración - Sistema de Pagos para Reservaciones

## 📋 Resumen de Cambios

Se han agregado nuevas funcionalidades para el manejo de pagos en las reservaciones, incluyendo métodos de pago, códigos bancarios y capturas de transferencias.

---

## 🗄️ Nuevos Campos en la Tabla `reservations`

| Campo | Tipo | Descripción | Valores Permitidos |
|-------|------|-------------|-------------------|
| `payment_method` | string (nullable) | Método de pago utilizado | `'efectivo'`, `'transferencia'`, `'tarjeta'` |
| `bank_code` | string (nullable) | Código del banco para transferencias | Cualquier string |
| `transfer_screenshot` | string (nullable) | Ruta de la captura de transferencia | Ruta del archivo |
| `payment_status` | enum | Estado del pago (calculado automáticamente) | `'pending'`, `'partial'`, `'paid'` |

### ⚙️ Cálculo Automático de `payment_status`

El campo `payment_status` se calcula automáticamente basándose en:

- **`pending`**: `paid_amount` = 0
- **`partial`**: `paid_amount` > 0 y < `total_amount`
- **`paid`**: `paid_amount` >= `total_amount`

---

## 🔌 Endpoints Actualizados

### 1. **Crear Reservación**

**POST** `/api/reservations`

#### Request Body (JSON)

```json
{
  "client_id": 1,
  "date": "2025-12-25",
  "category": "Boda",
  "total_amount": 50000.00,
  "paid_amount": 10000.00,
  "payment_method": "transferencia",
  "bank_code": "0102",
  "services": [
    {
      "service_id": 1,
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

#### Response (201)

```json
{
  "id": 15,
  "client_id": 1,
  "date": "2025-12-25",
  "category": "Boda",
  "total_amount": 50000.00,
  "paid_amount": 10000.00,
  "payment_status": "partial",
  "payment_method": "transferencia",
  "bank_code": "0102",
  "transfer_screenshot": null,
  "transfer_screenshot_url": null,
  "created_at": "2025-11-24T12:00:00.000000Z",
  "updated_at": "2025-11-24T12:00:00.000000Z"
}
```

---

### 2. **Actualizar Reservación**

**PUT** `/api/reservations/{id}`

#### Request Body (JSON)

```json
{
  "paid_amount": 25000.00,
  "payment_method": "tarjeta",
  "bank_code": null
}
```

**Nota:** El `payment_status` se recalcula automáticamente al actualizar `paid_amount` o `total_amount`.

---

### 3. **Subir Captura de Transferencia**

**POST** `/api/reservations/{id}/transfer-screenshot`

#### Request (FormData)

```javascript
const formData = new FormData();
formData.append('transfer_screenshot', imageFile); // Archivo de imagen

const response = await fetch(`http://localhost:8000/api/reservations/15/transfer-screenshot`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  },
  body: formData
});
```

#### Response (200)

```json
{
  "message": "Captura de transferencia subida exitosamente",
  "reservation": {
    "id": 15,
    "transfer_screenshot": "transfers/abc123def456.jpg",
    "transfer_screenshot_url": "http://localhost:8000/storage/transfers/abc123def456.jpg",
    ...
  }
}
```

**Validaciones:**

- ✅ Archivo requerido
- ✅ Debe ser una imagen (jpg, jpeg, png, gif, webp)
- ✅ Tamaño máximo: 10MB

---

### 4. **Buscar Reservaciones por Código de Banco**

**GET** `/api/reservations/search/bank-code/{code}`

#### Ejemplo

```
GET /api/reservations/search/bank-code/0102
```

#### Response (200)

```json
[
  {
    "id": 15,
    "client_id": 1,
    "bank_code": "0102",
    "payment_method": "transferencia",
    "payment_status": "partial",
    "client": {
      "id": 1,
      "name": "Juan Pérez",
      "email": "juan@example.com"
    },
    "reservationServices": [
      {
        "id": 1,
        "service_id": 1,
        "service_type": "package",
        "unit_price": 30000.00
      }
    ],
    ...
  }
]
```

---

## 💻 Ejemplos de Código Frontend

### Crear Reservación con Pago

```javascript
async function createReservationWithPayment(data, token) {
  try {
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
        paid_amount: data.paidAmount,
        payment_method: data.paymentMethod, // 'efectivo', 'transferencia', 'tarjeta'
        bank_code: data.bankCode, // Solo si es transferencia
        services: data.services
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear reservación');
    }

    const reservation = await response.json();
    console.log('Reservación creada:', reservation);
    console.log('Estado de pago:', reservation.payment_status);
    
    return reservation;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Subir Captura de Transferencia

```javascript
async function uploadTransferScreenshot(reservationId, imageFile, token) {
  const formData = new FormData();
  formData.append('transfer_screenshot', imageFile);

  try {
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
      throw new Error(error.message || 'Error al subir captura');
    }

    const result = await response.json();
    console.log('Captura subida:', result.reservation.transfer_screenshot_url);
    
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Buscar por Código de Banco

```javascript
async function searchByBankCode(bankCode, token) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/reservations/search/bank-code/${bankCode}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      }
    );

    if (!response.ok) {
      throw new Error('Error al buscar reservaciones');
    }

    const reservations = await response.json();
    console.log(`Encontradas ${reservations.length} reservaciones con código ${bankCode}`);
    
    return reservations;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

### Actualizar Monto Pagado

```javascript
async function updatePayment(reservationId, paidAmount, token) {
  try {
    const response = await fetch(
      `http://localhost:8000/api/reservations/${reservationId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          paid_amount: paidAmount
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar pago');
    }

    const reservation = await response.json();
    console.log('Nuevo estado de pago:', reservation.payment_status);
    
    return reservation;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
```

---

## 🎨 Componente de Ejemplo (React)

```jsx
import React, { useState } from 'react';

function PaymentForm({ reservationId, totalAmount, onSuccess }) {
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [bankCode, setBankCode] = useState('');
  const [screenshot, setScreenshot] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    
    // 1. Actualizar monto pagado
    const response = await fetch(`/api/reservations/${reservationId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paid_amount: paidAmount,
        payment_method: paymentMethod,
        bank_code: paymentMethod === 'transferencia' ? bankCode : null
      })
    });
    
    const reservation = await response.json();
    
    // 2. Si hay captura, subirla
    if (screenshot && paymentMethod === 'transferencia') {
      const formData = new FormData();
      formData.append('transfer_screenshot', screenshot);
      
      await fetch(`/api/reservations/${reservationId}/transfer-screenshot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
    }
    
    onSuccess(reservation);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Monto Total: ${totalAmount}</label>
      </div>
      
      <div>
        <label>Monto Pagado:</label>
        <input
          type="number"
          value={paidAmount}
          onChange={(e) => setPaidAmount(parseFloat(e.target.value))}
          min="0"
          max={totalAmount}
          step="0.01"
        />
      </div>
      
      <div>
        <label>Método de Pago:</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="efectivo">Efectivo</option>
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
        </select>
      </div>
      
      {paymentMethod === 'transferencia' && (
        <>
          <div>
            <label>Código de Banco:</label>
            <input
              type="text"
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              placeholder="Ej: 0102"
            />
          </div>
          
          <div>
            <label>Captura de Transferencia:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setScreenshot(e.target.files[0])}
            />
          </div>
        </>
      )}
      
      <button type="submit">Registrar Pago</button>
    </form>
  );
}

export default PaymentForm;
```

---

## ✅ Checklist de Implementación

- [ ] Ejecutar migraciones: `php artisan migrate`
- [ ] Actualizar formularios de creación de reservaciones
- [ ] Agregar campo de método de pago
- [ ] Agregar campo de código de banco (condicional)
- [ ] Implementar subida de captura de transferencia
- [ ] Mostrar estado de pago (`payment_status`) en listados
- [ ] Implementar búsqueda por código de banco
- [ ] Mostrar imagen de captura cuando exista
- [ ] Validar que el monto pagado no exceda el total

---

## 🚨 Notas Importantes

1. **Payment Status Automático**: No envíes `payment_status` en las peticiones POST/PUT, se calcula automáticamente.

2. **Imágenes**: Las capturas se guardan en `storage/app/public/transfers/` y son accesibles vía `transfer_screenshot_url`.

3. **Validación de Archivos**:
   - Solo imágenes
   - Máximo 10MB
   - Formatos: jpg, jpeg, png, gif, webp

4. **Audit Log**: Todas las acciones (crear, actualizar, subir captura) se registran automáticamente en `audit_logs`.

5. **Permisos**: Todos los endpoints requieren el permiso `reservations.manage`.

---

## 📞 Soporte

Si tienes dudas sobre la integración, consulta los ejemplos de código o revisa el controlador `ReservationController.php`.
