<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ejecutar seeders principales
        $this->call([
            CategorySeeder::class,
            PermissionSeeder::class,
            RolePermissionSeeder::class,
            SuperAdminSeeder::class,
        ]);
    }
}
