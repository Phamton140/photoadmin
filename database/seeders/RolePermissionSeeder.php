<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // ROLES
        $superAdmin = Role::firstOrCreate(['name' => 'SuperAdmin'], [
            'description' => 'Acceso total al sistema'
        ]);

        $admin = Role::firstOrCreate(['name' => 'Admin'], [
            'description' => 'Administración general'
        ]);

        $editor = Role::firstOrCreate(['name' => 'Editor'], [
            'description' => 'Gestión de proyectos y producción'
        ]);

        $viewer = Role::firstOrCreate(['name' => 'Viewer'], [
            'description' => 'Solo lectura'
        ]);

        // PERMISSIONS
        $allPermissions = Permission::pluck('id')->toArray();

        // SUPERADMIN → TODO
        $superAdmin->permissions()->sync($allPermissions);

        // ADMIN
        $admin->permissions()->sync(
            Permission::whereIn('name', [
                'users.manage', 'users.create', 'users.update', 'users.delete',
                'roles.manage', 'roles.create', 'roles.update', 'roles.delete',
                'permissions.manage',
                'audit.view',
                'branches.view', 'branches.manage',
                'clients.view', 'clients.manage',
                'projects.view', 'projects.manage',
                'production.view', 'production.manage',
                'files.upload',
                'reports.view'
            ])->pluck('id')->toArray()
        );

        // EDITOR
        $editor->permissions()->sync(
            Permission::whereIn('name', [
                'projects.view', 'projects.manage',
                'production.view', 'production.manage',
                'files.upload'
            ])->pluck('id')->toArray()
        );

        // VIEWER
        $viewer->permissions()->sync(
            Permission::whereIn('name', [
                'projects.view',
                'branches.view',
                'clients.view',
                'reports.view'
            ])->pluck('id')->toArray()
        );
    }
}
