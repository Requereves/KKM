<?php

namespace App\Http\Controllers;

use App\Models\JobVacancy;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class JobController extends Controller
{
    /**
     * Menampilkan daftar lowongan dengan style Inisial & Warna.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $filterStatus = $request->input('status', 'all');

        $query = JobVacancy::withCount('applicants')->latest();

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%");
            });
        }

        if ($filterStatus !== 'all') {
            $query->where('status', $filterStatus);
        }

        $jobs = $query->paginate(8)
            ->withQueryString()
            ->through(function($job) {
                
                // 1. LOGIKA INISIAL (Tech Corp -> TC)
                $words = explode(' ', $job->company);
                $initials = '';
                foreach ($words as $w) {
                    $initials .= strtoupper(substr($w, 0, 1));
                }
                $initials = substr($initials, 0, 2);

                // 2. LOGIKA WARNA (Berdasarkan nama perusahaan agar konsisten)
                $colors = [
                    ['bg' => 'bg-indigo-100', 'text' => 'text-indigo-600'],
                    ['bg' => 'bg-emerald-100', 'text' => 'text-emerald-600'],
                    ['bg' => 'bg-amber-100', 'text' => 'text-amber-600'],
                    ['bg' => 'bg-rose-100', 'text' => 'text-rose-600'],
                    ['bg' => 'bg-blue-100', 'text' => 'text-blue-600'],
                    ['bg' => 'bg-purple-100', 'text' => 'text-purple-600'],
                ];
                // Pilih warna berdasarkan panjang string nama perusahaan
                $colorIndex = strlen($job->company) % count($colors);
                $theme = $colors[$colorIndex];

                // Parsing Requirements (JSON atau Newline)
                $reqs = $job->requirements;
                if (is_string($reqs)) {
                    $decoded = json_decode($reqs, true);
                    $reqs = is_array($decoded) ? $decoded : array_filter(explode("\n", $reqs));
                }

                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company' => $job->company,
                    'location' => $job->location,
                    // Format Salary (IDR 5.000.000)
                    'salary' => is_numeric($job->salary) ? 'IDR ' . number_format($job->salary, 0, ',', '.') : $job->salary,
                    'type' => $job->type,
                    'status' => strtoupper($job->status), 
                    'description' => $job->description,
                    'requirements' => $reqs ?? [], 
                    'applicantsCount' => $job->applicants_count ?? 0,
                    'postedAt' => $job->created_at->format('d M Y'),
                    'deadline' => $job->deadline ? Carbon::parse($job->deadline)->format('Y-m-d') : '-',
                    
                    // DATA UI KOTAK WARNA
                    'initials' => $initials,
                    'color_bg' => $theme['bg'],
                    'color_text' => $theme['text'],
                ];
            });

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Menyimpan data lowongan baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string',
            'salary' => 'required|numeric|min:0',
            'type' => 'required|in:Full-time,Internship,Part-time,Contract',
            'status' => 'required|in:draft,active,closed',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'requirements' => 'nullable|string', // Validasi requirements
        ]);

        // Default Description jika kosong
        $validated['description'] = $request->description ?? 'Tidak ada deskripsi.';

        // ✅ FIX: Proses Requirements dari String (baris baru) ke JSON
        // Agar data input user tidak hilang menjadi []
        $reqInput = $request->requirements ?? '';
        $validated['requirements'] = json_encode(array_values(array_filter(array_map('trim', explode("\n", $reqInput)))));

        // Simpan ke database
        JobVacancy::create($validated);

        return redirect()->back()->with('success', 'Lowongan berhasil dipublikasikan!');
    }

    /**
     * Update data lowongan.
     */
    public function update(Request $request, $id)
    {
        $job = JobVacancy::findOrFail($id);

        // Quick Update Status (jika hanya kirim status)
        if ($request->has('status') && count($request->all()) === 1) {
            $job->update(['status' => $request->status]);
            return redirect()->back()->with('success', 'Status lowongan berhasil diperbarui.');
        }

        // Full Update
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'location' => 'required|string',
            'salary' => 'required|numeric',
            'type' => 'required|in:Full-time,Internship,Part-time,Contract',
            'status' => 'required|in:draft,active,closed',
            'description' => 'nullable|string',
            'deadline' => 'nullable|date',
            'requirements' => 'nullable|string',
        ]);

        // ✅ FIX: Update Requirements juga
        $reqInput = $request->requirements ?? '';
        $validated['requirements'] = json_encode(array_values(array_filter(array_map('trim', explode("\n", $reqInput)))));

        $job->update($validated);

        return redirect()->back()->with('success', 'Lowongan berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $job = JobVacancy::findOrFail($id);
        $job->delete();
        
        return redirect()->back()->with('success', 'Lowongan berhasil dihapus!');
    }
}