<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Portfolio;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class VerificationController extends Controller
{
    /**
     * Menampilkan daftar portfolio ke halaman React (Index).
     */
    public function index()
    {
        // Mengambil data portfolio beserta relasi student
        // Menggunakan get() agar React menerima Array lengkap untuk Client-side filtering
        $items = Portfolio::with('student')
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id'            => $item->id,
                    'name'          => $item->student->full_name ?? 'Mahasiswa Umum', 
                    'nim'           => $item->student->nim ?? '-',
                    'documentTitle' => $item->title ?? 'Dokumen Tanpa Judul',
                    // Kita gunakan accessor category_name dari Model jika ada, atau fallback ke category asli
                    'category'      => $item->category_name ?? $item->category, 
                    'status'        => $item->status ?? 'pending',
                    'date'          => $item->created_at ? $item->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                    'filePath'      => $item->file_path ? asset('storage/' . $item->file_path) : '#', 
                    'description'   => $item->description ?? '',
                ];
            });

        // Render Page React
        return Inertia::render('Admin/Verification/Index', [
            'items' => $items,
            // Mengirim parameter query jika ada (opsional, untuk auto-select detail)
            'initialSelectedId' => request()->query('selectedId')
        ]);
    }

    /**
     * Menampilkan Detail Verifikasi (Fix Error 500 saat klik mata)
     */
    public function show($id)
    {
        // 1. Cari data portfolio berdasarkan ID
        $portfolio = Portfolio::with('student')->findOrFail($id);

        // 2. Render halaman detail (Admin/Verification/Show.jsx)
        return Inertia::render('Admin/Verification/Show', [
            'portfolio' => [
                'id'           => $portfolio->id,
                'title'        => $portfolio->title,
                // Menggunakan accessor dari Model (misal: 'sertifikat' jadi 'Certificate')
                'category'     => $portfolio->category_name ?? $portfolio->category, 
                'description'  => $portfolio->description,
                'file_url'     => asset('storage/' . $portfolio->file_path),
                'status'       => $portfolio->status,
                'student_name' => $portfolio->student->full_name ?? 'Unknown',
                'student_nim'  => $portfolio->student->nim ?? '-',
                'created_at'   => $portfolio->created_at->format('d M Y, H:i'),
                'feedback'     => $portfolio->admin_feedback,
            ]
        ]);
    }

    /**
     * Update status verifikasi (Approve/Reject).
     */
    public function update(Request $request, $id)
    {
        $portfolio = Portfolio::findOrFail($id);

        // 1. Validasi Input dari React
        $request->validate([
            'status'   => ['required', Rule::in(['approved', 'rejected'])],
            'feedback' => ['nullable', 'string', 'max:1000'],
        ]);

        // 2. Update Database
        $portfolio->update([
            'status'         => $request->status,
            'admin_feedback' => $request->feedback, 
            'verified_at'    => now(),
        ]);

        // 3. Pesan Notifikasi (Toast)
        $message = $request->status === 'approved' 
            ? "Berkas berhasil disetujui." 
            : "Berkas telah ditolak.";

        // 4. Redirect kembali
        return redirect()->back()->with('success', $message);
    }
}