<?php

namespace App\Http\Controllers;

use App\Models\JobsVacancies;
use Illuminate\Http\Request;
use Carbon\Carbon;

class JobController extends Controller
{
    /**
     * Tampilan utama daftar lowongan (untuk Admin)
     */
    public function index()
    {
        // 1. Ambil data dengan hitung pelamar & urutkan yang terbaru
        $jobsRaw = JobsVacancies::withCount('applicants')
            ->latest()
            ->get();

        // 2. Map data agar formatnya siap dipakai Alpine.js di Blade
        $jobs = $jobsRaw->map(function($job) {
            return [
                'id' => $job->id,
                'title' => $job->title,
                'company' => $job->company,
                'logo' => $job->logo_url ?? 'https://ui-avatars.com/api/?name=' . urlencode($job->company) . '&background=random',
                'location' => $job->location,
                'salary' => $job->salary,
                'type' => $job->type,
                'status' => $job->status,
                'description' => $job->description,
                'requirements' => $job->requirements ?? [], // Pastikan array
                'applicantsCount' => $job->applicants_count,
                'postedAt' => $job->created_at->format('d M Y'),
                'expiresAt' => $job->expires_at ? $job->expires_at->format('d M Y') : '-',
            ];
        });

        return view('admin.jobs.index', compact('jobs'));
    }

    /**
     * Halaman form tambah job
     */
    public function create()
    {
        return view('admin.jobs.update');
    }

    /**
     * Simpan job baru ke database
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string',
            'salary' => 'nullable|string',
            'type' => 'required|in:Full-time,Internship,Part-time,Contract',
            'status' => 'required|in:draft,active,closed',
            'description' => 'required|string',
            'requirements' => 'required|string', // Masih berupa teks baris-baris
            'expires_at' => 'nullable|date',
        ]);

        // LOGIKA: Ubah string Requirements (textarea) menjadi Array
        $validated['requirements'] = $this->processRequirements($request->requirements);

        JobsVacancies::create($validated);

        return redirect()->route('jobs.index')->with('success', 'Lowongan berhasil dipublikasikan!');
    }

    /**
     * Halaman form edit job
     */
    public function edit(JobsVacancies $job)
    {
        return view('admin.jobs.update', compact('job'));
    }

    /**
     * Update data job
     */
    public function update(Request $request, JobsVacancies $job)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string',
            'salary' => 'nullable|string',
            'type' => 'required|in:Full-time,Internship,Part-time,Contract',
            'status' => 'required|in:draft,active,closed',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'expires_at' => 'nullable|date',
        ]);

        $validated['requirements'] = $this->processRequirements($request->requirements);

        $job->update($validated);

        return redirect()->route('jobs.index')->with('success', 'Lowongan berhasil diperbarui!');
    }

    /**
     * Hapus job
     */
    public function destroy(JobsVacancies $job)
    {
        $job->delete();
        return redirect()->route('jobs.index')->with('success', 'Lowongan berhasil dihapus!');
    }

    /**
     * Helper untuk memproses string textarea menjadi array
     */
    private function processRequirements($string)
    {
        // Pisahkan per baris, bersihkan spasi, hapus baris kosong
        return array_filter(array_map('trim', explode("\n", str_replace("\r", "", $string))));
    }
}