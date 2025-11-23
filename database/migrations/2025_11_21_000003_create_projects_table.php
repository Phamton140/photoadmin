<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            // Relaciones principales
            $table->foreignId('client_id')
                ->constrained('clients')
                ->cascadeOnDelete();

            $table->foreignId('branch_id')
                ->nullable()
                ->constrained('branches')
                ->nullOnDelete();

            $table->foreignId('responsible_id') // empleado responsable
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            // Información del proyecto
            $table->string('title');
            $table->string('type')->nullable(); // boda, evento, estudio, comercial, etc.
            $table->dateTime('session_date')->nullable();
            $table->dateTime('estimated_delivery_date')->nullable();
            $table->dateTime('delivered_at')->nullable();

            $table->enum('status', [
                'pending',      // creado pero no iniciado
                'in_progress',  // en producción
                'delivered',    // entregado al cliente
                'cancelled'
            ])->default('pending');

            $table->text('internal_notes')->nullable();
            $table->unsignedInteger('priority')->default(1); // 1 = normal, 2 = alta, etc.

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
