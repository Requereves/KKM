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
        // Cek dulu: Jika kolom 'interest' BELUM ADA, baru tambahkan.
        if (!Schema::hasColumn('users', 'interest')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('interest')->nullable()->after('email');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Cek dulu: Jika kolom 'interest' ADA, baru hapus.
            if (Schema::hasColumn('users', 'interest')) {
                $table->dropColumn('interest');
            }
        });
    }
};