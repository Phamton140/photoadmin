<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('production_tasks', function (Blueprint $table) {
            $table->id();

            $table->foreignId('project_id')
                ->constrained('projects')
                ->cascadeOnDelete();

            $table->foreignId('editor_id') // usuario que edita (empleado)
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();

            $table->string('name'); // Ej: "Edición selección 1", "Retoque final"
            $table->enum('status', [
                'pending',
                'in_progress',
                'review',
                'completed',
                'cancelled'
            ])->default('pending');

            $table->dateTime('started_at')->nullable();
            $table->dateTime('finished_at')->nullable();

            // Tiempo estimado / real (en minutos)
            $table->unsignedInteger('estimated_minutes')->nullable();
            $table->unsignedInteger('spent_minutes')->nullable();

            $table->text('notes')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('production_tasks');
    }
};
