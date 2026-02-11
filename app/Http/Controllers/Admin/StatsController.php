<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\JobVacancy; // Pastikan Model JobVacancy di-import

class StatsController extends Controller
{
    public function index()
    {
        // KITA KIRIM DATA MENTAH (RAW DATA)
        // Frontend (StatsPage.jsx) yang akan bertugas:
        // 1. Menghitung Total Jobs
        // 2. Filter Active Jobs
        // 3. Menjumlahkan Applicants
        // 4. Mengelompokkan data untuk Grafik (Chart)
        
        // Mengambil semua data job vacancy terbaru
        $jobs = JobVacancy::latest()->get();

        return Inertia::render('Admin/Stats/Index', [
            // Kirim variable 'jobs' agar dibaca oleh props StatsPage({ jobs })
            'jobs' => $jobs 
        ]);
    }
}