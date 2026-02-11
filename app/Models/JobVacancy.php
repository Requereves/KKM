<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobVacancy extends Model
{
    use HasFactory;

    // Nama tabel di database
    protected $table = 'job_vacancies';

    // Daftar kolom yang boleh diisi
    protected $fillable = [
        'title',
        'company',
        'location',
        'type',         
        'status',       
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
    ];

    /**
     * Relasi ke Applications (Pelamar)
     */
    public function applicants()
    {
        // PERBAIKAN DI SINI:
        // Kita tambahkan parameter kedua 'job_id' sebagai foreign key yang benar.
        // Laravel default-nya mencari 'job_vacancy_id', tapi biasanya kita buatnya 'job_id'.
        return $this->hasMany(JobApplication::class, 'job_id');
    }
}