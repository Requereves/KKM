<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class PsychologistController extends Controller
{
    public function index()
    {
        // Ambil riwayat konsultasi user yang sedang login
        $history = Consultation::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // 🔥 UPDATE DI SINI:
        // Mengarahkan ke file 'Index.jsx' di dalam folder 'Psychologist'
        // Struktur file: resources/js/Pages/User/Psychologist/Index.jsx
        return Inertia::render('User/Psychologist/Index', [
            'consultations' => $history
        ]);
    }

    public function store(Request $request)
    {
        // Validasi Backend yang Ketat
        $validated = $request->validate([
            'subject' => 'required|string|max:100',
            'urgency' => 'required|in:low,medium,high',
            'preferred_date' => 'required|date|after:today', // Harus tanggal masa depan
            'description' => 'required|string|min:10',
        ], [
            'preferred_date.after' => 'Tanggal konsultasi harus setelah hari ini.',
            'description.min' => 'Jelaskan keluhanmu minimal dalam 10 karakter.'
        ]);

        $validated['user_id'] = Auth::id();

        Consultation::create($validated);

        return redirect()->back()->with('success', 'Permintaan konsultasi berhasil dikirim. Tunggu konfirmasi admin ya!');
    }
}