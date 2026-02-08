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
// use App\Models\JobVacancy;
use App\Models\Course;
use Inertia\Inertia; // 👈 PENTING: Import Inertia
use Inertia\Response;
use App\Models\JobsVacancies;


class DashboardController extends Controller
{
    /**
     * Main Entry Point (Traffic Controller)
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
     * LOGIC DASHBOARD ADMIN (Tetap Menggunakan Blade)
     * -------------------------------------------------------------------------
     */
    private function adminDashboard($user)
    {
        // 1. Common Data untuk Sidebar/Header Admin
        $pendingQuery = Portfolio::with('student')->where('status', 'pending');
        $pendingVerificationsCount = $pendingQuery->count();
        $pendingVerifications = $pendingQuery->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return (object) [
                    'id' => $item->id,
                    'name' => $item->student->full_name ?? 'Mahasiswa',
                    'category' => ucwords(str_replace('_', ' ', $item->category)),
                    'created_at' => $item->created_at,
                ];
            });

        // 2. Data Khusus Admin Dashboard
        $data = [
            'user' => $user,
            'pendingVerifications' => $pendingVerifications,
            'pendingVerificationsCount' => $pendingVerificationsCount,
            

            // Kartu Statistik
            'pendingCount' => Portfolio::where('status', 'pending')->count(),
            'totalStudents' => Student::count(),
            'activeJobs' => class_exists(JobVacancy::class) ? JobVacancy::count() : 0,
            'partnersCount' => 24, // Hardcode

            // 1. Kartu Statistik
            $data['pendingCount'] = Portfolio::where('status', 'pending')->count();
            $data['totalStudents'] = Student::count();
            // Cek apakah tabel/model JobVacancy sudah ada, jika belum gunakan 0 agar tidak error
            $data['activeJobs'] = class_exists(JobsVacancies::class) ? JobsVacancies::count() : 0; 
            $data['partnersCount'] = 24; // Hardcode sesuai desain


            // Tabel Recent Requests
            'recentVerifications' => Portfolio::with('student')
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get(),
        ];

        // 3. Chart Data (Kompetensi & Skill Gap)
        $competencyStats = Portfolio::select('category', DB::raw('count(*) as total'))
            ->groupBy('category')
            ->get();
        
        $data['competencyLabels'] = $competencyStats->pluck('category')->map(fn($c) => ucwords(str_replace('_', ' ', $c)))->toArray();
        $data['competencyData'] = $competencyStats->pluck('total')->toArray();

        $topSkills = DB::table('student_skills')
            ->join('skills', 'student_skills.skill_id', '=', 'skills.id')
            ->select('skills.skill_name', DB::raw('count(student_skills.student_id) as student_count'))
            ->groupBy('skills.id', 'skills.skill_name')
            ->orderByDesc('student_count')
            ->limit(5)
            ->get();

        $data['skillLabels'] = $topSkills->pluck('skill_name')->toArray();
        $data['skillData'] = $topSkills->pluck('student_count')->toArray();
        
        // Mockup Industry Demand
        $data['industryDemandData'] = array_map(function($val) {
            return $val + rand(-5, 15); 
        }, $data['skillData']);

        // Return ke View Khusus Admin
        return view('admin.dashboard', $data);
    }

    /**
     * -------------------------------------------------------------------------
     * LOGIC DASHBOARD MAHASISWA (Sekarang Menggunakan React/Inertia)
     * -------------------------------------------------------------------------
     */
    private function userDashboard($user)
    {
        // 1. Data Student Profile
        $student = Student::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nim' => 'TEMP-' . $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
            ]
        );

        // 2. Common Data
        $pendingQuery = Portfolio::with('student')->where('status', 'pending')->where('student_id', $student->id);
        $pendingVerificationsCount = $pendingQuery->count();
        $pendingVerifications = $pendingQuery->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return (object) [
                    'id' => $item->id,
                    'name' => $item->student->full_name ?? 'Mahasiswa',
                    'category' => ucwords(str_replace('_', ' ', $item->category)),
                    'created_at' => $item->created_at,
                ];
            });

        // 3. Data Khusus Student Dashboard
        $data = [
            'user' => $user,
            'student' => $student,
            'userName' => $user->name,
            'pendingVerifications' => $pendingVerifications,
            'pendingVerificationsCount' => $pendingVerificationsCount,
            
            // Statistik
            'totalPortfolios' => $student->portfolios()->count(),
            'approvedPortfolios' => $student->portfolios()->where('status', 'approved')->count(),
        ];

        // Progress Calculation
        $data['progressPercentage'] = $data['totalPortfolios'] > 0 
            ? round(($data['approvedPortfolios'] / $data['totalPortfolios']) * 100) 
            : 0;

        // Calendar Data
        $data['currentMonth'] = Carbon::now()->format('F Y');
        $portfolioDates = $student->portfolios()
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->day)
            ->unique()
            ->toArray();
        $data['calendarDays'] = $this->generateCalendarDays($portfolioDates);

        // Recent Certificates
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
                    default => 'yellow',
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

        // Upcoming Activities
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

        // Charts
        $data['chartData'] = $this->getPortfolioChartData($student);
        $data['skillsData'] = $this->getSkillsChartData($student);

        // Rekomendasi Course
        $userInterest = $user->interest; 
        $recommendedCourses = Course::where('category', $userInterest)
                            ->inRandomOrder()
                            ->limit(3)
                            ->get();

        if ($recommendedCourses->isEmpty()) {
            $recommendedCourses = Course::latest()->limit(3)->get();
            $userInterest = 'Terbaru';
        }

        $data['recommendedCourses'] = $recommendedCourses;
        $data['userInterest'] = $userInterest;

        // 👈 PERUBAHAN UTAMA DI SINI:
        // Hapus 'Student/' karena file Dashboard.jsx ada di folder Pages langsung.
        return Inertia::render('Dashboard', $data);
    }

    /**
     * -------------------------------------------------------------------------
     * HELPER FUNCTIONS & OTHER FEATURES
     * -------------------------------------------------------------------------
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

    public function cms()
    {
        $admins = User::where('role', 'admin')->get();
        return view('admin.cms', compact('admins'));
    }

    private function generateCalendarDays($portfolioDates = [])
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startDayOfWeek = $startOfMonth->dayOfWeekIso; // Monday = 1
        
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

    private function getPortfolioChartData($student)
    {
        $months = collect();
        for ($i = 3; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = $student->portfolios()
                ->whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->count();
            $months->push([
                'label' => $date->format('M'),
                'count' => $count,
            ]);
        }
        return $months;
    }

    private function getSkillsChartData($student)
    {
        $studentSkillsCount = $student->skills()->count();
        $totalSkillsCount = Skill::count();
        $progression = collect([1, 2, 3, 4])->map(function($month) use ($studentSkillsCount) {
            return max(1, $studentSkillsCount - (4 - $month));
        });

        return [
            'current' => $studentSkillsCount,
            'total' => max($totalSkillsCount, 10),
            'progression' => $progression,
        ];
    }
}