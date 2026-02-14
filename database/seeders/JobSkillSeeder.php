<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\JobVacancy;
use App\Models\Skill;

class JobSkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Ambil semua data Job dan Skill
        // Pastikan tabel job_vacancies dan skills sudah ada isinya
        $jobs = JobVacancy::all();
        $skills = Skill::all();

        // Cek jika data kosong
        if ($jobs->count() === 0 || $skills->count() === 0) {
            $this->command->info('⚠️  Tabel JobVacancy atau Skills kosong. Harap isi data master tersebut terlebih dahulu.');
            return;
        }

        $this->command->info('Memulai seeding job_skills...');

        // 2. Loop setiap pekerjaan untuk diberikan skill acak
        foreach ($jobs as $job) {
            // Ambil 1 sampai 4 skill secara acak dari database
            $randomSkills = $skills->random(rand(1, 4));

            foreach ($randomSkills as $skill) {
                // Cek agar tidak ada duplikasi data (skill yang sama di job yang sama)
                $exists = DB::table('job_skills')
                    ->where('job_vacancy_id', $job->id)
                    ->where('skill_id', $skill->id)
                    ->exists();

                if (!$exists) {
                    DB::table('job_skills')->insert([
                        'job_vacancy_id' => $job->id,
                        'skill_id'       => $skill->id,
                        // Hapus baris ini jika tabel pivot tidak punya created_at/updated_at
                        // 'created_at'  => now(), 
                        // 'updated_at'  => now(),
                    ]);
                }
            }
        }

        $this->command->info('✅ Berhasil mengisi tabel job_skills dengan data dummy!');
    }
}