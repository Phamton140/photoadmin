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
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('category')->nullable()->after('total_amount');
            $table->decimal('paid_amount', 10, 2)->default(0)->after('category');
            $table->enum('payment_status', ['pending', 'paid'])->default('pending')->after('paid_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['category', 'paid_amount', 'payment_status']);
        });
    }
};
