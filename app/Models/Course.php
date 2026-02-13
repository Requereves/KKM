<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'title',
        'category',
        'instructor',
        'description',
        'thumbnail',
        'status', // 'active', 'upcoming', 'completed'
    ];

    /**
     * Relasi ke Module 
     */
    public function modules()
    {
        return $this->hasMany(Module::class);
    }

    /**
     * Relasi tidak langsung ke Lessons 
     */
    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Module::class);
    }

     protected function getThumbnailAttribute($value)
    {
         if (!$value) return 'https://placehold.co/600x400/png';
    // Jika sudah ada http (berarti dari accessor), jangan ditambah lagi
        if (str_contains($value, 'http')) return $value; 
        return asset('storage/' . $value);
    }

    // Accessor untuk Deskripsi (Otomatis ngasih placeholder jika kosong)
    protected function getDescriptionAttribute($value)
    {
        return $value ?? 'Comprehensive course description placeholder...';
    }
}