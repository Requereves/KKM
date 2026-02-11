<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Student;
use App\Models\Portfolio;
use App\Models\Skill;
use App\Models\JobVacancy;
use App\Models\Course;
use Inertia\Inertia; 
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Main Entry Point
     * Mendeteksi role user dan mengarahkan ke dashboard yang sesuai.
     */
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return $this->adminDashboard($user);
        } else {
            return $this->userDashboard($user);
        }
    }

    /**
     * -------------------------------------------------------------------------
     * LOGIC DASHBOARD ADMIN (Inertia React)
     * -------------------------------------------------------------------------
     */
    private function adminDashboard($user)
    {
        // 1. Data Statistik (Real-time count)
        $stats = [
            'pending_verifications' => Portfolio::where('status', 'pending')->count(),
            'total_students'        => User::where('role', 'student')->count(),
            'new_students_month'    => User::where('role', 'student')
                                        ->whereMonth('created_at', now()->month)
                                        ->count(),
            'active_jobs'           => JobVacancy::where('status', 'active')->count(),
            // Hitung jumlah perusahaan unik sebagai partner
            'industry_partners'     => JobVacancy::distinct('company')->count('company'), 
        ];

        // 2. Data Verifikasi Terbaru (Untuk Table Dashboard)
        $recentVerifications = Portfolio::with('student') // Eager load relasi student
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id'           => $item->id,
                    // Fallback jika data student terhapus/null
                    'student_name' => $item->student->full_name ?? $item->student->name ?? 'Unknown Student',
                    'title'        => $item->title,
                    'category'     => ucwords(str_replace('_', ' ', $item->category)),
                    'file_url'     => $item->file_path ? asset('storage/' . $item->file_path) : '#',
                    'createdAt'    => $item->created_at, // Dikirim sebagai object agar bisa diolah JS
                ];
            });

        // 3. Render Page React
        return Inertia::render('Admin/Dashboard', [
            // HAPUS BAGIAN INI: 'auth' => ['user' => $user], 
            // Kita biarkan HandleInertiaRequests yang mengirim data auth agar konsisten
            
            'stats' => $stats,
            'recentVerifications' => $recentVerifications,
        ]);
    }

    /**
     * -------------------------------------------------------------------------
     * LOGIC DASHBOARD MAHASISWA
     * -------------------------------------------------------------------------
     */
    private function userDashboard($user)
    {
        // Cek atau buat data student jika belum ada (Auto-sync User -> Student)
        $student = Student::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nim' => 'TEMP-' . $user->id, 
                'full_name' => $user->name, 
                'email' => $user->email
            ]
        );

        // Data Portfolio & Verifikasi
        $pendingQuery = Portfolio::with('student')
            ->where('status', 'pending')
            ->where('student_id', $student->id);
            
        $pendingVerificationsCount = $pendingQuery->count();
        
        $pendingVerifications = $pendingQuery->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->student->full_name ?? 'Mahasiswa',
                    'category' => ucwords(str_replace('_', ' ', $item->category)),
                    'created_at' => $item->created_at,
                ];
            });

        // Persiapan Data Utama
        $data = [
            // HAPUS INI JUGA: 'user' => $user, (Gunakan auth.user di frontend)
            'student' => $student,
            'userName' => $user->name,
            'pendingVerifications' => $pendingVerifications,
            'pendingVerificationsCount' => $pendingVerificationsCount,
            'totalPortfolios' => $student->portfolios()->count(),
            'approvedPortfolios' => $student->portfolios()->where('status', 'approved')->count(),
        ];

        // Hitung Progress
        $data['progressPercentage'] = $data['totalPortfolios'] > 0 
            ? round(($data['approvedPortfolios'] / $data['totalPortfolios']) * 100) 
            : 0;

        // Generate Kalender Aktivitas
        $data['currentMonth'] = Carbon::now()->format('F Y');
        $portfolioDates = $student->portfolios()
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->day)
            ->unique()
            ->toArray();
        $data['calendarDays'] = $this->generateCalendarDays($portfolioDates);

        // List Sertifikat Terbaru
        $data['certificates'] = $student->portfolios()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($portfolio) {
                $initials = collect(explode(' ', $portfolio->title))
                    ->map(fn($word) => strtoupper(substr($word, 0, 1)))
                    ->take(2)
                    ->join('');
                
                $statusColor = match($portfolio->status) {
                    'approved' => 'green', 
                    'rejected' => 'red', 
                    'pending' => 'yellow', 
                    default => 'yellow'
                };

                return [
                    'id' => $portfolio->id,
                    'name' => $portfolio->category_name ?? ucwords(str_replace('_', ' ', $portfolio->category)),
                    'initials' => $initials,
                    'color' => $portfolio->status_color ?? $statusColor,
                    'message' => $portfolio->title,
                    'description' => $portfolio->description,
                    'time' => $portfolio->created_at->format('h:i A'),
                    'status' => $portfolio->status,
                    'admin_feedback' => $portfolio->admin_feedback,
                ];
            });

        // Aktivitas Mendatang (Pending Items)
        $data['upcomingActivities'] = $student->portfolios()
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->limit(4)
            ->get()
            ->map(function($portfolio) {
                return [
                    'day' => $portfolio->created_at->format('d'),
                    'color' => 'yellow',
                    'title' => $portfolio->title,
                    'date' => $portfolio->created_at->format('jS F Y'),
                    'time' => 'Pending Review',
                    'location' => ucwords(str_replace('_', ' ', $portfolio->category)),
                    'category' => $portfolio->category,
                ];
            });

        // Chart Data
        $data['chartData'] = $this->getPortfolioChartData($student);
        $data['skillsData'] = $this->getSkillsChartData($student);

        // Rekomendasi Course berdasarkan Interest User
        $userInterest = $user->interest; 
        $recommendedCourses = [];
        if (!empty($userInterest)) {
            $recommendedCourses = Course::where('category', $userInterest)->inRandomOrder()->limit(3)->get();
        }
        $data['recommendedCourses'] = $recommendedCourses;
        $data['userInterest'] = $userInterest;

        return Inertia::render('Dashboard', $data);
    }

    /**
     * Helpers
     */
    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);
        User::create([
            'name' => $request->name, 
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'role' => 'admin',
        ]);
        return redirect()->back()->with('success', 'Admin baru berhasil ditambahkan!');
    }

    private function generateCalendarDays($portfolioDates = []) {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startDayOfWeek = $startOfMonth->dayOfWeekIso; 
        $days = [];
        for ($i = 1; $i < $startDayOfWeek; $i++) {
            $days[] = ['date' => null, 'isToday' => false, 'hasActivity' => false];
        }
        for ($day = 1; $day <= $endOfMonth->day; $day++) {
            $isToday = ($day == $now->day);
            $hasActivity = in_array($day, $portfolioDates);
            $days[] = [
                'date' => $day, 
                'isToday' => $isToday, 
                'hasActivity' => $hasActivity, 
                'activityColor' => $hasActivity ? 'green' : ''
            ];
        }
        return $days;
    }

    private function getPortfolioChartData($student) {
        $months = collect();
        for ($i = 3; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = $student->portfolios()
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $months->push(['label' => $date->format('M'), 'count' => $count]);
        }
        return $months;
    }

    private function getSkillsChartData($student) {
        $studentSkillsCount = $student->skills()->count();
        $totalSkillsCount = Skill::count();
        $progression = collect([1, 2, 3, 4])->map(fn($month) => max(1, $studentSkillsCount - (4 - $month)));
        return [
            'current' => $studentSkillsCount, 
            'total' => max($totalSkillsCount, 10), 
            'progression' => $progression
        ];
    }
}