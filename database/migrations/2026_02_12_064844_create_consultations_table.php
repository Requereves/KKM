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
        Schema::create('consultations', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke User (Mahasiswa)
            // Jika user dihapus, data konsultasinya ikut terhapus (cascade)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Data Utama Konsultasi
            $table->string('subject'); // Topik: Karir, Akademik, Personal, dll
            $table->text('description'); // Detail keluhan atau pertanyaan
            
            // Prioritas & Jadwal
            $table->enum('urgency', ['low', 'medium', 'high'])->default('low');
            $table->date('preferred_date'); // Tanggal yang diinginkan user
            
            // Status Tiket
            $table->enum('status', ['pending', 'approved', 'rejected', 'done'])->default('pending');
            
            // Feedback dari Admin/Psikolog (Nullable karena awal buat pasti kosong)
            $table->text('admin_feedback')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('consultations');
    }
};