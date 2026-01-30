<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tabel Students
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            // Relasi ke tabel users (Satu akun login = satu data mahasiswa)
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('nim', 20)->unique()->nullable();
            $table->string('full_name', 100);
            $table->string('email')->nullable();
            $table->string('major', 50)->nullable(); // Jurusan
            $table->string('phone', 20)->nullable();
            $table->year('year_of_entry')->nullable();
            $table->timestamps();
        });

        // 2. Tabel Skills (Master Data)
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('skill_name', 50)->unique();
            $table->timestamps();
        });

        // 3. Tabel Pivot (Student punya banyak Skill)
        Schema::create('student_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');
        });

        // 4. Tabel Portfolios (Tempat upload berkas)
        Schema::create('portfolios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->string('file_path'); // Lokasi file PDF/Gambar
            $table->enum('category', ['sertifikat', 'proyek_kuliah', 'portofolio_bebas']);
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_feedback')->nullable(); // Wajib diisi kalau reject
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('portfolios');
        Schema::dropIfExists('student_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('students');
    }
};