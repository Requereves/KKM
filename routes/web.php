<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PortfolioController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\JobController;
// Import Controller Admin Secara Eksplisit
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\StatsController;
use App\Http\Controllers\Admin\AdminUserController;
use Inertia\Inertia;

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

// Route Test Inertia (Opsional)
Route::get('/inertia-test', function () {
    return Inertia::render('Test');
});

// Landing Page
Route::get('/', function () {
    return view('welcome');
});

// Route Debugging (Opsional - Hapus saat Production)
Route::get('/cek-php', function () {
    return [
        'File Config yang Dipakai' => php_ini_loaded_file(),
        'Batas Upload (upload_max_filesize)' => ini_get('upload_max_filesize'),
        'Batas Post (post_max_size)' => ini_get('post_max_size'),
    ];
});

// =========================================================================
// GROUP ROUTE: LOGIN & VERIFIED EMAIL
// =========================================================================
Route::middleware(['auth', 'verified'])->group(function () {
    
    // ---------------------------------------------------------------------
    // 1. AREA MAHASISWA (STUDENT)
    // ---------------------------------------------------------------------
    
    // Dashboard Mahasiswa (Logic ada di DashboardController::index)
    Route::get('/home', [DashboardController::class, 'index'])->name('home');

    // Redirect dari /dashboard ke /home (Kompatibilitas)
    Route::get('/dashboard', function() {
        return redirect()->route('home');
    })->name('dashboard');

    // ---------------------------------------------------------------------
    // PROFILE MAHASISWA
    // ---------------------------------------------------------------------
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.update-photo'); 

    // Portfolio Mahasiswa
    Route::get('/portfolios', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('/portfolios/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('/portfolios', [PortfolioController::class, 'store'])->name('portfolio.store');
    Route::get('/portfolio/{id}', [PortfolioController::class, 'show'])->name('portfolio.show');

    // List Course Mahasiswa
    Route::get('/courses', function () {
        return "Halaman Course Belum Tersedia (Coming Soon)";
    })->name('courses.index');


    // ---------------------------------------------------------------------
    // 2. AREA KHUSUS ADMIN
    // URL Prefix: /admin/... | Route Name Prefix: admin....
    // ---------------------------------------------------------------------
    Route::prefix('admin')->name('admin.')->group(function () {
        
        // Dashboard Admin (Logic ada di DashboardController::index)
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // PROFILE ADMIN (Inertia)
        // Kita reuse method yang sama dengan mahasiswa, Controller akan cek role user
        Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.update-photo');

        // Verification Management
        Route::resource('verification', VerificationController::class)
            ->only(['index', 'show', 'update']);

        // Student Management
        Route::resource('students', StudentController::class);

        // Job Vacancies Management
        Route::resource('jobs', JobController::class);

        // Course Management
        Route::resource('courses', CourseController::class);

        // CMS / Announcements
        Route::resource('cms', AnnouncementController::class)
            ->names([
                'index'   => 'cms.index',
                'create'  => 'cms.create',
                'store'   => 'cms.store',
                'edit'    => 'cms.edit',
                'update'  => 'cms.update',
                'destroy' => 'cms.destroy',
            ])
            ->parameters(['cms' => 'id']);

        // Stats Dashboard
        Route::get('/stats', [StatsController::class, 'index'])->name('stats.index');

        // Manajemen Admin Lainnya
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::delete('/users/{id}', [AdminUserController::class, 'destroy'])->name('users.destroy');

        // Create Admin Helper (Legacy)
        Route::post('/create-admin', [DashboardController::class, 'storeAdmin'])->name('create');
    });

});

require __DIR__.'/auth.php';