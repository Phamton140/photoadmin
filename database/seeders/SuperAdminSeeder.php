<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'superadmin@system.com'],
            [
                'name'     => 'Super Administrador',
                'password' => Hash::make('password123'),
            ]
        );

        $superAdminRole = Role::where('name', 'SuperAdmin')->first();

        $user->roles()->sync([$superAdminRole->id]);
    }
}
