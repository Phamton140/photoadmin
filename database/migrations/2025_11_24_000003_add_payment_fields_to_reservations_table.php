<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('payment_method')->nullable()->after('payment_status')
                ->comment('Método de pago: efectivo, transferencia, tarjeta');
            $table->string('bank_code')->nullable()->after('payment_method')
                ->comment('Código del banco para transferencias');
            $table->string('transfer_screenshot')->nullable()->after('bank_code')
                ->comment('Ruta de la captura de transferencia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['payment_method', 'bank_code', 'transfer_screenshot']);
        });
    }
};
