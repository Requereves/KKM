<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // <--- Jangan lupa import ini

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Kita ubah kolom 'role' agar bisa menerima value 'psychologist'
        // Pastikan urutan ENUM sesuai dengan kebutuhan (admin, student, psychologist)
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'student', 'psychologist') NOT NULL DEFAULT 'student'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Kembalikan ke settingan awal (hanya admin & student) jika di-rollback
        // HATI-HATI: Jika ada user yang sudah jadi 'psychologist', datanya bisa error saat rollback.
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'student') NOT NULL DEFAULT 'student'");
    }
};