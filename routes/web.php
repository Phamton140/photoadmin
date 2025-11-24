<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return view('welcome');
});

// RUTA TEMPORAL PARA ARREGLAR IMÁGENES EN HOSTINGER
Route::get('/fix-storage', function () {
    try {
        // 1. Intentar crear el enlace usando Artisan (método estándar)
        Artisan::call('storage:link');
        return '<h1>✅ Éxito</h1><p>El enlace simbólico se ha creado correctamente.</p><p>Salida: ' . Artisan::output() . '</p>';
    } catch (\Exception $e) {
        // 2. Si falla, intentar método manual (común en hostings compartidos)
        try {
            $target = storage_path('app/public');
            $link = public_path('storage');

            if (file_exists($link)) {
                return '<h1>⚠️ Aviso</h1><p>El enlace ya existe. Si las imágenes no se ven, bórralo manualmente desde el Administrador de Archivos y recarga esta página.</p>';
            }

            symlink($target, $link);
            return '<h1>✅ Éxito (Manual)</h1><p>Enlace simbólico creado manualmente.</p>';
        } catch (\Exception $e2) {
            return '<h1>❌ Error</h1><p>No se pudo crear el enlace.</p><p>Error: ' . $e2->getMessage() . '</p>';
        }
    }
});
