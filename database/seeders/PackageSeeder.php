<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;
use App\Models\Category;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener categorías
        $bodas = Category::where('name', 'Bodas')->first();
        $quinceaños = Category::where('name', 'Quinceaños')->first();
        $eventos = Category::where('name', 'Eventos Corporativos')->first();

        $bodaBasica = Category::where('name', 'Boda Básica')->first();
        $bodaPremium = Category::where('name', 'Boda Premium')->first();
        $bodaDestino = Category::where('name', 'Boda Destino')->first();

        // Paquetes de Bodas
        Package::create([
            'name' => 'Paquete Boda Esencial',
            'category_id' => $bodas->id,
            'subcategory_id' => $bodaBasica->id,
            'description' => 'Paquete básico para bodas íntimas. Incluye: fotografía de ceremonia y recepción (4 horas), 200 fotos editadas, álbum digital.',
            'price' => 15000.00,
            'duration' => 4,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Boda Romántica',
            'category_id' => $bodas->id,
            'subcategory_id' => $bodaBasica->id,
            'description' => 'Cobertura completa del día. Incluye: fotografía y video (6 horas), 300 fotos editadas, video highlights, álbum impreso 20x30.',
            'price' => 28000.00,
            'duration' => 6,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Boda Premium Gold',
            'category_id' => $bodas->id,
            'subcategory_id' => $bodaPremium->id,
            'description' => 'Experiencia premium completa. Incluye: 2 fotógrafos + videógrafo (8 horas), 500 fotos editadas, video cinematográfico, álbum premium 30x40, sesión pre-boda.',
            'price' => 45000.00,
            'duration' => 8,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Boda Destino Paradise',
            'category_id' => $bodas->id,
            'subcategory_id' => $bodaDestino->id,
            'description' => 'Paquete exclusivo para bodas destino. Incluye: cobertura completa 2 días, drone, 2 fotógrafos + videógrafo, álbum premium, video documental.',
            'price' => 75000.00,
            'duration' => 2,
            'duration_unit' => 'days',
        ]);

        // Paquetes de Quinceaños
        Package::create([
            'name' => 'Paquete Quinceañera Clásico',
            'category_id' => $quinceaños->id,
            'subcategory_id' => null,
            'description' => 'Paquete tradicional para quinceaños. Incluye: fotografía (4 horas), 200 fotos editadas, video highlights, álbum digital.',
            'price' => 12000.00,
            'duration' => 4,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Quinceañera Premium',
            'category_id' => $quinceaños->id,
            'subcategory_id' => null,
            'description' => 'Celebración inolvidable. Incluye: fotografía y video (6 horas), 300 fotos editadas, video cinematográfico, álbum impreso, sesión pre-quinceaños.',
            'price' => 22000.00,
            'duration' => 6,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Quinceañera VIP',
            'category_id' => $quinceaños->id,
            'subcategory_id' => null,
            'description' => 'Experiencia VIP completa. Incluye: 2 fotógrafos + videógrafo (8 horas), 400 fotos editadas, video documental, álbum premium, drone, sesión pre-quinceaños en locación.',
            'price' => 35000.00,
            'duration' => 8,
            'duration_unit' => 'hours',
        ]);

        // Paquetes de Eventos Corporativos
        Package::create([
            'name' => 'Paquete Corporativo Básico',
            'category_id' => $eventos->id,
            'subcategory_id' => null,
            'description' => 'Cobertura profesional para eventos empresariales. Incluye: fotografía (3 horas), 150 fotos editadas, entrega digital en 48 horas.',
            'price' => 8000.00,
            'duration' => 3,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Corporativo Premium',
            'category_id' => $eventos->id,
            'subcategory_id' => null,
            'description' => 'Cobertura completa para eventos corporativos. Incluye: fotografía y video (5 horas), 250 fotos editadas, video resumen, galería online privada.',
            'price' => 18000.00,
            'duration' => 5,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Paquete Corporativo Conferencia',
            'category_id' => $eventos->id,
            'subcategory_id' => null,
            'description' => 'Ideal para conferencias y convenciones. Incluye: 2 fotógrafos (día completo), 400 fotos editadas, video highlights, transmisión en vivo opcional.',
            'price' => 30000.00,
            'duration' => 1,
            'duration_unit' => 'days',
        ]);

        // Paquetes especiales
        Package::create([
            'name' => 'Sesión de Fotos Estudio',
            'category_id' => $bodas->id,
            'subcategory_id' => null,
            'description' => 'Sesión fotográfica en estudio profesional. Incluye: 2 horas de sesión, 50 fotos editadas, cambios de vestuario ilimitados.',
            'price' => 5000.00,
            'duration' => 2,
            'duration_unit' => 'hours',
        ]);

        Package::create([
            'name' => 'Sesión Exterior Premium',
            'category_id' => $bodas->id,
            'subcategory_id' => null,
            'description' => 'Sesión fotográfica en locación exterior. Incluye: 3 horas de sesión, 80 fotos editadas, 2 locaciones, asistente de producción.',
            'price' => 8500.00,
            'duration' => 3,
            'duration_unit' => 'hours',
        ]);
    }
}
