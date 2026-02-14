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
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'admin') {
            return $this->adminDashboard($user);
        } else {
            return $this->userDashboard($user);
        }
    }

    // --- LOGIC DASHBOARD ADMIN ---
    private function adminDashboard($user)
    {
        // 1. Data Statistik
        $stats = [
            'pending_verifications' => Portfolio::where('status', 'pending')->count(),
            'total_students'        => User::where('role', 'student')->count(),
            'new_students_month'    => User::where('role', 'student')->whereMonth('created_at', now()->month)->count(),
            'active_jobs'           => JobVacancy::where('status', 'active')->count(),
            'industry_partners'     => JobVacancy::distinct('company')->count('company'),
        ];

        // 2. Data Verifikasi Terbaru
        $recentVerifications = Portfolio::with('student')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'id'           => $item->id,
                    'student_name' => $item->student->full_name ?? $item->student->name ?? 'Unknown Student',
                    'title'        => $item->title,
                    'category'     => ucwords(str_replace('_', ' ', $item->category)),
                    'file_url'     => $item->file_path ? asset('storage/' . $item->file_path) : '#',
                    'createdAt'    => $item->created_at,
                ];
            });

        // 3. BAR CHART: Skill Gap Analysis
        // Mengambil top 5 skill berdasarkan gabungan jumlah mahasiswa & demand
        $topSkills = Skill::withCount(['students', 'jobs'])
            ->orderByRaw('students_count + jobs_count DESC')
            ->take(5)
            ->get();

        $chartData = [
            'labels' => $topSkills->pluck('skill_name'),
            'studentSkills' => $topSkills->pluck('students_count'),
            'industryDemand' => $topSkills->pluck('jobs_count'),
        ];

        // 4. PIE CHART: Top Student Competencies (FITUR BARU)
        // Mengambil 5 skill yang paling BANYAK dimiliki oleh mahasiswa (dari tabel student_skills)
        $competencyData = Skill::withCount('students')
            ->orderByDesc('students_count') // Urutkan dari yang terbanyak
            ->take(5)
            ->get()
            ->map(function ($skill) {
                return [
                    'name' => $skill->skill_name,
                    'value' => $skill->students_count,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentVerifications' => $recentVerifications,
            'chartData' => $chartData,
            'competencyData' => $competencyData, // ✅ Kirim data Pie Chart
        ]);
    }

    // --- LOGIC DASHBOARD USER (Tidak Berubah) ---
    private function userDashboard($user)
    {
        $student = Student::firstOrCreate(
            ['user_id' => $user->id],
            ['nim' => 'TEMP-' . $user->id, 'full_name' => $user->name, 'email' => $user->email]
        );

        $pendingQuery = Portfolio::with('student')->where('status', 'pending')->where('student_id', $student->id);
        $pendingVerificationsCount = $pendingQuery->count();
        $pendingVerifications = $pendingQuery->orderBy('created_at', 'desc')->limit(5)->get()
            ->map(fn ($item) => [
                'id' => $item->id,
                'name' => $item->student->full_name ?? 'Mahasiswa',
                'category' => ucwords(str_replace('_', ' ', $item->category)),
                'created_at' => $item->created_at,
            ]);

        $data = [
            'student' => $student,
            'userName' => $user->name,
            'pendingVerifications' => $pendingVerifications,
            'pendingVerificationsCount' => $pendingVerificationsCount,
            'totalPortfolios' => $student->portfolios()->count(),
            'approvedPortfolios' => $student->portfolios()->where('status', 'approved')->count(),
        ];

        $data['progressPercentage'] = $data['totalPortfolios'] > 0 ? round(($data['approvedPortfolios'] / $data['totalPortfolios']) * 100) : 0;
        $data['currentMonth'] = Carbon::now()->format('F Y');
        
        $portfolioDates = $student->portfolios()
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->day)
            ->unique()->toArray();
            
        $data['calendarDays'] = $this->generateCalendarDays($portfolioDates);

        $data['certificates'] = $student->portfolios()->orderBy('created_at', 'desc')->limit(5)->get()->map(function($portfolio) {
            $statusColor = match($portfolio->status) { 'approved' => 'green', 'rejected' => 'red', default => 'yellow' };
            return [
                'id' => $portfolio->id,
                'name' => $portfolio->category_name ?? ucwords(str_replace('_', ' ', $portfolio->category)),
                'initials' => substr($portfolio->title, 0, 2),
                'color' => $statusColor,
                'message' => $portfolio->title,
                'description' => $portfolio->description,
                'time' => $portfolio->created_at->format('h:i A'),
                'status' => $portfolio->status,
                'admin_feedback' => $portfolio->admin_feedback,
            ];
        });

        $data['upcomingActivities'] = $student->portfolios()->where('status', 'pending')->orderBy('created_at', 'desc')->limit(4)->get()->map(function($portfolio) {
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

        $data['chartData'] = $this->getPortfolioChartData($student);
        $data['skillsData'] = $this->getSkillsChartData($student);
        
        $userInterest = $user->interest;
        $recommendedCourses = !empty($userInterest) ? Course::where('category', $userInterest)->inRandomOrder()->limit(3)->get() : [];
        $data['recommendedCourses'] = $recommendedCourses;
        $data['userInterest'] = $userInterest;

        return Inertia::render('User/Dashboard', $data);
    }

    // --- HELPERS (Tidak Berubah) ---
    public function storeAdmin(Request $request)
    {
        $request->validate(['name' => 'required|string|max:255', 'email' => 'required|string|email|max:255|unique:users', 'password' => 'required|string|min:8']);
        User::create(['name' => $request->name, 'email' => $request->email, 'password' => Hash::make($request->password), 'role' => 'admin']);
        return redirect()->back()->with('success', 'Admin baru berhasil ditambahkan!');
    }

    private function generateCalendarDays($portfolioDates = []) {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $days = [];
        for ($i = 1; $i < $startOfMonth->dayOfWeekIso; $i++) $days[] = ['date' => null, 'isToday' => false, 'hasActivity' => false];
        for ($day = 1; $day <= $endOfMonth->day; $day++) {
            $days[] = ['date' => $day, 'isToday' => ($day == $now->day), 'hasActivity' => in_array($day, $portfolioDates), 'activityColor' => in_array($day, $portfolioDates) ? 'green' : ''];
        }
        return $days;
    }

    private function getPortfolioChartData($student) {
        $months = collect();
        for ($i = 3; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = $student->portfolios()->whereYear('created_at', $date->year)->whereMonth('created_at', $date->month)->count();
            $months->push(['label' => $date->format('M'), 'count' => $count]);
        }
        return $months;
    }

    private function getSkillsChartData($student) {
        $studentSkillsCount = $student->skills()->count();
        $totalSkillsCount = Skill::count();
        $progression = collect([1, 2, 3, 4])->map(fn($month) => max(1, $studentSkillsCount - (4 - $month)));
        return ['current' => $studentSkillsCount, 'total' => max($totalSkillsCount, 10), 'progression' => $progression];
    }
}