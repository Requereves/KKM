<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Menampilkan daftar admin.
     */
    public function index()
    {
        // Ambil user yang role-nya admin, urutkan dari yang terbaru
        $admins = User::where('role', 'admin')->latest()->get();

        return Inertia::render('Admin/Users/Index', [
            'admins' => $admins
        ]);
    }

    /**
     * Menyimpan admin baru.
     */
    public function store(Request $request)
    {
        // 1. VALIDASI KETAT
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // Cek duplikat email
            'password' => ['required', 'confirmed', Rules\Password::defaults()], // Password min 8 char, harus confirm
        ], [
            'name.required' => 'Nama wajib diisi.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email ini sudah digunakan oleh user lain.',
            'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'password.min' => 'Password minimal 8 karakter.',
        ]);

        // 2. CREATE USER
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin', // Paksa role jadi admin
            'email_verified_at' => now(), // Auto verify karena dibuat oleh super admin
        ]);

        return redirect()->back()->with('success', 'Admin baru berhasil ditambahkan!');
    }

    /**
     * Hapus admin.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Mencegah menghapus diri sendiri (Opsional, validasi frontend jg ada)
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'Anda tidak bisa menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->back()->with('success', 'Admin berhasil dihapus.');
    }
}