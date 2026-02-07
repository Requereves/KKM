<?php

namespace App\Http\Controllers;

use App\Models\Student;
// use Carbon\Carbon;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index()
    {
        
        $students = Student::with(['user', 'skills'])->get()->map(function($student) {

            $isActive = false;
        
        if ($student->last_seen_at) {
           $now = \Illuminate\Support\Carbon::now();
            
            // 3. Hitung selisih menit
            $isActive = $student->last_seen_at->diffInMinutes($now) < 5;
        }

            return [
                'id' => $student->id,
                'fullName' => $student->full_name, // Mapping dari full_name
                'nim' => $student->nim,
                'email' => $student->email,
                'major' => $student->major,
                'yearOfEntry' => $student->year_of_entry, // Mapping dari year_of_entry
                'phone' => $student->phone,
                // Mengambil nama-nama skill ke dalam array sederhana
                'skills' => $student->skills->map(function($s) {
                    return [
                        'id' => $s->id,
                        'name' => $s-> skill_name
                    ];
                })->toArray(),
                // Avatar default menggunakan UI Avatars berdasarkan nama
                'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($student->full_name) . '&background=6366f1&color=fff',

                // Status bisa diambil dari relasi user (misal status email verified) atau default 'active'
                'status' => $isActive ? 'active' : 'Inactive',

                // Tanggal untuk System Info di Modal
                'createdAt' => $student->user ? $student->user->created_at->format('Y-m-d') : '-',
                'updatedAt' => $student->user ? $student->user->updated_at->format('Y-m-d') : '-',
            ];
        });

       
        return view('admin.students.index', compact('students'));
    }

    public function edit(Student $student)
        {
            $student->load('skills'); 

            $allSkills = \App\Models\Skill::all();
            return view('admin.students.edit', compact('student','allSkills'));
        }

    public function update(Request $request, Student $student)
        {
            $validated = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|unique:students,email,' . $student->id,
                'phone' => 'nullable|string',
                'major' => 'required|string',
                'year_of_entry' => 'required|numeric',
                'is_active' => 'required|boolean'
            ]);

            $student->update($validated);

            // Buat Skill
            $student->update($request->except('skills'));

            if ($request->has('skills')) {
                $student->skills()->sync($request->skills);
            } else {
                $student->skills()->detach();
            }

            return redirect()->route('students.index')->with('success', 'Data mahasiswa berhasil diperbarui!');
        }
}