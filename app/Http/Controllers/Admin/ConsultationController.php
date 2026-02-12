<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConsultationController extends Controller
{
    // Menampilkan daftar konsultasi
    public function index()
    {
        $consultations = Consultation::with('user') // Load data user pelapor
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Consultations/Index', [
            'consultations' => $consultations
        ]);
    }

    // Mengupdate Status & Memberi Feedback
    public function update(Request $request, $id)
    {
        $consultation = Consultation::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected,done',
            'admin_feedback' => 'nullable|string'
        ]);

        $consultation->update([
            'status' => $validated['status'],
            'admin_feedback' => $validated['admin_feedback'] ?? $consultation->admin_feedback,
        ]);

        return redirect()->back()->with('success', 'Status konsultasi berhasil diperbarui.');
    }
    
    // Hapus data (Opsional)
    public function destroy($id)
    {
        Consultation::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Data konsultasi dihapus.');
    }
}