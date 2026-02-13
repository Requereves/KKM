<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia; 
use Illuminate\Support\Facades\Storage;

class CourseController extends Controller
{
    /**
     * Menampilkan daftar course (Menggunakan Inertia untuk React)
     */
    public function index()
    {
        // Ambil data terbaru dari database
        $courses = Course::latest()->get()->map(function($course) {
            // Mapping data agar sesuai dengan struktur props di React
            return [
                'id' => $course->id,
                'title' => $course->title,
                'category' => $course->category,
    
                'description' => $course->getRawOriginal('description') ?? 'Comprehensive course description placeholder...', 
                'instructor' => $course->instructor,
                
                'image' => (str_contains($course->thumbnail, 'http')) 
                        ? $course->thumbnail 
                        : ($course->thumbnail ? asset('storage/' . $course->thumbnail) : 'https://placehold.co/600x400/png'),

                'startDate' => $course->created_at->format('Y-m-d'), // Mapping created_at ke startDate
                'endDate' => $course->created_at->addMonths(1)->format('Y-m-d'), // Dummy endDate (+1 bulan)
                'participantsCount' => rand(10, 50), // Dummy data
                'maxParticipants' => 100, // Dummy data
                // Logika status dummy (sesuaikan dengan logika bisnis kamu nanti)
                'status' => ['active', 'upcoming', 'completed'][rand(0, 2)],
                'type' => ['online', 'offline', 'hybrid'][rand(0, 2)],
            ];
        });

        // Render komponen React 'Admin/Courses/Index' dengan data courses
        return Inertia::render('Admin/Courses/Index', [
            'courses' => $courses,
            'lang' => 'en' // Default language
        ]);
    }

    /**
     * Menampilkan form tambah course (Masih pakai Blade atau mau diganti React juga?)
     * Jika ingin full React, method ini mungkin tidak diperlukan jika formnya modal/halaman React terpisah.
     * Tapi untuk sekarang biarkan dulu atau sesuaikan jika routenya mengarah ke Inertia.
     */
    public function create()
    {
        // Jika ingin form create juga pakai React, ganti return view(...) dengan Inertia::render(...)
        // Untuk sementara saya komen yang blade, asumsi create form handle di React page 'Index' atau komponen terpisah
        // return view('admin.courses.create'); 
        
        // Contoh jika create page terpisah di React:
         return Inertia::render('Admin/Courses/TrainingForm', ['mode' => 'create']);
    }

    /**
     * Proses Simpan Data (Termasuk Upload Gambar)
     */
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'instructor' => 'required|string',
            'description' => 'required|string',
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048', // Max 2MB
        ]);

        // 2. Upload Gambar
        $imagePath = null;
        if ($request->hasFile('thumbnail')) {
            $imagePath = $request->file('thumbnail')->store('courses', 'public');
        }

        // 3. Simpan ke Database
        Course::create([
            'title' => $request->title,
            'category' => $request->category,
            'instructor' => $request->instructor,
            'description' => $request->description,
            'thumbnail' => $imagePath,
        ]);

        // Redirect kembali ke index dengan pesan sukses
        return redirect()->route('admin.courses.index')->with('success', 'Training created successfully');
    }

    /**
     * Tampilkan form edit (NEW)
     */
    public function edit(Course $course)
    {
        // Sama seperti create, arahkan ke komponen React jika ingin edit page terpisah
        // return view('admin.courses.edit', compact('course'));

        // Contoh untuk Inertia:
         return Inertia::render('Admin/Courses/TrainingForm', [
             'mode' => 'edit',
             'initialData' => $course
         ]);
    }

    /**
     * Proses Update Data (NEW)
     */
    public function update(Request $request, Course $course)
    {
        // 1. Validasi
        $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'instructor' => 'required|string',
            'description' => 'nullable|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', 
        ]);

        // 2. Data dasar
        $data = [
            'title' => $request->title,
            'category' => $request->category,
            'instructor' => $request->instructor,
            'description' => $request->description,
        ];

        // 3. Upload gambar baru jika ada
        if ($request->hasFile('thumbnail')) {
            if ($course->thumbnail && Storage::disk('public')->exists($course->thumbnail)) {
                Storage::disk('public')->delete($course->thumbnail);
            }
            $data['thumbnail'] = $request->file('thumbnail')->store('courses', 'public');
        }

        // 4. Update Database
        $course->update($data);

        return redirect()->route('admin.courses.index')->with('success', 'Training updated successfully');
    }

    /**
     * Hapus Course & Gambarnya
     */
    public function destroy($id) // Ubah parameter jadi $id agar konsisten dengan route model binding atau id langsung
    {
        $course = Course::findOrFail($id); // Cari course manual jika binding tidak otomatis atau untuk keamanan

        if ($course->thumbnail && Storage::disk('public')->exists($course->thumbnail)) {
            Storage::disk('public')->delete($course->thumbnail);
        }

        $course->delete();
        
        // Return redirect back (Inertia akan handle reload partial)
        return redirect()->back()->with('success', 'Training deleted successfully');
    }
}