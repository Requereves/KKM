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

    Schema::create('modules', function (Blueprint $table) {
        $table->id();
        $table->foreignId('course_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->string('duration')->nullable();
        $table->timestamps();
    });

    Schema::create('lessons', function (Blueprint $table) {
        $table->id();
        $table->foreignId('module_id')->constrained()->onDelete('cascade');
        $table->string('title');
        $table->string('duration')->nullable();
        $table->enum('type', ['video', 'article'])->default('video');
        $table->string('content_url')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_structures');
    }
};
