<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class UserSeeder extends Seeder
{
    /**
     * Crear usuarios de prueba para cada rol del sistema.
     */
    public function run(): void
    {
        // Obtener todos los roles
        $roles = Role::all();

        foreach ($roles as $role) {
            // Convertir el nombre del rol a minúsculas para el email
            $emailPrefix = strtolower($role->name);
            $email = "{$emailPrefix}@photoadmin.com";

            // Crear o actualizar el usuario
            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name'     => ucfirst($role->name) . ' User',
                    'password' => Hash::make('password123'),
                ]
            );

            // Asignar el rol al usuario
            $user->roles()->sync([$role->id]);

            $this->command->info("✓ Usuario creado: {$email} (Rol: {$role->name})");
        }

        $this->command->info("\n✅ Todos los usuarios han sido creados con la contraseña: password123");
    }
}
