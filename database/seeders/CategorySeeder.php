<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Categorías principales para Paquetes
        $bodas = Category::create(['name' => 'Bodas', 'parent_id' => null]);
        $quinceaños = Category::create(['name' => 'Quinceaños', 'parent_id' => null]);
        $eventos = Category::create(['name' => 'Eventos Corporativos', 'parent_id' => null]);

        // Subcategorías de Bodas
        Category::create(['name' => 'Boda Básica', 'parent_id' => $bodas->id]);
        Category::create(['name' => 'Boda Premium', 'parent_id' => $bodas->id]);
        Category::create(['name' => 'Boda Destino', 'parent_id' => $bodas->id]);

        // Categorías para Vestimentas
        $vestidosNovia = Category::create(['name' => 'Vestidos de Novia', 'parent_id' => null]);
        $trajes = Category::create(['name' => 'Trajes', 'parent_id' => null]);
        $accesorios = Category::create(['name' => 'Accesorios', 'parent_id' => null]);

        // Subcategorías de Vestidos
        Category::create(['name' => 'Vestidos Clásicos', 'parent_id' => $vestidosNovia->id]);
        Category::create(['name' => 'Vestidos Modernos', 'parent_id' => $vestidosNovia->id]);
        Category::create(['name' => 'Vestidos Vintage', 'parent_id' => $vestidosNovia->id]);
    }
}
