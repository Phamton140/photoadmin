# 🔗 GUÍA DE INTEGRACIÓN FRONTEND - PhotoAdmin

## 📋 INFORMACIÓN GENERAL

**Base URL API:** `http://localhost:8000/api` (desarrollo) o `https://api.tu-dominio.com/api` (producción)

**Autenticación:** Bearer Token (Laravel Sanctum)

**Formato de respuesta:** JSON

---

## 🚀 INICIO RÁPIDO

### 1. Configuración Inicial

```javascript
// config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const apiClient = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('auth_token');
        
        const config = {
            ...options,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` }),
                ...options.headers,
            },
        };
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error en la petición');
        }
        
        return response.json();
    },
    
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },
    
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    
    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    },
};
```

---

## 🔐 AUTENTICACIÓN

### Login

```javascript
// services/auth.js
export const authService = {
    async login(email, password) {
        const response = await apiClient.post('/login', { email, password });
        
        // Guardar token
        localStorage.setItem('auth_token', response.token);
        
        // Guardar usuario
        localStorage.setItem('user', JSON.stringify(response.user));
        
        return response;
    },
    
    async logout() {
        await apiClient.post('/logout');
        
        // Limpiar storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
    },
    
    async getProfile() {
        return await apiClient.get('/me');
    },
    
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    },
    
    hasPermission(permission) {
        const user = this.getCurrentUser();
        return user?.permissions?.includes(permission) || false;
    },
    
    hasRole(role) {
        const user = this.getCurrentUser();
        return user?.roles?.some(r => r.name === role) || false;
    },
};
```

**Uso:**

```javascript
// Componente Login
const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
        const response = await authService.login(email, password);
        console.log('Usuario logueado:', response.user);
        
        // Redirigir al dashboard
        navigate('/dashboard');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setError('Credenciales incorrectas');
    }
};
```

---

## 👥 GESTIÓN DE USUARIOS

### Listar Usuarios

```javascript
// services/users.js
export const userService = {
    async getAll(page = 1, perPage = 20) {
        return await apiClient.get(`/users?page=${page}&per_page=${perPage}`);
    },
    
    async getById(id) {
        return await apiClient.get(`/users/${id}`);
    },
    
    async create(userData) {
        return await apiClient.post('/users', userData);
    },
    
    async update(id, userData) {
        return await apiClient.put(`/users/${id}`, userData);
    },
    
    async delete(id) {
        return await apiClient.delete(`/users/${id}`);
    },
    
    // Gestión de roles
    async assignRole(userId, roleId) {
        return await apiClient.post(`/users/${userId}/roles`, { role_id: roleId });
    },
    
    async removeRole(userId, roleId) {
        return await apiClient.delete(`/users/${userId}/roles/${roleId}`);
    },
};
```

**Uso en componente:**

```javascript
// Componente UserList
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchUsers = async () => {
        try {
            const data = await userService.getAll();
            setUsers(data.data); // Si hay paginación
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchUsers();
}, []);
```

---

## 🏢 GESTIÓN DE SUCURSALES

```javascript
// services/branches.js
export const branchService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await apiClient.get(`/branches?${params}`);
    },
    
    async getById(id) {
        return await apiClient.get(`/branches/${id}`);
    },
    
    async create(branchData) {
        return await apiClient.post('/branches', branchData);
    },
    
    async update(id, branchData) {
        return await apiClient.put(`/branches/${id}`, branchData);
    },
    
    async delete(id) {
        return await apiClient.delete(`/branches/${id}`);
    },
};
```

**Ejemplo de formulario:**

```javascript
const BranchForm = ({ branchId, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        manager_name: '',
        status: 'active',
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (branchId) {
                await branchService.update(branchId, formData);
            } else {
                await branchService.create(formData);
            }
            
            onSuccess();
        } catch (error) {
            console.error('Error al guardar sucursal:', error);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Nombre de la sucursal"
                required
            />
            {/* Más campos... */}
            <button type="submit">Guardar</button>
        </form>
    );
};
```

---

## 👤 GESTIÓN DE CLIENTES

```javascript
// services/clients.js
export const clientService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await apiClient.get(`/clients?${params}`);
    },
    
    async getById(id) {
        return await apiClient.get(`/clients/${id}`);
    },
    
    async create(clientData) {
        return await apiClient.post('/clients', {
            name: clientData.name,
            phone: clientData.phone,
            email: clientData.email,
            notes: clientData.notes,
            status: clientData.status || 'active',
            registered_at: clientData.registered_at || new Date().toISOString(),
        });
    },
    
    async update(id, clientData) {
        return await apiClient.put(`/clients/${id}`, clientData);
    },
    
    async delete(id) {
        return await apiClient.delete(`/clients/${id}`);
    },
    
    // Búsqueda
    async search(query) {
        return await apiClient.get(`/clients?search=${encodeURIComponent(query)}`);
    },
};
```

---

## 📁 GESTIÓN DE PROYECTOS

```javascript
// services/projects.js
export const projectService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await apiClient.get(`/projects?${params}`);
    },
    
    async getById(id) {
        return await apiClient.get(`/projects/${id}`);
    },
    
    async create(projectData) {
        return await apiClient.post('/projects', {
            client_id: projectData.client_id,
            branch_id: projectData.branch_id,
            responsible_id: projectData.responsible_id,
            title: projectData.title,
            type: projectData.type,
            session_date: projectData.session_date,
            estimated_delivery_date: projectData.estimated_delivery_date,
            priority: projectData.priority || 1,
            internal_notes: projectData.internal_notes,
            status: projectData.status || 'pending',
        });
    },
    
    async update(id, projectData) {
        return await apiClient.put(`/projects/${id}`, projectData);
    },
    
    async delete(id) {
        return await apiClient.delete(`/projects/${id}`);
    },
    
    // Filtros específicos
    async getByStatus(status) {
        return await apiClient.get(`/projects?status=${status}`);
    },
    
    async getByBranch(branchId) {
        return await apiClient.get(`/projects?branch_id=${branchId}`);
    },
    
    async getByClient(clientId) {
        return await apiClient.get(`/projects?client_id=${clientId}`);
    },
};
```

**Ejemplo de uso con filtros:**

```javascript
const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [filters, setFilters] = useState({
        status: '',
        branch_id: '',
        search: '',
    });
    
    useEffect(() => {
        const fetchProjects = async () => {
            const data = await projectService.getAll(filters);
            setProjects(data.data);
        };
        
        fetchProjects();
    }, [filters]);
    
    return (
        <div>
            <select onChange={(e) => setFilters({...filters, status: e.target.value})}>
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="in_progress">En Progreso</option>
                <option value="delivered">Entregado</option>
                <option value="cancelled">Cancelado</option>
            </select>
            
            {/* Lista de proyectos */}
        </div>
    );
};
```

---

## 📋 GESTIÓN DE TAREAS DE PRODUCCIÓN

```javascript
// services/production.js
export const productionService = {
    async getAll(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        return await apiClient.get(`/production?${params}`);
    },
    
    async create(taskData) {
        return await apiClient.post('/production', {
            project_id: taskData.project_id,
            editor_id: taskData.editor_id,
            name: taskData.name,
            status: taskData.status || 'pending',
            estimated_minutes: taskData.estimated_minutes,
            notes: taskData.notes,
        });
    },
    
    async update(id, taskData) {
        return await apiClient.put(`/production/${id}`, taskData);
    },
    
    async delete(id) {
        return await apiClient.delete(`/production/${id}`);
    },
    
    // Acciones específicas
    async startTask(id) {
        return await apiClient.put(`/production/${id}`, {
            status: 'in_progress',
            started_at: new Date().toISOString(),
        });
    },
    
    async completeTask(id, spentMinutes) {
        return await apiClient.put(`/production/${id}`, {
            status: 'completed',
            finished_at: new Date().toISOString(),
            spent_minutes: spentMinutes,
        });
    },
};
```

---

## 📎 GESTIÓN DE ARCHIVOS

```javascript
// services/files.js
export const fileService = {
    async upload(projectId, file, type = 'other') {
        const formData = new FormData();
        formData.append('project_id', projectId);
        formData.append('file', file);
        formData.append('type', type);
        
        const token = localStorage.getItem('auth_token');
        
        const response = await fetch(`${API_BASE_URL}/project-files`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });
        
        if (!response.ok) {
            throw new Error('Error al subir archivo');
        }
        
        return response.json();
    },
    
    async download(fileId) {
        const token = localStorage.getItem('auth_token');
        
        const response = await fetch(`${API_BASE_URL}/project-files/${fileId}/download`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        
        if (!response.ok) {
            throw new Error('Error al descargar archivo');
        }
        
        // Descargar archivo
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'archivo'; // El backend debería enviar el nombre
        a.click();
    },
    
    async delete(fileId) {
        return await apiClient.delete(`/project-files/${fileId}`);
    },
};
```

**Componente de upload:**

```javascript
const FileUpload = ({ projectId, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        setUploading(true);
        
        try {
            const response = await fileService.upload(projectId, file, 'raw');
            console.log('Archivo subido:', response);
            onUploadSuccess(response);
        } catch (error) {
            console.error('Error al subir archivo:', error);
        } finally {
            setUploading(false);
        }
    };
    
    return (
        <div>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                accept="image/*,video/*,.pdf"
            />
            {uploading && <p>Subiendo archivo...</p>}
        </div>
    );
};
```

---

## 📊 REPORTES Y KPIs

```javascript
// services/reports.js
export const reportService = {
    async getSummary() {
        return await apiClient.get('/reports/summary');
    },
    
    async getProjectsByBranch() {
        return await apiClient.get('/reports/projects-by-branch');
    },
    
    async getProductivity() {
        return await apiClient.get('/reports/productivity');
    },
};
```

**Dashboard con KPIs:**

```javascript
const Dashboard = () => {
    const [kpis, setKpis] = useState(null);
    
    useEffect(() => {
        const fetchKPIs = async () => {
            const data = await reportService.getSummary();
            setKpis(data);
        };
        
        fetchKPIs();
    }, []);
    
    if (!kpis) return <div>Cargando...</div>;
    
    return (
        <div className="dashboard">
            <div className="kpi-card">
                <h3>Total Usuarios</h3>
                <p>{kpis.total_users}</p>
            </div>
            <div className="kpi-card">
                <h3>Total Clientes</h3>
                <p>{kpis.total_clients}</p>
            </div>
            <div className="kpi-card">
                <h3>Proyectos Activos</h3>
                <p>{kpis.projects_active}</p>
            </div>
            <div className="kpi-card">
                <h3>Proyectos este Mes</h3>
                <p>{kpis.projects_month}</p>
            </div>
        </div>
    );
};
```

---

## 🔒 MANEJO DE PERMISOS EN UI

```javascript
// components/ProtectedComponent.jsx
const ProtectedComponent = ({ permission, children }) => {
    if (!authService.hasPermission(permission)) {
        return null; // O mostrar mensaje de "sin acceso"
    }
    
    return <>{children}</>;
};

