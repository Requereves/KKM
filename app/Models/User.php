<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage; // ✅ Tambahkan ini untuk cek file

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'username', // ✅ Tambahkan ini (karena ada input username di ProfilePage)
        'email',
        'password',
        'role',     // Role user (admin/mahasiswa)
        'avatar',   // Path Foto profil di database
        'interest', // 👈 PENTING: Tambahkan ini agar Minat Belajar bisa disimpan
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            // 'last_seen_at' => 'datetime',
        ];
    }

    // --- LOGIC BARU UNTUK FOTO PROFILE ---

    /**
     * Appends custom attributes.
     * Properti 'avatar_url' akan otomatis ada setiap kali data User diambil.
     */
    protected $appends = ['avatar_url'];

    /**
     * Accessor untuk Avatar URL
     * Cara panggil: $user->avatar_url
     * * Fungsinya:
     * 1. Cek apakah ada file foto di storage.
     * 2. Jika ada, kembalikan URL lengkap + timestamp (?t=...) untuk memaksa browser refresh gambar.
     * 3. Jika tidak ada, kembalikan gambar default (Inisial Nama).
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar && Storage::disk('public')->exists($this->avatar)) {
            // Timestamp (?t=...) adalah kunci agar Header langsung berubah tanpa hard refresh
            return asset('storage/' . $this->avatar) . '?t=' . time();
        }

        // Fallback ke UI Avatars jika tidak ada foto
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&color=7F9CF5&background=EBF4FF';
    }
}