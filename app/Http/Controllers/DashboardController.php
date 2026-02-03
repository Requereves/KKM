<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash; // Tambahan untuk hashing password
use App\Models\User; // Tambahan untuk create user admin
use App\Models\Student;
use App\Models\Portfolio;
use App\Models\Skill;
use App\Models\JobVacancy;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // =========================================================
        // 1. DATA UNTUK HEADER & SIDEBAR (COMMON / SEMUA ROLE)
        // =========================================================
        
        // Query dasar untuk portfolio pending
        $pendingQuery = Portfolio::with('student')->where('status', 'pending');

        // Filter notifikasi berdasarkan role
        if ($user->role === 'mahasiswa') {
            $currentStudentId = Student::where('user_id', $user->id)->value('id');
            if ($currentStudentId) {
                $pendingQuery->where('student_id', $currentStudentId);
            }
        }

        // Hitung total pending (untuk Badge Sidebar & Header)
        $pendingVerificationsCount = $pendingQuery->count();

        // Ambil 5 data terbaru (untuk Dropdown Notifikasi Header)
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

        // Init variable view array
        $data = [
            'user' => $user,
            'pendingVerifications' => $pendingVerifications,
            'pendingVerificationsCount' => $pendingVerificationsCount,
        ];

        // =========================================================
        // 2. LOGIC DASHBOARD BERDASARKAN ROLE
        // =========================================================

        if ($user->role === 'admin') {
            // -----------------------------------------------------
            // A. LOGIC ADMIN
            // -----------------------------------------------------
            
            // 1. Kartu Statistik
            $data['pendingCount'] = Portfolio::where('status', 'pending')->count();
            $data['totalStudents'] = Student::count();
            // Cek apakah tabel/model JobVacancy sudah ada, jika belum gunakan 0 agar tidak error
            $data['activeJobs'] = class_exists(JobVacancy::class) ? JobVacancy::count() : 0; 
            $data['partnersCount'] = 24; // Hardcode sesuai desain

            // 2. Tabel Recent Verification Requests (Admin Only)
            $data['recentVerifications'] = Portfolio::with('student')
                ->where('status', 'pending')
                ->latest()
                ->take(5)
                ->get();

            // 3. Chart 1: Kompetensi (Pie Chart)
            // Hitung jumlah portfolio berdasarkan kategori
            $competencyStats = Portfolio::select('category', DB::raw('count(*) as total'))
                ->groupBy('category')
                ->get();
            
            $data['competencyLabels'] = $competencyStats->pluck('category')->map(fn($c) => ucwords(str_replace('_', ' ', $c)))->toArray();
            $data['competencyData'] = $competencyStats->pluck('total')->toArray();

            // 4. Chart 2: Skill Gap (Bar Chart)
            // Top 5 skills yang dimiliki mahasiswa
            $topSkills = DB::table('student_skills')
                ->join('skills', 'student_skills.skill_id', '=', 'skills.id')
                ->select('skills.skill_name', DB::raw('count(student_skills.student_id) as student_count'))
                ->groupBy('skills.id', 'skills.skill_name')
                ->orderByDesc('student_count')
                ->limit(5)
                ->get();

            $data['skillLabels'] = $topSkills->pluck('skill_name')->toArray();
            $data['skillData'] = $topSkills->pluck('student_count')->toArray();
            
            // Mockup Industry Demand (Randomize based on actual data for visualization)
            $data['industryDemandData'] = array_map(function($val) {
                return $val + rand(-5, 15); 
            }, $data['skillData']);

        } else {
            // -----------------------------------------------------
            // B. LOGIC MAHASISWA (EXISTING CODE)
            // -----------------------------------------------------

            // Get student profile (or create if not exists)
            $student = Student::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'nim' => 'TEMP-' . $user->id,
                    'full_name' => $user->name,
                    'email' => $user->email,
                ]
            );

            $data['student'] = $student;
            $data['userName'] = $user->name;
            $data['totalPortfolios'] = $student->portfolios()->count();
            $data['approvedPortfolios'] = $student->portfolios()->where('status', 'approved')->count();

            // Calculate progress percentage
            $data['progressPercentage'] = $data['totalPortfolios'] > 0 
                ? round(($data['approvedPortfolios'] / $data['totalPortfolios']) * 100) 
                : 0;

            // Current month for calendar
            $data['currentMonth'] = Carbon::now()->format('F Y');

            // Generate calendar days
            $portfolioDates = $student->portfolios()
                ->whereYear('created_at', Carbon::now()->year)
                ->whereMonth('created_at', Carbon::now()->month)
                ->pluck('created_at')
                ->map(fn($date) => Carbon::parse($date)->day)
                ->unique()
                ->toArray();
            
            $data['calendarDays'] = $this->generateCalendarDays($portfolioDates);

            // Recent portfolios (Certificates List)
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
                        'admin_feedback' => $portfolio->admin_feedback, // Penting untuk modal detail
                    ];
                });

            // Pending/Upcoming Activities
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

            // Charts for Student
            $data['chartData'] = $this->getPortfolioChartData($student);
            $data['skillsData'] = $this->getSkillsChartData($student);
        }

        return view('dashboard', $data);
    }

    // =========================================================
    // 3. FITUR BUAT ADMIN BARU (GENESIS STRATEGY)
    // =========================================================
    
    public function storeAdmin(Request $request)
    {
        // Validasi input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Create User dengan role ADMIN
        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'admin', // 👈 PENTING: Hanya lewat sini admin baru bisa dibuat
        ]);

        return redirect()->back()->with('success', 'Admin baru berhasil ditambahkan!');
    }

    // =========================================================
    // 4. HALAMAN CMS (MANAJEMEN ADMIN) - Update Baru
    // =========================================================
    public function cms()
    {
        // Ambil semua user yang role-nya admin untuk ditampilkan di list
        $admins = User::where('role', 'admin')->get();

        return view('admin.cms', compact('admins'));
    }

    // ---------------------------------------------------------
    // HELPER FUNCTIONS (UNTUK MAHASISWA)
    // ---------------------------------------------------------

    private function generateCalendarDays($portfolioDates = [])
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        
        $startDayOfWeek = $startOfMonth->dayOfWeekIso; // Monday = 1
        
        $days = [];
        
        // Add empty cells
        for ($i = 1; $i < $startDayOfWeek; $i++) {
            $days[] = ['date' => null, 'isToday' => false, 'hasActivity' => false];
        }
        
        // Add days of month
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