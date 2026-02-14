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
        Schema::create('job_skills', function (Blueprint $table) {
            $table->id();
            
            // 1. Foreign Key ke tabel 'skills'
            $table->foreignId('skill_id')->constrained('skills')->onDelete('cascade');

            // 2. Foreign Key ke tabel 'job_vacancies' 
            // PENTING: Pastikan nama tabel di database kamu 'job_vacancies' atau 'jobs'
            // Jika tabelmu namanya 'jobs', ubah jadi ->constrained('jobs')
            $table->foreignId('job_vacancy_id')->constrained('job_vacancies')->onDelete('cascade');

            // Opsional: Mencegah duplikasi data (skill yang sama di job yang sama)
            $table->unique(['skill_id', 'job_vacancy_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_skills');
    }
};