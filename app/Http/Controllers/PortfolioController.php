<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PortfolioController extends Controller
{
    public function show($id)
    {
        // Ambil data portfolio + info student pemiliknya
        $portfolio = DB::table('portfolios')
            ->join('students', 'portfolios.student_id', '=', 'students.id')
            ->where('portfolios.id', $id)
            ->select('portfolios.*', 'students.user_id', 'students.full_name')
            ->first();

        // Kalau data tidak ada, error 404
        if (!$portfolio) {
            abort(404);
        }

        // Opsional: Cek hak akses (Hanya pemilik atau admin yang boleh lihat)
        // if ($portfolio->user_id != Auth::id()) {
        //    abort(403);
        // }

        return view('portfolio.show', compact('portfolio'));
    }
    public function index()
    {
        // 1. Cari data Student milik User yang login
        $student = DB::table('students')->where('user_id', Auth::id())->first();

        // 2. Kalau user belum terdaftar sebagai student, portofolio kosong
        if (!$student) {
            $portfolios = collect([]); 
        } else {
            // 3. Ambil semua portfolio milik student tersebut
            $portfolios = DB::table('portfolios')
                            ->where('student_id', $student->id)
                            ->orderBy('created_at', 'desc')
                            ->get();
        }

        return view('portfolio.index', compact('portfolios'));
    }

    // Function create kosong dulu biar gak error pas tombol diklik
    public function create()
    {
        return "Halaman Upload akan dibuat nanti"; // Nanti kita buat view-nya
    }
}