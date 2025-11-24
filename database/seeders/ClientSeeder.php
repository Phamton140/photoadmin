<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use Carbon\Carbon;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $clients = [
            [
                'name' => 'Ana Martínez',
                'phone' => '555-1234',
                'email' => 'ana.martinez@example.com',
                'notes' => 'Cliente frecuente, prefiere vestidos clásicos.',
                'status' => 'active',
                'registered_at' => Carbon::now()->subDays(30),
            ],
            [
                'name' => 'Luis Gómez',
                'phone' => '555-5678',
                'email' => 'luis.gomez@example.com',
                'notes' => 'Interesado en paquetes corporativos.',
                'status' => 'active',
                'registered_at' => Carbon::now()->subDays(20),
            ],
            [
                'name' => 'María Fernández',
                'phone' => '555-9012',
                'email' => 'maria.fernandez@example.com',
                'notes' => 'Solicita accesorios para eventos.',
                'status' => 'inactive',
                'registered_at' => Carbon::now()->subDays(45),
            ],
            [
                'name' => 'Carlos Ruiz',
                'phone' => '555-3456',
                'email' => 'carlos.ruiz@example.com',
                'notes' => 'Cliente nuevo, primera reserva pendiente.',
                'status' => 'active',
                'registered_at' => Carbon::now()->subDays(5),
            ],
            [
                'name' => 'Sofía López',
                'phone' => '555-7890',
                'email' => 'sofia.lopez@example.com',
                'notes' => 'Prefiere vestidos modernos y vintage.',
                'status' => 'active',
                'registered_at' => Carbon::now()->subDays(12),
            ],
        ];

        foreach ($clients as $data) {
            Client::create($data);
        }
    }
}
