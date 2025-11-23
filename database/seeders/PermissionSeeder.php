<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [

            // USERS
            ['name' => 'users.manage', 'description' => 'Gestionar usuarios'],
            ['name' => 'users.create', 'description' => 'Crear usuarios'],
            ['name' => 'users.update', 'description' => 'Actualizar usuarios'],
            ['name' => 'users.delete', 'description' => 'Eliminar usuarios'],

            // ROLES
            ['name' => 'roles.manage', 'description' => 'Gestionar roles'],
            ['name' => 'roles.create', 'description' => 'Crear roles'],
            ['name' => 'roles.update', 'description' => 'Actualizar roles'],
            ['name' => 'roles.delete', 'description' => 'Eliminar roles'],

            // PERMISSIONS
            ['name' => 'permissions.manage', 'description' => 'Gestionar permisos'],

            // AUDIT
            ['name' => 'audit.view', 'description' => 'Ver registro de auditoría'],

            // BRANCHES
            ['name' => 'branches.view', 'description' => 'Ver sucursales'],
            ['name' => 'branches.manage', 'description' => 'Gestionar sucursales'],

            // CLIENTS
            ['name' => 'clients.view', 'description' => 'Ver clientes'],
            ['name' => 'clients.manage', 'description' => 'Gestionar clientes'],

            // PROJECTS
            ['name' => 'projects.view', 'description' => 'Ver proyectos'],
            ['name' => 'projects.manage', 'description' => 'Gestionar proyectos'],

            // PRODUCTION
            ['name' => 'production.view', 'description' => 'Ver producción'],
            ['name' => 'production.manage', 'description' => 'Gestionar producción'],

            // FILES
            ['name' => 'files.upload', 'description' => 'Subir archivos'],

            // REPORTS
            ['name' => 'reports.view', 'description' => 'Ver reportes'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(['name' => $perm['name']], $perm);
        }
    }
}
