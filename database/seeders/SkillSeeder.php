<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run(): void
    {
        $skills = [
            'PHP', 'Laravel', 'JavaScript', 'React.js', 'Vue.js',
            'Python', 'Django', 'Java', 'Spring Boot', 'SQL',
            'Docker', 'AWS', 'Figma', 'UI/UX Design', 'Flutter', 
            'DevOps', 'Machine Learning', 'Data Analysis'
        ];

        foreach ($skills as $skillName) {
            // Gunakan firstOrCreate agar tidak duplikat jika dijalankan berulang
            Skill::firstOrCreate([
                'skill_name' => $skillName
            ]);
        }
    }
}