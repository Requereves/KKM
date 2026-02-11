<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Skill;
use App\Models\User; // Pastikan Model User di-import
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;

class StudentSeeder extends Seeder
{
    public function run()
    {
        // 1. Buat Skills dulu jika belum ada
        $skills = [
            'PHP', 'Laravel', 'React', 'AWS', 'Python', 'Networking', 'Cisco', 
            'Figma', 'Adobe Illustrator', 'Java', 'Spring Boot', 'AutoCAD', 'SolidWorks'
        ];

        foreach ($skills as $skillName) {
            Skill::firstOrCreate(['skill_name' => $skillName]);
        }

        // 2. Data Mahasiswa Dummy
        $studentsData = [
            [
                'full_name' => 'Dhitan Hakim',
                'nim' => 'NIM001',
                'email' => 'dhitan@example.com',
                'phone' => '+62 812-3456-7890',
                'major' => 'Teknik Informatika',
                'year_of_entry' => 2022,
                'last_seen_at' => Carbon::now(),
                'skills' => ['PHP', 'Laravel', 'React', 'Java']
            ],
            [
                'full_name' => 'Budi Santoso',
                'nim' => '42118001',
                'email' => 'budi@example.com',
                'phone' => '+62 813-9988-7766',
                'major' => 'Sistem Informasi',
                'year_of_entry' => 2021,
                'last_seen_at' => Carbon::now()->subMinutes(2),
                'skills' => ['AWS', 'Python', 'React']
            ],
            [
                'full_name' => 'Siti Aminah',
                'nim' => '42119005',
                'email' => 'siti@example.com',
                'phone' => '+62 856-1122-3344',
                'major' => 'Teknik Komputer',
                'year_of_entry' => 2023,
                'last_seen_at' => Carbon::now()->subMinutes(1),
                'skills' => ['Networking', 'Cisco', 'Linux', 'Python']
            ],
            [
                'full_name' => 'Rizky Pratama',
                'nim' => '42118008',
                'email' => 'rizky@example.com',
                'phone' => '+62 811-2233-4455',
                'major' => 'Desain Komunikasi Visual',
                'year_of_entry' => 2022,
                'last_seen_at' => Carbon::now()->subDays(1),
                'skills' => ['Figma', 'Adobe Illustrator', 'Photoshop']
            ],
            [
                'full_name' => 'Dewi Lestari',
                'nim' => '42119012',
                'email' => 'dewi@example.com',
                'phone' => '+62 819-8765-4321',
                'major' => 'Teknik Informatika',
                'year_of_entry' => 2023,
                'last_seen_at' => Carbon::now(),
                'skills' => ['Java', 'Spring Boot', 'SQL', 'Docker']
            ],
        ];

        foreach ($studentsData as $data) {
            // A. Pisahkan Skills dari array data
            $studentSkills = $data['skills'];
            unset($data['skills']);

            // B. BUAT USER BARU (Ini langkah fix-nya)
            // Kita buat akun user agar mendapatkan user_id
            $user = User::firstOrCreate(
                ['email' => $data['email']], // Cek email agar tidak duplikat
                [
                    'name' => $data['full_name'],
                    'password' => Hash::make('password123'), // Default password
                    // Jika ada kolom role, tambahkan di sini: 'role' => 'student'
                ]
            );

            // C. Masukkan user_id ke data student
            $data['user_id'] = $user->id;

            // D. Create atau Update Student
            $student = Student::updateOrCreate(
                ['nim' => $data['nim']], 
                $data
            );

            // E. Attach Skills
            $skillIds = Skill::whereIn('skill_name', $studentSkills)->pluck('id');
            $student->skills()->sync($skillIds);
        }
    }
}