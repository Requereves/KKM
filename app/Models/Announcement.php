<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal (Mass Assignment).
     */
    protected $fillable = [
        'title', 
        'content', 
        'category', 
        'status', 
        'target_audience', 
        'image', 
        'publish_date', 
        'author'
    ];

    /**
     * Konversi tipe data otomatis.
     * publish_date akan otomatis jadi object Carbon (Date) agar mudah diformat.
     */
    protected $casts = [
        'publish_date' => 'date',
    ];
}