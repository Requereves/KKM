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
use App\Http\Controllers\Admin\ConsultationController;
use App\Http\Controllers\User\UserCoursesController;
use App\Http\Controllers\User\PsychologistController;
// Import Notification Controller
use App\Http\Controllers\NotificationController;
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
    // PROFILE USER (Berlaku untuk Admin, Student, & Psikolog)
    // ---------------------------------------------------------------------
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // ✅ Route Upload Avatar
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');

    // ---------------------------------------------------------------------
    // 🔔 SYSTEM NOTIFICATIONS
    // ---------------------------------------------------------------------
    // Halaman "Lihat Semua Notifikasi"
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    // Tandai satu notifikasi dibaca
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    // Tandai SEMUA notifikasi dibaca
    Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead'])->name('notifications.readAll');
    // 🗑️ Hapus satu notifikasi (Route Baru)
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');


    // Portfolio Mahasiswa
    Route::get('portfolio', [PortfolioController::class, 'index'])->name('portfolio.index');
    Route::get('portfolio/create', [PortfolioController::class, 'create'])->name('portfolio.create');
    Route::post('portfolio', [PortfolioController::class, 'store'])->name('portfolio.store');
    Route::get('portfolio/{id}/edit', [PortfolioController::class, 'edit'])->name('portfolio.edit');
    Route::put('portfolio/{id}', [PortfolioController::class, 'update'])->name('portfolio.update');
    Route::delete('portfolio/{id}', [PortfolioController::class, 'destroy'])->name('portfolio.destroy');

    // List Course Mahasiswa
    Route::get('/courses', [UserCoursesController::class, 'index'])->name('courses.index');
    Route::get('/courses/{id}', [UserCoursesController::class, 'show'])->name('courses.show'); 

    // Layanan Psikolog & Konsultasi Karir (User Side)
    Route::get('/psychologist', [PsychologistController::class, 'index'])->name('psychologist.index');
    Route::post('/psychologist', [PsychologistController::class, 'store'])->name('psychologist.store');


    // ---------------------------------------------------------------------
    // 2. AREA BACKOFFICE (ADMIN & PSIKOLOG)
    // ---------------------------------------------------------------------
    Route::prefix('admin')->name('admin.')->group(function () {
        
        // =================================================================
        // GRUP 1: SUPER ADMIN ONLY (Psikolog DILARANG masuk sini)
        // =================================================================
        Route::middleware(['role:admin'])->group(function () {
            
            // Dashboard Admin
            Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

            // Verification Management
            Route::resource('verification', VerificationController::class)->only(['index', 'show', 'update']);

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


        // =================================================================
        // GRUP 2: SHARED ACCESS (ADMIN & PSIKOLOG BOLEH MASUK)
        // =================================================================
        Route::middleware(['role:admin,psychologist'])->group(function () {
            
            // Consultation / Psikolog Management (Admin Side)
            Route::resource('consultations', ConsultationController::class)
                ->names([
                    'index'   => 'consultations.index',
                    'update'  => 'consultations.update',
                    'destroy' => 'consultations.destroy',
                ])
                ->only(['index', 'update', 'destroy']);
        });

    });

});

require __DIR__.'/auth.php';