<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\View\View; // 👈 PENTING: Import untuk Blade View Admin

class ProfileController extends Controller
{
    /**
     * =========================================================================
     * BAGIAN 1: UNTUK MAHASISWA (REACT / INERTIA)
     * URL: /profile
     * =========================================================================
     */

    /**
     * Display the user's profile form (React).
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information (React).
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Update the user's avatar (React - Fitur Khusus Mahasiswa).
     */
    public function updateAvatar(Request $request): RedirectResponse
    {
        // 1. Validasi File Gambar
        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:1024'], // Maksimal 1MB
        ]);

        $user = $request->user();

        // 2. Cek apakah ada file yang diupload
        if ($request->hasFile('avatar')) {
            
            // Hapus foto lama jika ada
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Simpan foto baru
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $path;
            $user->save();
        }

        return Redirect::route('profile.edit')->with('status', 'avatar-updated');
    }

    /**
     * Delete the user's account (React).
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }


    /**
     * =========================================================================
     * BAGIAN 2: UNTUK ADMIN (BLADE VIEW)
     * URL: /admin/profile
     * =========================================================================
     */

    /**
     * Menampilkan Form Profile Admin (Blade View).
     */
    public function editAdmin(Request $request): View
    {
        // Mengarahkan ke file resources/views/admin/profile/edit.blade.php
        return view('admin.profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update Profile Admin.
     */
    public function updateAdmin(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        // Redirect kembali ke route admin, bukan profile.edit biasa
        return Redirect::route('admin.profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Hapus Akun Admin.
     */
    public function destroyAdmin(Request $request): RedirectResponse
    {
        $request->validateWithBag('userDeletion', [
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}