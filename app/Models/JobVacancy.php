<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    use HasFactory;

    // 🔥 FIX UTAMA: Nama tabel harus sama persis dengan Migration (tanpa huruf 's' di job)
    protected $table = 'job_vacancies';

    // Daftar kolom yang boleh diisi (Updated sesuai migration terakhir)
    protected $fillable = [
        'title',
        'slug',             // <--- Wajib ada
        'company',
        'location',
        'type',
        'category',         // <--- Wajib ada
        'status',
        'applicants_count', // <--- Wajib ada
        'salary',
        'description',
        'requirements',
        'deadline',
    ];

    // Konversi tipe data otomatis
    protected $casts = [
        'requirements' => 'array',
        'deadline'     => 'date',
        'salary'       => 'decimal:0',
        'applicants_count' => 'integer',
    ];

    /**
     * Relasi ke Applications (Pelamar)
     */
    public function applicants()
    {
        // Pastikan foreign key di tabel 'job_applications' adalah 'job_id'
        // Jika migration job_applications pakai 'job_vacancy_id', ganti 'job_id' jadi 'job_vacancy_id'
        return $this->hasMany(JobApplication::class, 'job_id');
    }
}