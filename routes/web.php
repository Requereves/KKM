<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\VerificationController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- SWITCH LANGUAGE ROUTE (FITUR BARU) ---
// Route ini menghandle pergantian bahasa (ID <-> EN)
// Ditaruh di luar middleware auth agar bisa diakses di halaman login/welcome
Route::get('lang/{locale}', function ($locale) {
    // Validasi input hanya boleh 'en' atau 'id'
    if (in_array($locale, ['en', 'id'])) {
        session(['locale' => $locale]); // Simpan pilihan ke session
    }
    return redirect()->back(); // Kembali ke halaman sebelumnya
})->name('lang.switch');


Route::get('/', function () {
    return view('welcome');
});

// Route Debugging (Bisa dihapus nanti saat production)
Route::get('/cek-php', function () {
    return [
        'File Config yang Dipakai' => php_ini_loaded_file(),
        'Batas Upload (upload_max_filesize)' => ini_get('upload_max_filesize'),
        'Batas Post (post_max_size)' => ini_get('post_max_size'),
    ];
});

// Group Route untuk User yang sudah Login & Terverifikasi Email
Route::middleware(['auth', 'verified'])->group(function () {
    
    // --- 1. DASHBOARD UMUM / MAHASISWA (URL: /dashboard) ---
    // Route default yang dicari Laravel secara standar setelah login
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- PROFILE ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- STUDENT PORTFOLIOS (Mahasiswa) ---
    Route::get('/portfolios', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/portfolios/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('/portfolios', [PortfolioController::class, 'store'])->name('portfolio.store');
    
    // Detail Portfolio (Digunakan juga untuk Modal di Dashboard / Admin Preview)
    Route::get('/portfolio/{id}', [PortfolioController::class, 'show'])->name('portfolio.show');

    // --- ADMIN AREA ---
    // Semua route di dalam group ini akan otomatis diawali URL "/admin"
    Route::prefix('admin')->group(function () {
        
        // 2. DASHBOARD KHUSUS ADMIN (URL: /admin/dashboard)
        // Kita arahkan ke controller yang sama, tapi nama route-nya 'admin.dashboard'
        // Ini penting agar Sidebar bisa membedakan mana dashboard admin & mahasiswa
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

        // URL: /admin/verification
        // Nama Route otomatis: verification.index, verification.show, verification.update
        Route::resource('verification', VerificationController::class)
            ->only(['index', 'show', 'update']);

        // --- HALAMAN CMS (MANAJEMEN ADMIN) ---
        // Route untuk menampilkan halaman list admin & modal tambah admin
        Route::get('/cms', [DashboardController::class, 'cms'])->name('cms.index');

        // --- TAMBAH ADMIN BARU (INTERNAL DASHBOARD) ---
        // Route ini menangani pembuatan admin baru oleh admin yang sedang login
        Route::post('/create-admin', [DashboardController::class, 'storeAdmin'])->name('admin.create');
    });

});

require __DIR__.'/auth.php';