// Uso:
<ProtectedComponent permission="projects.manage">
    <button onClick={handleCreateProject}>Crear Proyecto</button>
</ProtectedComponent>
```

```javascript
// components/ProtectedRoute.jsx
const ProtectedRoute = ({ permission, children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    
    if (permission && !authService.hasPermission(permission)) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
};

// Uso en rutas:
<Route
    path="/projects"
    element={
        <ProtectedRoute permission="projects.view">
            <ProjectList />
        </ProtectedRoute>
    }
/>
```

---

## 🚨 MANEJO DE ERRORES

```javascript
// utils/errorHandler.js
export const handleApiError = (error) => {
    if (error.response) {
        // Error de respuesta del servidor
        switch (error.response.status) {
            case 401:
                // No autenticado
                localStorage.removeItem('auth_token');
                window.location.href = '/login';
                break;
            case 403:
                // Sin permisos
                alert('No tienes permisos para realizar esta acción');
                break;
            case 404:
                alert('Recurso no encontrado');
                break;
            case 422:
                // Errores de validación
                const errors = error.response.data.errors;
                return errors;
            case 500:
                alert('Error del servidor. Intenta más tarde.');
                break;
            default:
                alert('Error desconocido');
        }
    } else if (error.request) {
        // Error de red
        alert('Error de conexión. Verifica tu internet.');
    } else {
        // Otro error
        console.error('Error:', error.message);
    }
};
```

---

## 📝 EJEMPLO COMPLETO: CRUD DE PROYECTOS

```javascript
// pages/Projects.jsx
import { useState, useEffect } from 'react';
import { projectService } from '../services/projects';
import { clientService } from '../services/clients';
import { branchService } from '../services/branches';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [branches, setBranches] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    
    const [formData, setFormData] = useState({
        client_id: '',
        branch_id: '',
        title: '',
        type: '',
        session_date: '',
        estimated_delivery_date: '',
        status: 'pending',
        priority: 1,
        internal_notes: '',
    });
    
    useEffect(() => {
        fetchProjects();
        fetchClients();
        fetchBranches();
    }, []);
    
    const fetchProjects = async () => {
        const data = await projectService.getAll();
        setProjects(data);
    };
    
    const fetchClients = async () => {
        const data = await clientService.getAll();
        setClients(data);
    };
    
    const fetchBranches = async () => {
        const data = await branchService.getAll();
        setBranches(data);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            if (editingProject) {
                await projectService.update(editingProject.id, formData);
            } else {
                await projectService.create(formData);
            }
            
            setShowModal(false);
            resetForm();
            fetchProjects();
        } catch (error) {
            console.error('Error al guardar proyecto:', error);
        }
    };
    
    const handleEdit = (project) => {
        setEditingProject(project);
        setFormData(project);
        setShowModal(true);
    };
    
    const handleDelete = async (id) => {
        if (!confirm('¿Eliminar proyecto?')) return;
        
        try {
            await projectService.delete(id);
            fetchProjects();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    };
    
    const resetForm = () => {
        setFormData({
            client_id: '',
            branch_id: '',
            title: '',
            type: '',
            session_date: '',
            estimated_delivery_date: '',
            status: 'pending',
            priority: 1,
            internal_notes: '',
        });
        setEditingProject(null);
    };
    
    return (
        <div>
            <h1>Proyectos</h1>
            
            <button onClick={() => setShowModal(true)}>
                Nuevo Proyecto
            </button>
            
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Cliente</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.title}</td>
                            <td>{project.client?.name}</td>
                            <td>{project.status}</td>
                            <td>
                                <button onClick={() => handleEdit(project)}>
                                    Editar
                                </button>
                                <button onClick={() => handleDelete(project.id)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {showModal && (
                <div className="modal">
                    <form onSubmit={handleSubmit}>
                        <h2>{editingProject ? 'Editar' : 'Nuevo'} Proyecto</h2>
                        
                        <select
                            value={formData.client_id}
                            onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                            required
                        >
                            <option value="">Seleccionar cliente</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                        
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            placeholder="Título del proyecto"
                            required
                        />
                        
                        {/* Más campos... */}
                        
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => {
                            setShowModal(false);
                            resetForm();
                        }}>
                            Cancelar
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Projects;
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

- [ ] Configurar cliente API con autenticación
- [ ] Implementar servicio de autenticación
- [ ] Crear servicios para cada módulo (users, projects, clients, etc.)
- [ ] Implementar manejo de errores global
- [ ] Crear componentes de protección de rutas
- [ ] Implementar componentes de protección por permisos
- [ ] Configurar CORS en backend
- [ ] Probar todos los endpoints
- [ ] Implementar loading states
- [ ] Implementar mensajes de éxito/error
- [ ] Manejar paginación
- [ ] Implementar filtros y búsqueda

---

## 🎓 TIPS FINALES

1. **Usa interceptores** para manejar tokens expirados automáticamente
2. **Implementa retry logic** para peticiones fallidas
3. **Cachea datos** cuando sea apropiado (React Query, SWR)
4. **Valida en frontend** antes de enviar al backend
5. **Muestra feedback** al usuario en cada acción
6. **Maneja estados de carga** para mejor UX
7. **Implementa debounce** en búsquedas
8. **Usa TypeScript** para mejor type safety (opcional)

---

**¡Listo para integrar!** 🚀

Con esta guía tienes todo lo necesario para conectar tu frontend con el backend PhotoAdmin.
