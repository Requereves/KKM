<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Jobs (Lowongan Kerja)
        Schema::create('job_vacancies', function (Blueprint $table) {
    $table->id();
    $table->foreignId('admin_user_id')->constrained('users')->onDelete('cascade');
    $table->string('title', 100);
    $table->string('company_name', 100)->nullable();
    $table->enum('type', ['fulltime', 'internship', 'parttime']);
    $table->text('description')->nullable();
    $table->text('requirements')->nullable();
    $table->timestamps();
});

        // 2. Projects (Proyek Industri)
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->constrained('users')->onDelete('cascade');
            $table->string('project_name', 100);
            $table->string('industry_partner', 100)->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['open', 'closed', 'ongoing'])->default('open');
            $table->timestamps();
        });

        // 3. Trainings (Pelatihan Kampus)
        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_user_id')->constrained('users')->onDelete('cascade');
            $table->string('title', 100);
            $table->string('organizer', 100)->nullable();
            $table->dateTime('schedule')->nullable();
            $table->string('location', 100)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainings');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('jobs');
    }
};