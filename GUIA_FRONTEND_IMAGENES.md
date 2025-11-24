# Guía de Integración Frontend: Módulo de Vestimentas (Clothes)

Esta guía detalla cómo consumir el endpoint de creación de vestimentas, asegurando que la subida de imágenes funcione correctamente.

## 📍 Endpoint

- **URL:** `/api/clothes`
- **Método:** `POST`
- **Autenticación:** Requerida (`Bearer Token`)

## 📋 Requisitos Clave

Para subir imágenes, es **obligatorio** enviar la petición como `multipart/form-data`. No se puede enviar como JSON (`application/json`).

### Headers

| Header | Valor |
|--------|-------|
| `Authorization` | `Bearer {tu_token_de_acceso}` |
| `Accept` | `application/json` |
| `Content-Type` | `multipart/form-data` (El navegador suele asignarlo automáticamente al usar `FormData`) |

### Parámetros del Body (FormData)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | Texto | ✅ Sí | Nombre de la vestimenta. |
| `category_id` | Número | ✅ Sí | ID de la categoría. |
| `branch_id` | Número | ✅ Sí | ID de la sucursal. |
| `status` | Texto | ✅ Sí | Valores: `available`, `reserved`, `laundry`, `broken`, `in_session`. |
| `image` | Archivo | ⚠️ Opcional | El archivo de imagen (JPG, PNG). Máx 10MB. |
| `price` | Número | ❌ No | Precio de alquiler/venta. |
| `subcategory_id`| Número | ❌ No | ID de la subcategoría. |

---

## 💻 Ejemplo de Implementación (JavaScript / React / Vue)

La clave es usar el objeto `FormData` para construir el cuerpo de la petición.

```javascript
/**
 * Función para crear una vestimenta con imagen
 * @param {Object} data - Datos del formulario
 * @param {File} imageFile - Archivo de imagen seleccionado por el usuario
 * @param {string} token - Token de autenticación
 */
async function createCloth(data, imageFile, token) {
    // 1. Crear instancia de FormData
    const formData = new FormData();

    // 2. Adjuntar campos de texto
    formData.append('name', data.name);
    formData.append('category_id', data.categoryId);
    formData.append('branch_id', data.branchId);
    formData.append('status', data.status); // ej: 'available'
    
    if (data.price) formData.append('price', data.price);
    if (data.subcategoryId) formData.append('subcategory_id', data.subcategoryId);

    // 3. Adjuntar la imagen (CRÍTICO)
    // Solo adjuntar si el usuario seleccionó un archivo
    if (imageFile) {
        formData.append('image', imageFile); 
    }

    try {
        // 4. Enviar petición
        const response = await fetch('http://localhost:8000/api/clothes', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // NO establecer 'Content-Type' manualmente aquí si usas fetch + FormData,
                // el navegador lo hará automáticamente con el boundary correcto.
            },
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de validación:', errorData);
            throw new Error('Falló la creación de la vestimenta');
        }

        const result = await response.json();
        console.log('¡Éxito! Vestimenta creada:', result);
        return result;

    } catch (error) {
        console.error('Error en la petición:', error);
    }
}

// --- Ejemplo de Uso ---

// Suponiendo que tienes un input file en tu HTML: <input type="file" id="clothImage">
const fileInput = document.querySelector('#clothImage');
const file = fileInput.files[0]; // Obtener el archivo real

const clothData = {
    name: "Vestido de Gala Rojo",
    categoryId: 5,
    branchId: 1,
    status: "available",
    price: 1500.00
};

// Llamar a la función
createCloth(clothData, file, 'tu_token_aqui');
```

## 🐞 Solución de Problemas Comunes

1. **La imagen llega como `null`:**
    - Verifica que estés enviando el objeto `File` real (`input.files[0]`), no el value del input (que es solo un string con el nombre).
    - Asegúrate de usar `FormData`.

2. **Error 422 (Unprocessable Entity):**
    - Revisa la consola. El backend te dirá qué campo falla.
    - Si dice "The image field must be an image", es que enviaste texto en lugar de un archivo binario.

3. **Error 413 (Payload Too Large):**
    - La imagen supera el límite del servidor (40MB) o de la aplicación (10MB).

---
**Nota para el Backend:**
El backend ya está configurado para recibir la imagen, generar un nombre único y guardarla en `storage/app/public/clothes`.
