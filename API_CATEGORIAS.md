# 📂 API de Categorías - Referencia Rápida

## Endpoints Disponibles

**Requiere permiso:** `categories.manage`

### 1. Listar categorías principales (con subcategorías)

```http
GET /api/categories
Authorization: Bearer {token}
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Bodas",
    "parent_id": null,
    "created_at": "2025-11-23T...",
    "updated_at": "2025-11-23T...",
    "children": [
      {
        "id": 4,
        "name": "Boda Básica",
        "parent_id": 1,
        "created_at": "2025-11-23T...",
        "updated_at": "2025-11-23T..."
      },
      {
        "id": 5,
        "name": "Boda Premium",
        "parent_id": 1,
        "created_at": "2025-11-23T...",
        "updated_at": "2025-11-23T..."
      }
    ]
  }
]
```

---

### 2. Listar TODAS las categorías (lista plana)

```http
GET /api/categories/all
Authorization: Bearer {token}
```

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Bodas",
    "parent_id": null,
    "created_at": "2025-11-23T...",
    "updated_at": "2025-11-23T..."
  },
  {
    "id": 4,
    "name": "Boda Básica",
    "parent_id": 1,
    "created_at": "2025-11-23T...",
    "updated_at": "2025-11-23T..."
  }
]
```

**Uso:** Ideal para dropdowns/selects en formularios.

---

### 3. Crear una categoría

```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Eventos VIP",
  "parent_id": null
}
```

**Para crear una subcategoría:**

```json
{
  "name": "Boda Destino",
  "parent_id": 1
}
```

**Respuesta (201):**

```json
{
  "id": 25,
  "name": "Eventos VIP",
  "parent_id": null,
  "created_at": "2025-11-23T...",
  "updated_at": "2025-11-23T..."
}
```

---

### 4. Ver una categoría específica

```http
GET /api/categories/{id}
Authorization: Bearer {token}
```

**Respuesta:**

```json
{
  "id": 1,
  "name": "Bodas",
  "parent_id": null,
  "created_at": "2025-11-23T...",
  "updated_at": "2025-11-23T...",
  "children": [
    {
      "id": 4,
      "name": "Boda Básica",
      "parent_id": 1,
      "created_at": "2025-11-23T...",
      "updated_at": "2025-11-23T..."
    }
  ]
}
```

---

### 5. Obtener subcategorías de una categoría

```http
GET /api/categories/{id}/subcategories
Authorization: Bearer {token}
```

**Ejemplo:**

```http
GET /api/categories/1/subcategories
```

**Respuesta:**

```json
[
  {
    "id": 4,
    "name": "Boda Básica",
    "parent_id": 1,
    "created_at": "2025-11-23T...",
    "updated_at": "2025-11-23T..."
  },
  {
    "id": 5,
    "name": "Boda Premium",
    "parent_id": 1,
    "created_at": "2025-11-23T...",
    "updated_at": "2025-11-23T..."
  }
]
```

---

### 6. Actualizar una categoría

```http
PUT /api/categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Bodas Especiales"
}
```

**Respuesta:**

```json
{
  "id": 1,
  "name": "Bodas Especiales",
  "parent_id": null,
  "created_at": "2025-11-23T...",
  "updated_at": "2025-11-23T..."
}
```

---

### 7. Eliminar una categoría

```http
DELETE /api/categories/{id}
Authorization: Bearer {token}
```

**Respuesta:** `204 No Content`

**Nota:** Si la categoría tiene subcategorías, estas también se eliminarán (cascade).

---

## Ejemplos con cURL

### Listar todas las categorías (plano)

```bash
curl -X GET http://localhost:8000/api/categories/all \
  -H "Authorization: Bearer {token}"
```

### Crear una categoría principal

```bash
curl -X POST http://localhost:8000/api/categories \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Eventos Corporativos"}'
```

### Crear una subcategoría

```bash
curl -X POST http://localhost:8000/api/categories \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Conferencias","parent_id":1}'
```

### Obtener subcategorías

```bash
curl -X GET http://localhost:8000/api/categories/1/subcategories \
  -H "Authorization: Bearer {token}"
```

---

## Integración con Frontend

### Ejemplo: Cargar categorías en un select

```javascript
// Obtener todas las categorías (plano)
fetch('/api/categories/all', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => response.json())
.then(categories => {
  const select = document.getElementById('category-select');
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.name;
    if (cat.parent_id) {
      option.textContent = '  └─ ' + cat.name; // Indentar subcategorías
    }
    select.appendChild(option);
  });
});
```

### Ejemplo: Mostrar categorías jerárquicas

```javascript
// Obtener categorías con subcategorías
fetch('/api/categories', {
  headers: {
    'Authorization': 'Bearer ' + token
  }
})
.then(response => response.json())
.then(categories => {
  categories.forEach(category => {
    console.log(category.name);
    category.children.forEach(subcategory => {
      console.log('  └─ ' + subcategory.name);
    });
  });
});
```

---

## Categorías Iniciales (Seeder)

El sistema viene con **24 categorías** pre-cargadas:

### Categorías para Paquetes

- **Bodas**
  - Boda Básica
  - Boda Premium
  - Boda Destino
- **Quinceaños**
- **Eventos Corporativos**

### Categorías para Vestimentas

- **Vestidos de Novia**
  - Vestidos Clásicos
  - Vestidos Modernos
  - Vestidos Vintage
- **Trajes**
- **Accesorios**

---

## Permisos

El permiso `categories.manage` permite:

- ✅ Listar categorías
- ✅ Crear categorías
- ✅ Editar categorías
- ✅ Eliminar categorías
- ✅ Ver subcategorías

**Roles con este permiso:**

- SuperAdmin (todos los permisos)

---

## Notas Importantes

1. **Eliminación en cascada:** Al eliminar una categoría padre, todas sus subcategorías se eliminan automáticamente.

2. **Validación de parent_id:** El `parent_id` debe existir en la tabla `categories` o ser `null`.

3. **Uso en paquetes y vestimentas:**
   - Los paquetes y vestimentas usan `category_id` (obligatorio)
   - Pueden tener `subcategory_id` (opcional)
   - Ambos deben apuntar a registros válidos en la tabla `categories`

4. **Endpoint `/all` vs `/index`:**
   - `/categories` → Devuelve solo categorías principales con sus hijos anidados
   - `/categories/all` → Devuelve todas las categorías en lista plana (mejor para dropdowns)

---

**Última actualización:** 2025-11-23
