# 🔧 CORRECCIONES RÁPIDAS - Frontend PhotoAdmin

Este documento contiene las correcciones exactas que debes aplicar para que tu frontend funcione con el backend.

---

## 📋 ORDEN DE APLICACIÓN

1. ✅ App.jsx - Comentar módulos no existentes
2. ✅ ClientsList.jsx - Corregir campos
3. ✅ ProjectsList.jsx - Corregir campos  
4. ✅ api.js - Agregar fileService
5. ✅ Dashboard.jsx - Implementar KPIs
6. ✅ ClientForm.jsx - Implementar formulario

---

## 1️⃣ CORRECCIÓN: App.jsx

**Archivo:** `frontend-extracted/src/App.jsx`

### Cambios a realizar

**COMENTAR las líneas 29-30:**

```javascript
// import ReservationsList from "@/pages/reservations/ReservationsList";
// import ReservationForm from "@/pages/reservations/ReservationForm";
```

**COMENTAR las líneas 37-38:**

```javascript
// import ServicesList from "@/pages/services/ServicesList";
// import ServiceForm from "@/pages/services/ServiceForm";
```

**COMENTAR las líneas 94-96:**

```javascript
// {/* Reservations */}
// <Route path="reservations" element={<ReservationsList />} />
// <Route path="reservations/create" element={<ReservationForm />} />
// <Route path="reservations/:id/edit" element={<ReservationForm />} />
```

**COMENTAR las líneas 104-106:**

```javascript
// {/* Services */}
// <Route path="services" element={<ServicesList />} />
// <Route path="services/create" element={<ServiceForm />} />
// <Route path="services/:id/edit" element={<ServiceForm />} />
```

---

## 2️⃣ CORRECCIÓN: ClientsList.jsx

**Archivo:** `frontend-extracted/src/pages/clients/ClientsList.jsx`

### Cambio en línea 81

**ANTES:**

```javascript
<TableCell className="font-medium flex items-center gap-2">
  <User className="h-4 w-4 text-muted-foreground" /> 
  {client.first_name} {client.last_name}
</TableCell>
```

**DESPUÉS:**

```javascript
<TableCell className="font-medium flex items-center gap-2">
  <User className="h-4 w-4 text-muted-foreground" /> 
  {client.name}
</TableCell>
```

---

## 3️⃣ CORRECCIÓN: ProjectsList.jsx

**Archivo:** `frontend-extracted/src/pages/projects/ProjectsList.jsx`

### Cambio 1 - Línea 66 (Header)

**AGREGAR después de "Name":**

```javascript
<TableHead>Name</TableHead>
<TableHead>Client</TableHead>  {/* ← AGREGAR */}
<TableHead>Status</TableHead>
```

### Cambio 2 - Línea 81

**ANTES:**

```javascript
<TableCell className="font-medium flex items-center gap-2">
  <Briefcase className="h-4 w-4 text-muted-foreground" /> 
  {project.name}
</TableCell>
```

**DESPUÉS:**

```javascript
<TableCell className="font-medium flex items-center gap-2">
  <Briefcase className="h-4 w-4 text-muted-foreground" /> 
  {project.title}
</TableCell>
<TableCell>{project.client?.name || '-'}</TableCell>  {/* ← AGREGAR */}
```

### Cambio 3 - Línea 84

**ANTES:**

```javascript
<TableCell>{project.due_date || '-'}</TableCell>
```

**DESPUÉS:**

```javascript
<TableCell>
  {project.estimated_delivery_date 
    ? new Date(project.estimated_delivery_date).toLocaleDateString() 
    : '-'}
</TableCell>
```

### Cambio 4 - Línea 69 (Header)

**ANTES:**

```javascript
<TableHead>Due Date</TableHead>
```

**DESPUÉS:**

```javascript
<TableHead>Delivery Date</TableHead>
```

---

## 4️⃣ CORRECCIÓN: services/api.js

**Archivo:** `frontend-extracted/src/services/api.js`

### Agregar al final del archivo (antes de la línea 86)

```javascript
export const fileService = {
  upload: async (projectId, file, type = 'other') => {
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('file', file);
    formData.append('type', type);
    
    const token = localStorage.getItem('authToken');
    const API_BASE_URL = "https://darksalmon-chamois-397403.hostingersite.com/api";
    
    const response = await fetch(`${API_BASE_URL}/project-files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        // NO incluir Content-Type para FormData
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }
    
    return response.json();
  },
  
  download: async (fileId) => {
    const token = localStorage.getItem('authToken');
    const API_BASE_URL = "https://darksalmon-chamois-397403.hostingersite.com/api";
    
    const response = await fetch(`${API_BASE_URL}/project-files/${fileId}/download`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      throw new Error('Download failed');
    }
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file';
    a.click();
  },
  
  delete: (fileId) => apiRequest(`/project-files/${fileId}`, 'DELETE'),
};
```

### Modificar projectService (líneas 56-64)

**ELIMINAR estas líneas:**

```javascript
getFiles: (id) => apiRequest(`/projects/${id}/files`),
uploadFile: (id, formData) => apiRequest(`/projects/${id}/files`, 'POST', formData),
```

**El projectService debe quedar así:**

```javascript
export const projectService = {
  getAll: () => apiRequest('/projects'),
  getById: (id) => apiRequest(`/projects/${id}`),
  create: (data) => apiRequest('/projects', 'POST', data),
  update: (id, data) => apiRequest(`/projects/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/projects/${id}`, 'DELETE'),
};
```

---

## 5️⃣ IMPLEMENTACIÓN: Dashboard.jsx

**Archivo:** `frontend-extracted/src/pages/Dashboard.jsx`

**REEMPLAZAR TODO EL CONTENIDO con:**

```javascript
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { reportService } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Briefcase, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await reportService.getSummary();
        setKpis(data);
      } catch (error) {
        console.error('Error loading KPIs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchKPIs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Photoadmin Panel</title>
      </Helmet>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your photography business
          </p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.total_users || 0}</div>
              <p className="text-xs text-muted-foreground">
                Active system users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.total_clients || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered clients
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.projects_active || 0}</div>
              <p className="text-xs text-muted-foreground">
                Currently in progress
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpis?.projects_month || 0}</div>
              <p className="text-xs text-muted-foreground">
                New projects
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
```

---

## ✅ VERIFICACIÓN

Después de aplicar todas las correcciones:

### 1. Verificar que no hay errores de compilación

```bash
cd frontend-extracted
npm run dev
```

### 2. Probar en el navegador

- [ ] Login funciona
- [ ] Dashboard muestra KPIs
- [ ] Clients lista muestra nombres correctamente
- [ ] Projects lista muestra títulos y fechas correctamente
- [ ] No hay errores en consola

### 3. Probar flujos básicos

- [ ] Login → Dashboard
- [ ] Ver lista de clientes
- [ ] Ver lista de proyectos
- [ ] Logout

---

## 🚀 SIGUIENTE PASO

Una vez aplicadas estas correcciones, el siguiente paso es implementar los formularios.

Ver archivo: `FORMULARIOS_IMPLEMENTACION.md` (próximo a crear)

---

**Tiempo estimado de aplicación: 30-45 minutos**

**¿Listo para aplicar las correcciones?** 🔧
