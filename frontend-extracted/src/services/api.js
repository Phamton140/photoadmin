
import { apiRequest } from "@/lib/api";

export const authService = {
  login: (credentials) => apiRequest('/login', 'POST', credentials),
  register: (data) => apiRequest('/register', 'POST', data),
  logout: () => apiRequest('/logout', 'POST'),
  me: () => apiRequest('/me'),
};

export const userService = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (data) => apiRequest('/users', 'POST', data),
  update: (id, data) => apiRequest(`/users/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/users/${id}`, 'DELETE'),
  // Fixed endpoint: Matches /api/users/{id}/roles structure
  assignRole: (userId, roleId) => apiRequest(`/users/${userId}/roles`, 'POST', { role_id: roleId }),
  removeRole: (userId, roleId) => apiRequest(`/users/${userId}/roles/${roleId}`, 'DELETE'),
};

export const roleService = {
  getAll: () => apiRequest('/roles'),
  getById: (id) => apiRequest(`/roles/${id}`),
  create: (data) => apiRequest('/roles', 'POST', data),
  update: (id, data) => apiRequest(`/roles/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/roles/${id}`, 'DELETE'),
  // Matches /api/roles/{id}/permissions structure
  assignPermission: (roleId, permId) => apiRequest(`/roles/${roleId}/permissions`, 'POST', { permission_id: permId }),
  removePermission: (roleId, permId) => apiRequest(`/roles/${roleId}/permissions/${permId}`, 'DELETE'),
};

export const permissionService = {
  getAll: () => apiRequest('/permissions'),
  getById: (id) => apiRequest(`/permissions/${id}`),
  create: (data) => apiRequest('/permissions', 'POST', data),
  update: (id, data) => apiRequest(`/permissions/${id}`, 'PUT', data),
};

export const branchService = {
  getAll: () => apiRequest('/branches'),
  getById: (id) => apiRequest(`/branches/${id}`),
  create: (data) => apiRequest('/branches', 'POST', data),
  update: (id, data) => apiRequest(`/branches/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/branches/${id}`, 'DELETE'),
};

export const clientService = {
  getAll: () => apiRequest('/clients'),
  getById: (id) => apiRequest(`/clients/${id}`),
  create: (data) => apiRequest('/clients', 'POST', data),
  update: (id, data) => apiRequest(`/clients/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/clients/${id}`, 'DELETE'),
};

export const projectService = {
  getAll: () => apiRequest('/projects'),
  getById: (id) => apiRequest(`/projects/${id}`),
  create: (data) => apiRequest('/projects', 'POST', data),
  update: (id, data) => apiRequest(`/projects/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/projects/${id}`, 'DELETE'),
  getFiles: (id) => apiRequest(`/projects/${id}/files`),
  uploadFile: (id, formData) => apiRequest(`/projects/${id}/files`, 'POST', formData),
};

export const productionService = {
  getAll: () => apiRequest('/production'),
  getById: (id) => apiRequest(`/production/${id}`),
  create: (data) => apiRequest('/production', 'POST', data),
  update: (id, data) => apiRequest(`/production/${id}`, 'PUT', data),
  delete: (id) => apiRequest(`/production/${id}`, 'DELETE'),
};

export const auditService = {
  getAll: (params) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/audit?${query}`);
  },
};

export const reportService = {
  getSummary: () => apiRequest('/reports/summary'),
  getProjectsByBranch: () => apiRequest('/reports/projects-by-branch'),
  getProductivity: () => apiRequest('/reports/productivity'),
};
