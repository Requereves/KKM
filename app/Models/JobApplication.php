<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'job_applications';

    // Kolom yang bisa diisi
    protected $fillable = [
        'job_id',
        'student_id',
        'status',       // pending, reviewed, interview, accepted, rejected
        'cover_letter',
        'resume_path',
        'applied_at'
    ];

    // Relasi ke Mahasiswa (Pelamar)
    public function student()
    {
        // Pastikan Model Student ada. Jika pakai User, ganti ke User::class
        return $this->belongsTo(Student::class, 'student_id');
    }

    // Relasi ke Lowongan (Job)
    public function job()
    {
        return $this->belongsTo(JobVacancy::class, 'job_id');
    }
}