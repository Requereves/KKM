<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Student;
use App\Models\JobVacancy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 0. Panggil Seeder Course (Opsional, uncomment jika file ada)
        // $this->call(CourseSeeder::class); 

        // ---------------------------------------------------------
        // 1. GENESIS ADMIN (Akun Utama)
        // ---------------------------------------------------------
        User::firstOrCreate(
            ['email' => 'admin@arahin.id'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // ---------------------------------------------------------
        // 2. AKUN MAHASISWA DUMMY
        // ---------------------------------------------------------
        $mhs = User::firstOrCreate(
            ['email' => 'ghufroon@student.com'],
            [
                'name' => 'Ghufroon Mahasiswa',
                'password' => Hash::make('password'),
                'role' => 'student', // 👈 Pastikan 'student', bukan 'mahasiswa'
                'email_verified_at' => now(),
                'interest' => 'Web Development', 
            ]
        );

        // 3. DATA PROFILE MAHASISWA
        // Cek dulu apakah data student sudah ada untuk user ini
        if (!Student::where('user_id', $mhs->id)->exists()) {
            Student::create([
                'user_id' => $mhs->id,
                'nim' => '12345678',
                'full_name' => 'Ghufroon Mahasiswa',
                // Tambahkan field lain jika diperlukan oleh tabel students
            ]);
        }

        // ---------------------------------------------------------
        // 4. AKUN PSIKOLOG (BARU)
        // ---------------------------------------------------------
        User::firstOrCreate(
            ['email' => 'psikolog@arahin.id'],
            [
                'name' => 'Dr. Psikolog',
                'password' => Hash::make('password'),
                'role' => 'psychologist', // 👈 Role baru
                'email_verified_at' => now(),
            ]
        );

        // ---------------------------------------------------------
        // 5. DUMMY JOB VACANCIES (DATA STATISTIK)
        // ---------------------------------------------------------
        
        // Bersihkan data lama agar statistik akurat saat seed ulang
        // Disable foreign key check agar truncate aman
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        JobVacancy::truncate();
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // DATA 1: Active, Technology, Full-time, 3 Applicants
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
            'salary' => 15000000,
            'requirements' => json_encode(['React JS', 'Tailwind CSS', 'Redux']),
            'deadline' => now()->addDays(30),
        ]);

        // DATA 2: Active, Data Science, Internship, 3 Applicants
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
            'salary' => 4000000,
            'requirements' => json_encode(['Python', 'SQL', 'Tableau']),
            'deadline' => now()->addDays(15),
        ]);

        // DATA 3: Closed, Design, Contract, 0 Applicants
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
            'salary' => 8000000,
            'requirements' => json_encode(['Figma', 'Adobe XD', 'Prototyping']),
            'deadline' => now()->subDays(5), // Deadline sudah lewat
        ]);

        // DATA 4: Draft, Technology, Full-time, 0 Applicants
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
            'salary' => 12000000,
            'requirements' => json_encode(['Laravel', 'MySQL', 'Redis']),
            'deadline' => null, // Draft biasanya belum ada deadline
        ]);
    }
}