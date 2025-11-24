<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            // Branches (Sucursales)
            ['name' => 'Ver sucursales', 'key' => 'branches.view', 'module' => 'branches'],
            ['name' => 'Gestionar sucursales', 'key' => 'branches.manage', 'module' => 'branches'],

            // Clients (Clientes)
            ['name' => 'Ver clientes', 'key' => 'clients.view', 'module' => 'clients'],
            ['name' => 'Gestionar clientes', 'key' => 'clients.manage', 'module' => 'clients'],

            // Projects (Proyectos)
            ['name' => 'Ver proyectos', 'key' => 'projects.view', 'module' => 'projects'],
            ['name' => 'Gestionar proyectos', 'key' => 'projects.manage', 'module' => 'projects'],

            // Production tasks (Producción)
            ['name' => 'Ver tareas de producción', 'key' => 'production.view', 'module' => 'production'],
            ['name' => 'Gestionar tareas de producción', 'key' => 'production.manage', 'module' => 'production'],

            // Files upload (Archivos de proyecto)
            ['name' => 'Subir archivos de proyecto', 'key' => 'files.upload', 'module' => 'files'],

            // Reports (Reportes)
            ['name' => 'Ver reportes', 'key' => 'reports.view', 'module' => 'reports'],

            // Services (Paquetes y Vestimentas)
            ['name' => 'Gestionar paquetes', 'key' => 'packages.manage', 'module' => 'packages'],
            ['name' => 'Gestionar vestimentas', 'key' => 'clothes.manage', 'module' => 'clothes'],
            // Reservas
            ['name' => 'Gestionar reservas', 'key' => 'reservations.manage', 'module' => 'reservations'],
        ];

        foreach ($permissions as $perm) {
            Permission::updateOrCreate(
                ['key' => $perm['key']],
                ['name' => $perm['name'], 'module' => $perm['module']]
            );
        }
    }
}
