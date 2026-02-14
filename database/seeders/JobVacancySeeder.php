<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobVacancy;
use Illuminate\Support\Str;

class JobVacancySeeder extends Seeder
{
    public function run(): void
    {
        $jobs = [
            [
                'title' => 'Senior Backend Developer',
                'company' => 'Tokopedia',
                'description' => 'Mencari developer Laravel berpengalaman.',
                'status' => 'active',
                'location' => 'Jakarta Selatan (Hybrid)', // ✅ Tambahkan ini
            ],
            [
                'title' => 'Frontend Engineer',
                'company' => 'Traveloka',
                'description' => 'Ahli dalam React.js dan Tailwind CSS.',
                'status' => 'active',
                'location' => 'Tangerang (BSD)', // ✅ Tambahkan ini
            ],
            [
                'title' => 'Data Scientist',
                'company' => 'Gojek',
                'description' => 'Menguasai Python dan Machine Learning.',
                'status' => 'active',
                'location' => 'Jakarta Selatan', // ✅ Tambahkan ini
            ],
            [
                'title' => 'UI/UX Designer',
                'company' => 'Bukalapak',
                'description' => 'Mahir menggunakan Figma dan Adobe XD.',
                'status' => 'active',
                'location' => 'Remote', // ✅ Tambahkan ini
            ],
            [
                'title' => 'DevOps Engineer',
                'company' => 'Shopee',
                'description' => 'Berpengalaman dengan AWS dan Docker.',
                'status' => 'active',
                'location' => 'Jakarta Pusat', // ✅ Tambahkan ini
            ],
        ];

        foreach ($jobs as $job) {
            // Generate slug otomatis
            $job['slug'] = Str::slug($job['title']);
            
            JobVacancy::create($job);
        }
    }
}