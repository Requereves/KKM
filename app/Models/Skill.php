<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    // Menandakan tabel ini tidak memiliki kolom created_at/updated_at
    public $timestamps = false;

    protected $fillable = [
        'skill_id',
        'skill_name',
    ];

    /**
     * Get the students that have this skill.
     * Relasi Many-to-Many ke Mahasiswa
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_skills');
    }

    /**
     * ✅ PERBAIKAN: Relasi ke JobVacancy
     * Relasi Many-to-Many ke Lowongan Pekerjaan
     * Fungsi ini WAJIB ADA agar 'withCount' di DashboardController bekerja.
     */
    public function jobs()
    {
        // Pastikan parameter kedua ('job_skills') sesuai dengan nama tabel pivot di database kamu.
        // Tabel ini menghubungkan tabel 'skills' dan tabel 'job_vacancies' (atau 'jobs').
        return $this->belongsToMany(JobVacancy::class, 'job_skills');
    }
}