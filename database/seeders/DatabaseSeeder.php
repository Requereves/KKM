<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. GENESIS ADMIN (Akun Dewa/Utama)
        // Ini adalah admin pertama yang dibuat lewat kodingan.
        // Admin selanjutnya nanti dibuat lewat menu di Dashboard Admin.
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@kkm.com',
            'password' => Hash::make('password'), // Password default, ganti nanti!
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // 2. AKUN MAHASISWA DUMMY (Untuk Testing)
        $mhs = User::create([
            'name' => 'Ghufroon Mahasiswa',
            'email' => 'mhs@kkm.com',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa',
            'email_verified_at' => now(),
        ]);

        // Penting: Buat data detail di tabel 'students' agar dashboard tidak error
        Student::create([
            'user_id' => $mhs->id,
            'nim' => '12345678',
            'full_name' => 'Ghufroon Mahasiswa',
        ]);
    }
}