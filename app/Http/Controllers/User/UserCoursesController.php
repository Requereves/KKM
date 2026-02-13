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
        return Inertia::render('User/Course/Courses', [ // Mengarah ke folder Pages/User/Courses.jsx
            'courses' => Course::all(),
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