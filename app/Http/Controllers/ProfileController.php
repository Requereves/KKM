<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash; // ✅ Wajib ada untuk hashing password
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * =========================================================================
     * SHARED PROFILE LOGIC (ADMIN & MAHASISWA)
     * =========================================================================
     */

    /**
     * Menampilkan Halaman Edit Profile
     * Bisa digunakan untuk route '/profile' (Mahasiswa) dan '/admin/profile' (Admin)
     */
    public function edit(Request $request): Response
    {
        // Tentukan view berdasarkan role user agar lebih fleksibel
        $view = $request->user()->role === 'admin' 
            ? 'Admin/Profile/Index'  // View khusus Admin
            : 'Profile/Edit';        // View default/mahasiswa

        return Inertia::render($view, [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update Informasi Profile (Nama, Email, Username, Password)
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();

        // 1. Update Info Dasar (Tanpa Password dulu)
        // Kita hanya mengambil field yang aman untuk di-fill langsung
        // 'interest' ditambahkan jika Anda memakai fitur minat belajar
        $user->fill($request->safe()->only(['name', 'username', 'email', 'interest']));

        // Reset verifikasi email jika email berubah
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // 2. Logic Update Password (Hanya jika diisi)
        // Jika form kosong, kita abaikan agar tidak error "password cannot be null"
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return Redirect::back()->with('success', 'Profil berhasil diperbarui.');
    }

    /**
     * Update Foto Profil (Khusus Admin & User)
     * Endpoint: POST /admin/profile/photo
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'], // Max 2MB
        ], [
            'photo.max' => 'Ukuran foto maksimal 2MB.',
            'photo.image' => 'File harus berupa gambar.',
        ]);

        $user = $request->user();

        // 1. Hapus foto lama jika ada (untuk menghemat storage)
        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        // 2. Simpan foto baru ke folder 'avatars' di storage public
        $path = $request->file('photo')->store('avatars', 'public');

        // 3. Update database
        $user->update([
            'avatar' => $path
        ]);

        return Redirect::back()->with('success', 'Foto profil berhasil diperbarui!');
    }

    /**
     * Hapus Akun (Shared Logic)
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}