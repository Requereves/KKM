<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'skill_id',
        'skill_name',
    ];

    /**
     * Get the students that have this skill.
     */
    public function students()
    {
        return $this->belongsToMany(Student::class, 'student_skills');
    }
}