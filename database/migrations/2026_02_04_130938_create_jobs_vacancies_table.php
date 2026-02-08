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
        Schema::create('jobs_vacancies', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->string('company');
        $table->string('logo_url')->nullable();
        $table->string('location');
        $table->string('salary');
        $table->string('type'); // Full-time, Remote, Internship, dll
        $table->enum('status', ['active', 'closed', 'draft'])->default('draft');
        $table->text('description');
        $table->json('requirements'); // Kita simpan sebagai JSON agar bisa menyimpan banyak poin
        $table->timestamp('expires_at')->nullable();
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs_vacancies');
    }
};
