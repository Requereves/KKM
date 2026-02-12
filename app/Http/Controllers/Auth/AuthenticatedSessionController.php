<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;
use Inertia\Inertia; // 👈 Penting untuk logout redirect

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

        // --- UPDATE LOGIC REDIRECT BERDASARKAN ROLE ---
        $role = $request->user()->role;

        // 1. Jika Admin -> Ke Dashboard Admin
        if ($role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }
        
        // 2. Jika Psikolog -> Langsung ke Halaman Konsultasi
        // (Karena Psikolog dilarang masuk Dashboard Utama)
        elseif ($role === 'psychologist') {
            return redirect()->intended(route('admin.consultations.index', absolute: false));
        }

        // 3. Default (Mahasiswa/Student) -> Ke Home User
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

        // Gunakan Inertia::location() agar browser melakukan Full Reload ke halaman awal.
        // Ini mengatasi masalah tampilan jika logout dari halaman React/Inertia.
        return Inertia::location('/');
    }
}