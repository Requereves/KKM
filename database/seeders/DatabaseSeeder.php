<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\JobVacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 0. Panggil Seeder Course (Agar data course muncul untuk rekomendasi)
        // Pastikan file CourseSeeder.php ada. Jika error, bisa dikomentari dulu.
        $this->call(CourseSeeder::class);

        // 1. GENESIS ADMIN (Akun Dewa/Utama)
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@arahin.id', 
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // 2. AKUN MAHASISWA DUMMY (Untuk Testing Rekomendasi)
        $mhs = User::create([
            'name' => 'Ghufroon Mahasiswa',
            'email' => 'ghufroon@student.com',
            'password' => Hash::make('password'),
            'role' => 'mahasiswa',
            'email_verified_at' => now(),
            'interest' => 'Web Development', 
        ]);

        // 3. DATA PROFILE MAHASISWA
        Student::create([
            'user_id' => $mhs->id,
            'nim' => '12345678',
            'full_name' => 'Ghufroon Mahasiswa',
        ]);

        // ---------------------------------------------------------
        // 4. DUMMY JOB VACANCIES (DATA STATISTIK SPESIFIK)
        // ---------------------------------------------------------
        
        // Bersihkan data lama agar statistik akurat saat seed ulang
        JobVacancy::truncate();

        // DATA 1: Active, Technology, Full-time, 3 Applicants
        // Ini menyumbang ke: Active Jobs (+1), Tech Chart, Full-time Chart, Total Applicants (+3)
        JobVacancy::create([
            'title' => 'Frontend Developer',
            'slug' => 'frontend-dev-stats',
            'company' => 'Tech Corp',
            'location' => 'Jakarta',
            'type' => 'Full-time',
            'category' => 'Technology',
            'status' => 'active',
            'applicants_count' => 3,
            'description' => 'React JS Expert needed.',
            'salary' => 'Rp 15.000.000',
        ]);

        // DATA 2: Active, Data Science, Internship, 3 Applicants
        // Ini menyumbang ke: Active Jobs (+1), Data Sci Chart, Internship Chart, Total Applicants (+3)
        JobVacancy::create([
            'title' => 'Data Analyst',
            'slug' => 'data-analyst-stats',
            'company' => 'Big Data Inc',
            'location' => 'Bandung',
            'type' => 'Internship',
            'category' => 'Data Science',
            'status' => 'active',
            'applicants_count' => 3,
            'description' => 'Python & SQL analysis.',
            'salary' => 'Rp 4.000.000',
        ]);

        // DATA 3: Closed, Design, Contract, 0 Applicants
        // Ini menyumbang ke: Total Jobs (+1), Design Chart, Contract Chart. TAPI TIDAK ke Active Jobs.
        JobVacancy::create([
            'title' => 'UI/UX Designer',
            'slug' => 'ui-ux-stats',
            'company' => 'Creative Studio',
            'location' => 'Surabaya',
            'type' => 'Contract',
            'category' => 'Design',
            'status' => 'closed',
            'applicants_count' => 0,
            'description' => 'Figma design system.',
            'salary' => 'Rp 8.000.000',
        ]);

        // DATA 4: Draft, Technology, Full-time, 0 Applicants
        // Ini menyumbang ke: Total Jobs (+1). TIDAK MUNCUL di Chart (karena status draft).
        JobVacancy::create([
            'title' => 'Backend Engineer',
            'slug' => 'backend-draft',
            'company' => 'Server Co',
            'location' => 'Remote',
            'type' => 'Full-time',
            'category' => 'Technology',
            'status' => 'draft',
            'applicants_count' => 0,
            'description' => 'Draft job vacancy.',
            'salary' => 'Rp 12.000.000',
        ]);
    }
}