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

        // 🔥 STRUKTUR BARU (LENGKAP DENGAN FIX ERROR SLUG)
        Schema::create('job_vacancies', function (Blueprint $table) {
            $table->id();
            
            // Data Utama
            $table->string('title');
            $table->string('slug')->unique(); // <--- WAJIB ADA (Sesuai Error Log)
            $table->string('company');
            $table->string('location');
            
            // Pilihan Statis (Enum)
            $table->enum('type', ['Full-time', 'Part-time', 'Contract', 'Internship']);
            
            // Kategori (Ditambahkan karena muncul di log query insert)
            $table->string('category')->nullable(); 

            // Status
            $table->enum('status', ['active', 'closed', 'draft'])->default('draft');
            
            // Counter Pelamar (Ditambahkan karena muncul di log query insert)
            $table->integer('applicants_count')->default(0);

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