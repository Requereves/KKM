<?php
// BANYAK KOMEN AI ANJAY

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;

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

        $student = DB::table('students')->where('user_id', Auth::id())->first();

        if (!$student) {
            return redirect()->route('dashboard')->with('error', 'Anda harus terdaftar sebagai mahasiswa untuk upload portfolio.');
        }

        return view('portfolio.create');
    }
    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'title'       => 'required|string|max:100',
            'category'    => 'required|in:sertifikat,proyek_kuliah,portofolio_bebas', // Sesuai ENUM di SQL
            'description' => 'nullable|string',
            'file'        => 'required|file|mimes:pdf|max:5120', // Wajib PDF, Max 5MB
        ]);

        // 2. Ambil Student ID milik User Login
        $student = DB::table('students')->where('user_id', Auth::id())->first();
        
        // Safety check kalau student tidak ditemukan
        if (!$student) {
            abort(403, 'Unauthorized user.');
        }

        // 3. Proses Upload File
        if ($request->hasFile('file')) {
            // Simpan ke folder: storage/app/public/portfolios
            $path = $request->file('file')->store('portfolios', 'public');
        }

        // 4. Simpan ke Database
        DB::table('portfolios')->insert([
            'student_id'  => $student->id,
            'title'       => $request->title,
            'description' => $request->description,
            'category'    => $request->category,
            'file_path'   => $path,
            'status'      => 'pending', // Default sesuai SQL
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        // 5. Redirect kembali ke halaman Index
        return redirect()->route('portfolio.index')->with('success', 'Portfolio berhasil diupload!');
    }
}