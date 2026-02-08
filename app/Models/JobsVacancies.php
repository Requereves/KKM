<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class JobsVacancies extends Model
{
     use HasFactory;

    protected $table = 'jobs_vacancies';

    protected $fillable = [
        'title',
        'company',
        'logo_url',
        'location',
        'salary',
        'type',
        'status',
        'description',
        'requirements',
        'expires_at',
    ];

    protected $casts = [
        // Sangat penting: Mengubah JSON di DB menjadi Array otomatis di Laravel
        'requirements' => 'array', 
        'expires_at' => 'datetime',
    ];

    /**
     * Relasi ke student
     */
    public function applicants()
    {
        
        return $this->belongsToMany(Student::class, 
        'job_applications',
        'job_id',
        'student_id'
        )->withTimestamps();
    }

    // logo
    public function getLogoAttribute($value)
    {
        return $value ? asset('storage/' . $value) : 'https://ui-avatars.com/api/?name=' . urlencode($this->company);
    }
}
