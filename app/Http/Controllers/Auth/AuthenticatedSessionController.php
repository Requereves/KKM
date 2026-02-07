<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Inertia\Inertia; // 👈 PENTING: Tambahkan Import Ini

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): View
    {
        return view('auth.login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // --- UPDATE LOGIC REDIRECT ---
        // Cek apakah user yang login memiliki role 'admin'
        if ($request->user()->role === 'admin') {
            // Jika Admin, arahkan ke dashboard admin
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        // Jika Mahasiswa (default), arahkan ke '/home' (route name: 'home')
        return redirect()->intended(route('home', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        // 👇 PERUBAHAN UTAMA DI SINI:
        // Gunakan Inertia::location() agar browser melakukan Full Reload ke halaman awal.
        // Ini mengatasi masalah tampilan "modal kecil" saat logout dari halaman React.
        return Inertia::location('/');
    }
}