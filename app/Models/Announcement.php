<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Import Model User untuk relasi

class Announcement extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh diisi secara massal (Mass Assignment).
     */
    protected $fillable = [
        'title',
        'slug',          // Kolom Baru
        'summary',       // Kolom Baru
        'content',
        'category',
        'tags',          // Kolom Baru (disimpan sebagai JSON)
        'status',
        'target_audience',
        'image',
        'publish_date',
        'author',        // Nama Author (String)
        'author_id'      // ID User Author (Relation) - Baru
    ];

    /**
     * Konversi tipe data otomatis.
     */
    protected $casts = [
        'publish_date' => 'date',
        'tags' => 'array', // Otomatis convert JSON di DB menjadi Array PHP
    ];

    /**
     * Relasi ke Model User (Author)
     * Ini berguna jika nanti ingin menampilkan profil author, bukan cuma namanya.
     */
    public function authorUser()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}