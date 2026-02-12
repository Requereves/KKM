<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage; // ✅ Wajib import untuk cek file fisik

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
        'username', // ✅ Wajib ada agar update profile jalan
        'email',
        'password',
        'role',     // admin, student, psychologist
        'avatar',   // Path file (contoh: avatars/foto.jpg)
        'interest', // ✅ Wajib ada agar update profile jalan
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
        ];
    }

    // =========================================================================
    // ACCESSORS & MUTATORS (LOGIC FOTO PROFIL)
    // =========================================================================

    /**
     * Menambahkan attribute virtual 'avatar_url' ke dalam JSON object User.
     * Ini membuat kita bisa memanggil user.avatar_url di React/Inertia.
     */
    protected $appends = ['avatar_url'];

    /**
     * Accessor untuk Avatar URL
     * Cara panggil di Laravel: $user->avatar_url
     * Cara panggil di React: user.avatar_url
     */
    public function getAvatarUrlAttribute()
    {
        // 1. Cek apakah kolom avatar di database terisi
        if ($this->avatar) {
            // 2. Cek apakah file fisiknya BENAR-BENAR ADA di folder storage/app/public
            // Ini mencegah error 404 jika file terhapus tapi data di DB masih ada
            if (Storage::disk('public')->exists($this->avatar)) {
                
                // 3. Return URL lengkap + Timestamp (?t=...)
                // Timestamp berguna agar browser tidak menyimpan cache gambar lama
                return asset('storage/' . $this->avatar) . '?t=' . time();
            }
        }

        // 4. Fallback: Jika tidak ada foto atau file hilang, gunakan UI Avatars (Inisial Nama)
        $name = $this->name ?? 'User';
        return 'https://ui-avatars.com/api/?name=' . urlencode($name) . '&color=7F9CF5&background=EBF4FF';
    }
}