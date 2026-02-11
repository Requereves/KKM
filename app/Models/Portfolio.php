<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Portfolio extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'student_id',
        'title',
        'description',
        'file_path',
        'category',
        'status',
        'admin_feedback',
        'verified_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'verified_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The accessors to append to the model's array form.
     * Penting: Agar 'category_name' dan 'status_color' otomatis ada di JSON (Inertia Props)
     */
    protected $appends = ['category_name', 'status_color'];

    /**
     * Get the student that owns the portfolio.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Get category display name.
     * Accessor: $portfolio->category_name
     */
    public function getCategoryNameAttribute()
    {
        return match($this->category) {
            'sertifikat' => 'Certificate',
            'proyek_kuliah' => 'College Project',
            'portofolio_bebas' => 'Free Portfolio',
            'lomba' => 'Competition',
            'magang' => 'Internship',
            // Fallback untuk membersihkan format enum (contoh: 'other_doc' jadi 'Other Doc')
            default => ucwords(str_replace('_', ' ', $this->category)),
        };
    }

    /**
     * Get status badge color.
     * Accessor: $portfolio->status_color
     * Used mainly for Tailwind CSS classes (e.g. bg-green-500)
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'approved' => 'green',  // Dashboard Mahasiswa pakai 'green'
            'pending' => 'yellow',  // Dashboard Mahasiswa pakai 'yellow'
            'rejected' => 'red',    // Dashboard Mahasiswa pakai 'red'
            default => 'gray',
        };
    }

    /**
     * Scope: Only certificates.
     */
    public function scopeCertificates($query)
    {
        return $query->where('category', 'sertifikat');
    }

    /**
     * Scope: Only approved.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope: Only pending.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}