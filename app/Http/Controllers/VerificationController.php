<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class VerificationController extends Controller
{
    /**
     * Menampilkan daftar portfolio dengan filter status.
     */
    public function index(Request $request)
    {
        // 1. Ambil parameter filter (Default 'pending' agar Admin fokus ke tugas)
        $status = $request->query('status', 'pending');
        $search = $request->query('search');

        // 2. Query Dasar
        $query = Portfolio::with('student')->latest();

        // 3. Filter Status
        // Jika status 'all', kita lewati filter ini
        if ($status !== 'all' && in_array($status, ['pending', 'approved', 'rejected'])) {
            $query->where('status', $status);
        }

        // 4. Filter Search (Nama Mahasiswa, NIM, atau Judul Portfolio)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('student', function($sq) use ($search) {
                      $sq->where('full_name', 'like', "%{$search}%")
                         ->orWhere('nim', 'like', "%{$search}%");
                  });
            });
        }

        // 5. Eksekusi Pagination (Gunakan nama variabel $portfolios agar sesuai dengan Blade index)
        $portfolios = $query->paginate(10)->withQueryString();

        // 6. Hitung Badge Count (Opsional, berguna untuk UX Tab di masa depan)
        $counts = [
            'all' => Portfolio::count(),
            'pending' => Portfolio::where('status', 'pending')->count(),
            'approved' => Portfolio::where('status', 'approved')->count(),
            'rejected' => Portfolio::where('status', 'rejected')->count(),
        ];

        return view('admin.verification.index', compact('portfolios', 'counts', 'status', 'search'));
    }

    /**
     * Menampilkan detail portfolio untuk diverifikasi.
     */
    public function show($id)
    {
        $portfolio = Portfolio::with('student')->findOrFail($id);
        
        // Generate URL file agar bisa di-preview di iframe/tag object
        // Pastikan Anda sudah menjalankan: php artisan storage:link
        $fileUrl = Storage::url($portfolio->file_path);

        return view('admin.verification.show', compact('portfolio', 'fileUrl'));
    }

    /**
     * Memproses keputusan Approve atau Reject.
     */
    public function update(Request $request, $id)
    {
        $portfolio = Portfolio::findOrFail($id);

        // 1. Validasi Input
        $request->validate([
            'decision' => ['required', Rule::in(['approve', 'reject'])],
            'feedback' => [
                'nullable', 
                'string', 
                'max:1000', 
                // Feedback wajib diisi HANYA JIKA keputusan adalah reject
                Rule::requiredIf($request->decision === 'reject')
            ],
        ], [
            'feedback.required_if' => 'Alasan penolakan wajib diisi jika berkas ditolak.',
        ]);

        // 2. Tentukan Status Baru
        $status = $request->decision === 'approve' ? 'approved' : 'rejected';

        // 3. Update Database
        $portfolio->update([
            'status' => $status,
            'admin_feedback' => $request->feedback,
            'verified_at' => now(),
        ]);

        // 4. Siapkan Pesan Flash
        $message = $status === 'approved' 
            ? "Berkas milik <strong>{$portfolio->student->full_name}</strong> berhasil disetujui." 
            : "Berkas milik <strong>{$portfolio->student->full_name}</strong> telah ditolak.";

        // 5. Redirect
        // Kita kembalikan ke tab 'pending' agar Admin bisa langsung lanjut verifikasi berkas berikutnya
        return redirect()
            ->route('verification.index', ['status' => 'pending'])
            ->with('success', $message);
    }
}