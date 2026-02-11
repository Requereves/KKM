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
        $major = $request->input('major'); // <--- INI YANG HILANG SEBELUMNYA

        // 2. Query Builder
        $query = Student::with(['user', 'skills'])
            ->latest();

        // 3. Logika Pencarian (Search)
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('nim', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // 4. Logika Filter Jurusan (Major)
        // <--- BAGIAN INI DITAMBAHKAN KEMBALI
        if ($major && $major !== 'all') {
            $query->where('major', $major);
        }

        // 5. Ambil daftar jurusan unik untuk Dropdown
        $majors = Student::distinct()->pluck('major')->filter()->values();

        // 6. Pagination & Data Transformation
        $students = $query->paginate(10)
            ->withQueryString()
            ->through(function($student) {
                
                // Logika Status Active
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
                    'skills'        => $student->skills->pluck('skill_name')->toArray(),
                    'avatar'        => 'https://ui-avatars.com/api/?name=' . urlencode($student->full_name) . '&background=6366f1&color=fff',
                    'status'        => $isActive ? 'ACTIVE' : 'INACTIVE', // Uppercase sesuai request
                    
                    // Fix Tanggal (Carbon Parse)
                    'createdAt'     => $student->created_at ? Carbon::parse($student->created_at)->toDateTimeString() : '-',
                    'updatedAt'     => $student->updated_at ? Carbon::parse($student->updated_at)->toDateTimeString() : '-',
                ];
            });

        // 7. Render ke React
        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'filters'  => $request->only(['search', 'major']),
            'majors'   => $majors, // Kirim list jurusan ke frontend
        ]);
    }

    // ... (Function update dan destroy tetap sama seperti sebelumnya)
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'full_name'     => 'required|string|max:255',
            'email'         => 'required|email|unique:students,email,' . $student->id,
            'phone'         => 'nullable|string',
            'major'         => 'required|string',
            'year_of_entry' => 'required|numeric',
        ]);

        $student->update($validated);

        if ($request->has('skills')) {
            $student->skills()->sync($request->skills);
        }

        return redirect()->route('admin.students.index')->with('success', 'Data mahasiswa berhasil diperbarui!');
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return redirect()->back()->with('success', 'Mahasiswa berhasil dihapus.');
    }
}