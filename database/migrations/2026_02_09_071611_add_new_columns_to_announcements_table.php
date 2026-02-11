<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            // Menambahkan kolom baru
            $table->string('slug')->unique()->after('title')->nullable();
            $table->text('summary')->after('slug')->nullable();
            $table->json('tags')->after('category')->nullable(); // Menyimpan tags sebagai Array JSON

            // Mengubah author dari string nama menjadi ID user (opsional, jika ingin relasi)
            // Untuk saat ini, agar tidak error dengan data lama, kita tambah kolom author_id dulu
            // Nanti di controller kita logika-kan
            $table->unsignedBigInteger('author_id')->nullable()->after('publish_date');

            // Hapus kolom lama yang tidak ada di desain (opsional)
            // $table->dropColumn('target_audience');
        });
    }

    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn(['slug', 'summary', 'tags', 'author_id']);
            // $table->string('target_audience')->default('All');
        });
    }
};