<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;
use Illuminate\Support\Facades\DB;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Bersihkan tabel courses sebelum isi ulang (Agar tidak duplikat saat seed ulang)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Course::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // 2. Definisi Data Course
        // Kita gunakan URL Placeholder agar teman tim kamu tidak perlu copy file manual.
        // Gambar akan otomatis digenerate oleh layanan placehold.co
        
        $courses = [
            // --- Kategori: Web Development ---
            [
                'title' => 'Mastering Laravel 11: From Zero to Hero',
                'instructor' => 'Ghufroon Academy',
                'category' => 'Web Development',
                'description' => 'Pelajari Laravel 11 dari dasar routing, controller, hingga advanced eloquent relationship dan deployment.',
                'thumbnail' => 'https://placehold.co/600x400/FF2D20/FFFFFF/png?text=Laravel+11+Mastery', 
                'status' => 'active',
                'created_at' => now(),
            ],
            [
                'title' => 'React JS & Tailwind CSS Portfolio Build',
                'instructor' => 'Code with Me',
                'category' => 'Web Development',
                'description' => 'Bangun portofolio profesional menggunakan React JS modern dan styling cepat dengan Tailwind CSS.',
                'thumbnail' => 'https://placehold.co/600x400/61DAFB/000000/png?text=React+JS+Portfolio',
                'status' => 'active',
                'created_at' => now(),
            ],
            [
                'title' => 'Fullstack Web Developer Bootcamp 2026',
                'instructor' => 'Udemy Pro',
                'category' => 'Web Development',
                'description' => 'Panduan lengkap menjadi Fullstack Developer. HTML, CSS, JS, PHP, hingga Framework modern.',
                'thumbnail' => 'https://placehold.co/600x400/4F46E5/FFFFFF/png?text=Fullstack+Bootcamp',
                'status' => 'active',
                'created_at' => now(),
            ],

            // --- Kategori: UI/UX ---
            [
                'title' => 'Figma UI/UX Design Essentials',
                'instructor' => 'Design Masters',
                'category' => 'UI/UX',
                'description' => 'Kuasai tools Figma untuk membuat desain antarmuka aplikasi mobile dan website yang menawan.',
                'thumbnail' => 'https://placehold.co/600x400/F24E1E/FFFFFF/png?text=Figma+Essentials',
                'status' => 'active',
                'created_at' => now(),
            ],
            [
                'title' => 'Adobe XD for Beginners',
                'instructor' => 'Creative Cloud',
                'category' => 'UI/UX',
                'description' => 'Tutorial dasar penggunaan Adobe XD untuk prototyping cepat.',
                'thumbnail' => 'https://placehold.co/600x400/FF61F6/FFFFFF/png?text=Adobe+XD',
                'status' => 'active',
                'created_at' => now(),
            ],

            // --- Kategori: Data Science ---
            [
                'title' => 'Python for Data Science and Machine Learning',
                'instructor' => 'Data Camp',
                'category' => 'Data Science',
                'description' => 'Analisis data menggunakan Python, Pandas, NumPy, dan visualisasi data.',
                'thumbnail' => 'https://placehold.co/600x400/3776AB/FFFFFF/png?text=Python+Data+Science',
                'status' => 'active',
                'created_at' => now(),
            ],
        ];

        // 3. Loop dan Insert Data
        foreach ($courses as $course) {
            Course::create($course);
        }
    }
}