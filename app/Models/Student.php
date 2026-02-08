<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'nim',
        'full_name',
        'email',
        'phone',
        'major',
        'year_of_entry',
    ];

    protected $casts = [
        'year_of_entry' => 'integer',
        'last_seen_at' => 'datetime',
    ];

    /**
     * Get the user that owns the student profile.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the portfolios for the student.
     */
    public function portfolios()
    {
        return $this->hasMany(Portfolio::class);
    }

    /**
     * Get the skills for the student.
     */
    public function skills()
    {
        return $this->belongsToMany(Skill::class, 'student_skills');
    }

    /**
     * Get approved portfolios count.
     */
    public function getApprovedPortfoliosCountAttribute()
    {
        return $this->portfolios()->where('status', 'approved')->count();
    }

    /**
     * Get pending portfolios count.
     */
    public function getPendingPortfoliosCountAttribute()
    {
        return $this->portfolios()->where('status', 'pending')->count();
    }

    /**
     * Get progress percentage.
     */
    public function getProgressPercentageAttribute()
    {
        $total = $this->portfolios()->count();
        if ($total === 0) return 0;
        
        $approved = $this->approved_portfolios_count;
        return round(($approved / $total) * 100);
    }
}