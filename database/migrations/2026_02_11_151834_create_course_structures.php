<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        // 1. Buat Tabel Courses DULU (Induknya)
        // Kita buat lagi di sini karena file migration aslinya hilang/tidak jalan saat fresh
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('instructor');
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
        });

        // 2. Baru Buat Tabel Modules (Anaknya)
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            // Sekarang aman, karena tabel 'courses' sudah dibuat di atas baris ini
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('title');
            $table->string('duration')->nullable(); // Total durasi per modul
            $table->timestamps();
        });

        // 3. Terakhir Tabel Lessons (Cucunya)
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            // Menyambung ke tabel modules
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->string('title');
            $table->string('duration')->nullable(); // Durasi per video/bacaan
            $table->enum('type', ['video', 'article', 'quiz'])->default('video');
            $table->string('content_url')->nullable(); // Link video atau isi artikel
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Hapus dari yang paling anak (Lessons) dulu, baru Modules, baru Courses
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('courses');
    }
};