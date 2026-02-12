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
}