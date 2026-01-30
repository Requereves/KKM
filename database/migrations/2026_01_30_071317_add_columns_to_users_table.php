<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::table('users', function (Blueprint $table) {
        // Menambah kolom username & role sesuai db_kkm.sql
        $table->string('username')->unique()->after('id')->nullable(); 
        $table->enum('role', ['admin', 'mahasiswa'])->default('mahasiswa')->after('password');
    });
}

public function down()
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['username', 'role']);
    });
}
};
