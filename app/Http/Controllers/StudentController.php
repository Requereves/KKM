<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Skill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Carbon;

class StudentController extends Controller
{
    /**
     * Menampilkan halaman data mahasiswa (React/Inertia)
     */
    public function index(Request $request)
    {
        // 1. Ambil parameter dari frontend
        $search = $request->input('search');
        $major = $request->input('major'); // Parameter filter jurusan

        // 2. Query Builder dengan Eager Loading
        // 'user' dan 'skills' di-load agar query lebih efisien (mencegah N+1 problem)
        $query = Student::with(['user', 'skills'])
            ->latest(); // Urutkan dari yang terbaru

        // 3. Logika Pencarian (Search)
        // Menggunakan grouping where (function($q)) agar tidak bentrok dengan filter lain
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 4. Logika Filter Jurusan (Major)
        // Hanya filter jika ada value dan value-nya bukan 'all'
        if ($major && $major !== 'all') {
            $query->where('major', $major);
        }

        // 5. Ambil daftar jurusan unik untuk opsi Dropdown di Frontend
        $majors = Student::distinct()
            ->whereNotNull('major')
            ->pluck('major')
            ->filter()
            ->values();

        // 6. Pagination & Data Transformation
        // Mengubah format data agar sesuai dengan kebutuhan React Table
        $students = $query->paginate(10)
            ->withQueryString() // Pertahankan parameter URL saat pindah page
            ->through(function($student) {
                
                // Logika Status Active (User dianggap aktif jika login < 5 menit lalu)
                $isActive = false;
                if ($student->last_seen_at) {
                    $lastSeen = Carbon::parse($student->last_seen_at);
                    $isActive = $lastSeen->diffInMinutes(now()) < 5;
                }

                return [
                    'id'            => $student->id,
                    'fullName'      => $student->full_name,
                    'nim'           => $student->nim,
                    'email'         => $student->email,
                    'major'         => $student->major,
                    'yearOfEntry'   => $student->year_of_entry,
                    'phone'         => $student->phone ?? '-',
                    // Mengambil hanya nama skill dalam bentuk array
                    'skills'        => $student->skills->pluck('skill_name')->toArray(),
                    // Generate avatar default berdasarkan inisial nama
                    'avatar'        => 'https://ui-avatars.com/api/?name=' . urlencode($student->full_name) . '&background=6366f1&color=fff',
                    'status'        => $isActive ? 'ACTIVE' : 'INACTIVE',
                    
                    // Formatting Tanggal agar mudah dibaca
                    'createdAt'     => $student->created_at ? Carbon::parse($student->created_at)->translatedFormat('d M Y H:i') : '-',
                    'updatedAt'     => $student->updated_at ? Carbon::parse($student->updated_at)->translatedFormat('d M Y H:i') : '-',
                ];
            });

        // 7. Render ke View React (Inertia)
        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters'  => $request->only(['search', 'major']), // Kirim state filter balik ke frontend
            'majors'   => $majors, // Kirim list jurusan untuk dropdown
        ]);
    }

    /**
     * Update data mahasiswa
     */
    public function update(Request $request, Student $student)
    {
        // Validasi input
        $validated = $request->validate([
            'full_name'     => 'required|string|max:255',
            // Validasi email unique kecuali untuk user ini sendiri
            'email'         => 'required|email|unique:students,email,' . $student->id,
            'phone'         => 'nullable|string',
            'major'         => 'required|string',
            'year_of_entry' => 'required|numeric',
        ]);

        // Update data utama
        $student->update($validated);

        // Update relasi skills (Many-to-Many) jika ada input skills
        if ($request->has('skills')) {
            // Asumsi input skills berupa array ID skill
            $student->skills()->sync($request->skills);
        }

        return redirect()->route('admin.students.index')
            ->with('success', 'Data mahasiswa berhasil diperbarui!');
    }

    /**
     * Hapus data mahasiswa
     */
    public function destroy(Student $student)
    {
        $student->delete();
        
        return redirect()->back()
            ->with('success', 'Mahasiswa berhasil dihapus.');
    }
}