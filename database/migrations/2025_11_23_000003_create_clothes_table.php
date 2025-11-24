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
        Schema::create('clothes', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable(); // path to stored image
            $table->string('name');
            $table->foreignId('category_id')->constrained('categories');
            $table->foreignId('subcategory_id')->nullable()->constrained('categories');
            $table->foreignId('branch_id')->constrained('branches');
            $table->decimal('price', 10, 2)->nullable();
            $table->enum('status', ['reserved', 'available', 'laundry', 'broken', 'in_session'])
                ->default('available');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clothes');
    }
};
