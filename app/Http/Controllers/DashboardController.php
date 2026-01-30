<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Student;
use App\Models\Portfolio;
use App\Models\Skill;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        
        // Get student profile (or create if not exists)
        $student = Student::firstOrCreate(
            ['user_id' => $user->id],
            [
                'nim' => 'TEMP-' . $user->id,
                'full_name' => $user->name,
                'email' => $user->email,
            ]
        );

        // Welcome message data
        $userName = $user->name;
        $totalPortfolios = $student->portfolios()->count();
        $approvedPortfolios = $student->portfolios()->where('status', 'approved')->count();
        
        // Calculate progress percentage
        $progressPercentage = $totalPortfolios > 0 
            ? round(($approvedPortfolios / $totalPortfolios) * 100) 
            : 0;

        // Current month for calendar
        $currentMonth = Carbon::now()->format('F Y');

        // Generate calendar days with portfolio dates
        $portfolioDates = $student->portfolios()
            ->whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->pluck('created_at')
            ->map(fn($date) => Carbon::parse($date)->day)
            ->unique()
            ->toArray();
        
        $calendarDays = $this->generateCalendarDays($portfolioDates);

        // Get recent portfolios (acting as certificates/messages)
        $certificates = $student->portfolios()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function($portfolio) {
                $initials = collect(explode(' ', $portfolio->title))
                    ->map(fn($word) => strtoupper(substr($word, 0, 1)))
                    ->take(2)
                    ->join('');
                
                return [
                    'id' => $portfolio->id,
                    'name' => $portfolio->category_name,
                    'initials' => $initials,
                    'color' => $portfolio->status_color,
                    'message' => $portfolio->title,
                    'description' => $portfolio->description,
                    'attachments' => [$portfolio->file_path],
                    'time' => $portfolio->created_at->format('h:i A'),
                    'status' => $portfolio->status,
                ];
            });

        // Get upcoming/pending portfolios
        $upcomingActivities = $student->portfolios()
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
                    'location' => $portfolio->category_name,
                    'category' => $portfolio->category,
                ];
            });

        // Chart data: Portfolio submissions over time (last 4 months)
        $chartData = $this->getPortfolioChartData($student);

        // Skills data for second chart
        $skillsData = $this->getSkillsChartData($student);

        return view('dashboard', compact(
            'userName',
            'progressPercentage',
            'currentMonth',
            'calendarDays',
            'certificates',
            'upcomingActivities',
            'chartData',
            'skillsData',
            'totalPortfolios',
            'approvedPortfolios',
            'student'
        ));
    }

    private function generateCalendarDays($portfolioDates = [])
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        
        // Get the day of week for the first day (Monday = 1, Sunday = 7)
        $startDayOfWeek = $startOfMonth->dayOfWeekIso;
        
        $days = [];
        
        // Add empty cells for days before the month starts
        for ($i = 1; $i < $startDayOfWeek; $i++) {
            $days[] = ['date' => null, 'isToday' => false, 'hasActivity' => false];
        }
        
        // Add all days of the month
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
        // Get last 4 months of portfolio submissions
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
        // Get student's skills vs total available skills
        $studentSkillsCount = $student->skills()->count();
        $totalSkillsCount = Skill::count();
        
        // Create dummy progression data for visualization
        $progression = collect([1, 2, 3, 4])->map(function($month) use ($studentSkillsCount) {
            return max(1, $studentSkillsCount - (4 - $month));
        });

        return [
            'current' => $studentSkillsCount,
            'total' => max($totalSkillsCount, 10), // Ensure at least 10 for good visualization
            'progression' => $progression,
        ];
    }
}