<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\VerificationController;
use Inertia\Inertia;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\JobController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// --- SWITCH LANGUAGE ROUTE ---
Route::get('lang/{locale}', function ($locale) {
    if (in_array($locale, ['en', 'id'])) {
        session(['locale' => $locale]);
    }
    return redirect()->back();
})->name('lang.switch');


Route::get('/inertia-test', function () {
    return Inertia::render('Test');
});

Route::get('/', function () {
    return view('welcome');
});

// Route Debugging
Route::get('/cek-php', function () {
    return [
        'File Config yang Dipakai' => php_ini_loaded_file(),
        'Batas Upload (upload_max_filesize)' => ini_get('upload_max_filesize'),
        'Batas Post (post_max_size)' => ini_get('post_max_size'),
    ];
});

// Group Route untuk User yang sudah Login & Terverifikasi Email
Route::middleware(['auth', 'verified'])->group(function () {
    
    // 1. DASHBOARD MAHASISWA
    Route::get('/home', [DashboardController::class, 'index'])->name('home');

    // 2. PROFILE USER (MAHASISWA) - REACT/INERTIA
    // URL: /profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    
    // Menggunakan POST untuk upload file (Avatar)
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 3. STUDENT PORTFOLIOS
    Route::get('/portfolios', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/portfolios/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('/portfolios', [PortfolioController::class, 'store'])->name('portfolio.store');
    
    // Detail Portfolio
    Route::get('/portfolio/{id}', [PortfolioController::class, 'show'])->name('portfolio.show');

    // 4. COURSES (Halaman List Course untuk Mahasiswa)
    // Saat ini masih placeholder, nanti bisa diganti controller untuk menampilkan list course dari DB
    Route::get('/courses', function () {
        return "Halaman Course Belum Tersedia (Coming Soon)";
    })->name('courses.index');

    // --- AREA KHUSUS ADMIN ---
    // Semua route di sini otomatis ada awalan '/admin'
    Route::prefix('admin')->group(function () {
        
        // Dashboard Admin
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

        // PROFILE ADMIN - BLADE VIEW
        // URL: /admin/profile
        Route::get('/profile', [ProfileController::class, 'editAdmin'])->name('admin.profile.edit');
        Route::patch('/profile', [ProfileController::class, 'updateAdmin'])->name('admin.profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroyAdmin'])->name('admin.profile.destroy');

        // Verification Resource
        Route::resource('verification', VerificationController::class)
            ->only(['index', 'show', 'update']);

        // Route Student Management (CMS)
        Route::resource('students', StudentController::class);

        // Route Job Vacancies (CMS)
        Route::resource('jobs', JobController::class);

        // Route Management Course (Full CRUD)
        Route::resource('courses', \App\Http\Controllers\Admin\CourseController::class)->names([
            'index'   => 'admin.courses.index',
            'create'  => 'admin.courses.create',
            'store'   => 'admin.courses.store',
            'edit'    => 'admin.courses.edit',
            'update'  => 'admin.courses.update',
            'destroy' => 'admin.courses.destroy',
        ]);

        // 👇 PERUBAHAN DI SINI: Route CMS sekarang pakai AnnouncementController (Full CRUD)
        Route::resource('cms', \App\Http\Controllers\Admin\AnnouncementController::class)->names([
            'index'   => 'cms.index',
            'create'  => 'cms.create',
            'store'   => 'cms.store',
            'edit'    => 'cms.edit',
            'update'  => 'cms.update',
            'destroy' => 'cms.destroy',
        ]);

        // Tambah Admin Baru
        Route::post('/create-admin', [DashboardController::class, 'storeAdmin'])->name('admin.create');
    });

});

require __DIR__.'/auth.php';