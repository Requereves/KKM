<?php

namespace App\Http\Controllers\User;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia; 
use Illuminate\Support\Facades\Storage;


class UserCoursesController extends Controller
{
   public function index()
{
    $courses = Course::all()->map(function($course) {
        return [
            'id' => $course->id,
            'title' => $course->title,
            'description' => $course->description ?? 'Belum ada deskripsi.',
            // Logic gambar yang sama agar tidak pecah
            'thumbnail' => (str_contains($course->thumbnail, 'http')) 
                            ? $course->thumbnail 
                            : ($course->thumbnail ? asset('storage/' . $course->thumbnail) : 'https://placehold.co/600x400/png'),
            // Tambahkan field lain yang dibutuhkan oleh card di UI User
            'instructor' => $course->instructor,
            'status' => ['active', 'upcoming', 'completed'][rand(0, 2)],
        ];
    });

    return Inertia::render('User/Course/Courses', [
        'courses' => $courses,
        'language' => session('locale', 'id'),
    ]);
}

    public function show($id)
    {
        // Mengambil kursus beserta relasi modul dan pelajaran (lessons)
        $course = Course::with(['modules.lessons'])->findOrFail($id);

        return Inertia::render('User/Course/CourseDetail', [
            'course' => $course,
            'language' => session('locale', 'id'),
        ]);
    }
}