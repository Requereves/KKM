<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 🔥 HAPUS TABEL LAMA DULU (Agar struktur reset bersih)
        // Disable foreign keys sementara untuk mencegah error saat drop
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('job_vacancies');
        Schema::dropIfExists('jobs_vacancies'); 
        Schema::enableForeignKeyConstraints();

        // 🔥 STRUKTUR BARU (LENGKAP DENGAN REQUIREMENTS)
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            
            // Data Utama
            $table->string('title');
            $table->string('company');
            $table->string('location');
            
            // Pilihan Statis (Enum) - Sesuai Dropdown di Frontend
            $table->enum('type', ['Full-time', 'Part-time', 'Contract', 'Internship']);
            $table->enum('status', ['active', 'closed', 'draft'])->default('draft');
            
            // Keuangan
            $table->decimal('salary', 15, 0)->nullable(); 
            
            // Detail Tambahan
            $table->text('description')->nullable();
            
            // 🔥 PENTING: Kolom untuk menyimpan list persyaratan (JSON Array)
            $table->json('requirements')->nullable(); 
            
            // Tanggal Deadline
            $table->date('deadline')->nullable(); 
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_vacancies');
    }
};