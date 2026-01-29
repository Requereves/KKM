<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\View\View;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): View
    {
        return view('profile.edit', [
            'user' => $request->user(),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        // 1. Ini kodingan aslimu (JANGAN DIHAPUS)
        $request->user()->fill($request->validated());

        // 2. Ini kodingan aslimu buat reset verifikasi email (JANGAN DIHAPUS)
        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        // --- 3. INI BAGIAN BARU YANG KITA SELIPKAN ---
        // Cek dulu, user upload foto gak?
        if ($request->hasFile('avatar')) {
            
            // Kalau user udah punya foto lama, hapus dulu biar gak nyampah di server
            if ($request->user()->avatar) {
                Storage::disk('public')->delete($request->user()->avatar);
            }

            // Simpan foto baru ke folder 'avatars' (public storage)
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Masukkan alamat foto baru ke database
            $request->user()->avatar = $path;
        }
        // ----------------------------------------------

        // 4. Simpan semua perubahan (Nama, Email, & Foto tadi)
        $request->user()->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }
    /**
     * Delete the user's account.
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
}
