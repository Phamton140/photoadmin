
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Layout from "@/components/Layout";
import AuthGuard from "@/lib/AuthGuard";
import { Helmet } from 'react-helmet';
import { Toaster } from "@/components/ui/toaster";

// Users
import UsersList from "@/pages/users/UsersList";
import UserForm from "@/pages/users/UserForm";
import UserView from "@/pages/users/UserView";

// Roles
import RolesList from "@/pages/roles/RolesList";
import RoleForm from "@/pages/roles/RoleForm";

// Permissions
import PermissionsList from "@/pages/permissions/PermissionsList";
import PermissionForm from "@/pages/permissions/PermissionForm";

// Branches
import BranchesList from "@/pages/branches/BranchesList";
import BranchForm from "@/pages/branches/BranchForm";

// Reservations
import ReservationsList from "@/pages/reservations/ReservationsList";
import ReservationForm from "@/pages/reservations/ReservationForm";

// Clients
import ClientsList from "@/pages/clients/ClientsList";
import ClientForm from "@/pages/clients/ClientForm";

// Services (New Module)
import ServicesList from "@/pages/services/ServicesList";
import PackageForm from "@/pages/services/PackageForm";
import ClothingForm from "@/pages/services/ClothingForm";

// Categories
import CategoriesList from "@/pages/categories/CategoriesList";
import CategoryForm from "@/pages/categories/CategoryForm";

// Projects
import ProjectsList from "@/pages/projects/ProjectsList";
import ProjectForm from "@/pages/projects/ProjectForm";

// Production
import ProductionList from "@/pages/production/ProductionList";
import ProductionForm from "@/pages/production/ProductionForm";

// Reports
import ReportsSummary from "@/pages/reports/ReportsSummary";
import ReportsProjectsByBranch from "@/pages/reports/ReportsProjectsByBranch";
import ReportsProductivity from "@/pages/reports/ReportsProductivity";

// System
import AuditLog from "@/pages/audit/AuditLog";
import Settings from "@/pages/Settings";

function App() {
  return (
    <>
      <Helmet>
        <title>Photoadmin Panel</title>
        <meta name="description" content="Photoadmin Panel - Administrative interface" />
      </Helmet>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AuthGuard />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Users */}
            <Route path="users" element={<UsersList />} />
            <Route path="users/create" element={<UserForm />} />
            <Route path="users/:id" element={<UserView />} />
            <Route path="users/:id/edit" element={<UserForm />} />
            
            {/* Roles */}
            <Route path="roles" element={<RolesList />} />
            <Route path="roles/create" element={<RoleForm />} />
            <Route path="roles/:id/edit" element={<RoleForm />} />

            {/* Permissions */}
            <Route path="permissions" element={<PermissionsList />} />
            <Route path="permissions/create" element={<PermissionForm />} />
            <Route path="permissions/:id/edit" element={<PermissionForm />} />

            {/* Branches */}
            <Route path="branches" element={<BranchesList />} />
            <Route path="branches/create" element={<BranchForm />} />
            <Route path="branches/:id/edit" element={<BranchForm />} />

            {/* Reservations */}
            <Route path="reservations" element={<ReservationsList />} />
            <Route path="reservations/create" element={<ReservationForm />} />
            <Route path="reservations/:id/edit" element={<ReservationForm />} />

            {/* Clients */}
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/create" element={<ClientForm />} />
            <Route path="clients/:id/edit" element={<ClientForm />} />

            {/* Services - New Module Routes */}
            <Route path="services" element={<ServicesList />} />
            
            {/* Packages Routes */}
            <Route path="services/packages/create" element={<PackageForm />} />
            <Route path="services/packages/:id/edit" element={<PackageForm />} />
            
            {/* Clothing Routes */}
            <Route path="services/clothing/create" element={<ClothingForm />} />
            <Route path="services/clothing/:id/edit" element={<ClothingForm />} />

            {/* Categories */}
            <Route path="categories" element={<CategoriesList />} />
            <Route path="categories/create" element={<CategoryForm />} />
            <Route path="categories/:id/edit" element={<CategoryForm />} />

            {/* Projects */}
            <Route path="projects" element={<ProjectsList />} />
            <Route path="projects/create" element={<ProjectForm />} />
            <Route path="projects/:id/edit" element={<ProjectForm />} />

            {/* Production */}
            <Route path="production" element={<ProductionList />} />
            <Route path="production/create" element={<ProductionForm />} />
            <Route path="production/:id/edit" element={<ProductionForm />} />

            {/* Reports */}
            <Route path="reports" element={<ReportsSummary />} />
            <Route path="reports/branches" element={<ReportsProjectsByBranch />} />
            <Route path="reports/productivity" element={<ReportsProductivity />} />

            {/* System */}
            <Route path="audit" element={<AuditLog />} />
            <Route path="settings" element={<Settings />} />
            
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
