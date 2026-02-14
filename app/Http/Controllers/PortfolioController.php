<?php
// BANYAK KOMEN AI ANJAY

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function show($id)
    {
        // Ambil data portfolio + info student pemiliknya
    $portfolio = DB::table('portfolios')->where('id', $id)->first();

    if (!$portfolio) {
        return`ID $id tidak ada di database`;
    }

    // Direct Path File nya
    $path = storage_path('app' . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . $portfolio->file_path);

     if (!file_exists($path)) {
        return "ERROR: File ada di database tapi TIDAK ADA di folder: " . $path;
    }


        // Opsional: Cek hak akses (Hanya pemilik atau admin yang boleh lihat)
        // if ($portfolio->user_id != Auth::id()) {
        //    abort(403);
        // }
         return response()->file($path, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline'
        ]);

        // return view('portfolio.show', compact('portfolio'));
    }
    public function index()
    {   
        
        $user = Auth::user();

        // Buat Admin
      if($user->role =='admin') {
        // Ambil semua portfolio untuk diverifikasi admin
        $portfolios = DB::table('portfolios')
                    ->join('students', 'portfolios.student_id', '=', 'students.id')
                    ->select(
                        'portfolios.id',
                        'students.full_name as name', // Sesuai prop 'name' di React
                        'students.nim',              // Sesuai prop 'nim'
                        'portfolios.title as documentTitle', // Sesuai 'documentTitle'
                        'portfolios.category',
                        'portfolios.status',
                        'portfolios.description',
                        'portfolios.file_path as filePath'
                    )
                    ->orderBy('portfolios.created_at', 'desc')
                    ->get();

        // Ganti 'portfolio.index' (Blade) menjadi Inertia Page kamu
        return Inertia::render('Admin/VerificationPage', [
            'items' => $portfolios
        ]);
    } else {
        // ... (Logika user/mahasiswa tetap sama)
        $student = DB::table('students')->where('user_id', $user->id)->first();
        $portfolios = $student 
            ? DB::table('portfolios')->where('student_id', $student->id)->orderBy('created_at', 'desc')->get()
            : collect([]);

        return Inertia::render('User/Certificate/Competence', [
            'portfolios' => $portfolios,
            'language' => session('locale', 'id')
        ]);
    }
    }

    // Function create kosong dulu biar gak error pas tombol diklik
    public function create()
    {
        
         $user = Auth::user();

        // Admin 
        if ($user->role == 'admin') {
            return view('portfolio.create');
        }

        // Mahasiswa 
        $student = DB::table('students')->where('user_id', $user->id)->first();

        if (!$student) {
            return redirect()->route('dashboard')->with('error', 'Anda harus terdaftar sebagai mahasiswa.');
        }

        return Inertia::render('User/Certificate/UploadCertificate', [
            'language' => session('locale', 'id')
        ]);

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

    public function edit($id)
    {
        // Hanya User/Mahasiswa yang biasanya masuk ke sini untuk reupload
        $portfolio = DB::table('portfolios')->where('id', $id)->first();
        
        // Proteksi: Pastikan ini milik dia
        $student = DB::table('students')->where('user_id', Auth::id())->first();
        if (!$portfolio || $portfolio->student_id !== $student->id) {
            abort(403);
        }

        return Inertia::render('User/Certificate/UploadCertificate', [
            'existingPortfolio' => $portfolio,
            'isEdit' => true,
            'language' => session('locale', 'id')
        ]);
    }
     public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'required|string|max:100',
            'category'    => 'required|in:sertifikat,proyek_kuliah,portofolio_bebas',
            'description' => 'nullable|string',
            'file'        => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $portfolio = DB::table('portfolios')->where('id', $id)->first();
        
        $updateData = [
            'title' => $request->title,
            'category' => $request->category,
            'description' => $request->description,
            'status' => 'pending', // Reset status jadi pending lagi kalau diupdate
            'admin_feedback' => null, // Hapus feedback lama
            'updated_at' => now(),
        ];

        if ($request->hasFile('file')) {
            // Hapus file lama
            Storage::disk('public')->delete($portfolio->file_path);
            // Simpan file baru
            $updateData['file_path'] = $request->file('file')->store('portfolios', 'public');
        }

        DB::table('portfolios')->where('id', $id)->update($updateData);

        return redirect()->route('portfolio.index')->with('success', 'Portfolio berhasil diperbarui!');
    }

    public function destroy($id)
    {
        $portfolio = DB::table('portfolios')->where('id', $id)->first();
        
        // Proteksi: Jangan hapus punya orang lain dan jangan hapus yang sudah approved
        $student = DB::table('students')->where('user_id', Auth::id())->first();
        
        if (Auth::user()->role !== 'admin') {
            if (!$portfolio || $portfolio->student_id !== $student->id || $portfolio->status === 'approved') {
                return redirect()->back()->with('error', 'Tidak diizinkan menghapus.');
            }
        }

        // Hapus file
        Storage::disk('public')->delete($portfolio->file_path);
        // Hapus Baris
        DB::table('portfolios')->where('id', $id)->delete();

        return redirect()->back()->with('success', 'Portfolio berhasil dihapus.');
    }

    public function updateStatus(Request $request, $id)
    {
    // Hanya admin yang boleh akses
    if (Auth::user()->role !== 'admin') abort(403);

    DB::table('portfolios')->where('id', $id)->update([
        'status' => $request->status, // 'approved' atau 'rejected'
        'admin_feedback' => $request->feedback,
        'updated_at' => now(),
    ]);

    return redirect()->back()->with('success', 'Status berhasil diperbarui');
}

}