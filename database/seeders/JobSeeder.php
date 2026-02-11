<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobVacancy;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // <--- INI YANG TADI KURANG

class JobSeeder extends Seeder
{
    public function run()
    {
        // 1. Bersihkan tabel agar tidak duplikat saat di-run ulang
        Schema::disableForeignKeyConstraints();
        DB::table('job_vacancies')->truncate();
        Schema::enableForeignKeyConstraints();

        // 2. Data yang disesuaikan 100% dengan UI Temanmu (Gambar Kanan)
        $data = [
            [
                'title' => 'Frontend Developer Intern',
                'company' => 'TechCorp Indonesia',
                'location' => 'Jakarta Selatan (Hybrid)',
                'type' => 'Internship',
                'status' => 'active',
                'salary' => 2500000,
                'deadline' => '2026-02-28',
                'description' => 'Membangun antarmuka pengguna yang responsif menggunakan React.js.',
            ],
            [
                'title' => 'Junior Data Analyst',
                'company' => 'DataWiz Solutions',
                'location' => 'Bandung (Remote)',
                'type' => 'Full-time',
                'status' => 'active',
                'salary' => 6000000,
                'deadline' => '2026-03-01',
                'description' => 'Menganalisis data pasar untuk memberikan insight bisnis.',
            ],
            [
                'title' => 'UI/UX Designer',
                'company' => 'CreativeMinds Agency',
                'location' => 'Yogyakarta',
                'type' => 'Contract',
                'status' => 'closed',
                'salary' => 0, 
                'deadline' => '2026-01-10',
                'description' => 'Merancang alur pengguna dan desain visual yang menarik.',
            ],
            [
                'title' => 'Backend Developer (Golang)',
                'company' => 'Fintech Secure',
                'location' => 'Jakarta Pusat',
                'type' => 'Full-time',
                'status' => 'draft',
                'salary' => 10000000,
                'deadline' => '2026-03-15',
                'description' => 'Mengembangkan API yang aman dan scalable menggunakan Golang.',
            ],
        ];

        foreach ($data as $item) {
            JobVacancy::create($item);
        }
    }
}