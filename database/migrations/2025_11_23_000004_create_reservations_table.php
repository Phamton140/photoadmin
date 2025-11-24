<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->unsignedBigInteger('serviceable_id');
            $table->string('serviceable_type'); // "App\\Models\\Package" or "App\\Models\\Cloth"
            $table->dateTime('date'); // reservation date (full datetime, can be whole day)
            $table->decimal('total_amount', 10, 2)->nullable();
            $table->timestamps();

            // optional index for faster look‑ups
            $table->index(['serviceable_id', 'serviceable_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
