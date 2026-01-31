<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Dashboard') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mb-6">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3 class="text-2xl font-bold mb-2">Welcome back, {{ $userName }}! 👋</h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        You have <span class="font-semibold text-green-600 dark:text-green-400">{{ $approvedPortfolios }}</span> approved portfolios 
                        out of <span class="font-semibold">{{ $totalPortfolios }}</span> total submissions 
                        (<span class="font-semibold">{{ $progressPercentage }}%</span> approval rate).
                    </p>
                    <p class="text-gray-600 dark:text-gray-400">Keep building your portfolio and tracking your skills!</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Portfolio Submissions</h4>
                            <span class="text-sm text-gray-600 dark:text-gray-400">Last 4 Months</span>
                        </div>
                        <canvas id="portfolioChart" height="200"></canvas>
                        <div class="mt-4 text-center">
                            <p class="text-sm text-gray-600 dark:text-gray-400">Total: <span class="font-semibold">{{ $totalPortfolios }}</span> portfolios</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Skills Progress</h4>
                            <span class="text-sm text-gray-600 dark:text-gray-400">Current Skills: {{ $skillsData['current'] }}</span>
                        </div>
                        <canvas id="skillsChart" height="200"></canvas>
                        <div class="mt-4 text-center">
                            <p class="text-sm text-gray-600 dark:text-gray-400">
                                <span class="font-semibold text-blue-600 dark:text-blue-400">{{ $skillsData['current'] }}</span> skills acquired
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-8">
                <div class="flex justify-between items-end mb-4 px-1">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Recommended for You 🎯</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Based on your skills: <span class="font-semibold text-indigo-600 dark:text-indigo-400">Software Engineering</span></p>
                    </div>
                    <a href="#" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                        View All
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
            
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
                        <div class="relative overflow-hidden rounded-t-xl h-40">
                            <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80" 
                                 alt="Course" 
                                 class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-indigo-100">
                                Web Development
                            </div>
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <h4 class="text-md font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                Full Stack Laravel 11 & Vue.js: The Complete Guide
                            </h4>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">by Ghufroon Academy</p>
                            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 mt-auto">
                                <div class="flex items-center gap-1">
                                    <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <span class="font-semibold text-gray-700 dark:text-gray-300">4.8</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <span>12 Hours</span>
                                </div>
                            </div>
                            <a href="#" class="block w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-gray-700 dark:text-gray-200 hover:text-white text-center rounded-lg font-semibold text-xs transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-transparent">
                                Start Learning →
                            </a>
                        </div>
                    </div>
            
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
                        <div class="relative overflow-hidden rounded-t-xl h-40">
                            <img src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-600 shadow-sm border border-green-100">
                                UI/UX Design
                            </div>
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <h4 class="text-md font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors">
                                Mastering Figma: From Zero to Hero
                            </h4>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">by Design Masters</p>
                            
                            <div class="mt-auto mb-4">
                                <div class="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                    <span>Progress</span>
                                    <span>45%</span>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                                    <div class="bg-green-500 h-1.5 rounded-full" style="width: 45%"></div>
                                </div>
                            </div>
                            <a href="#" class="block w-full py-2 px-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-center rounded-lg font-semibold text-xs hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                                Continue Course
                            </a>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
                        <div class="relative overflow-hidden rounded-t-xl h-40">
                            <img src="https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500">
                            <div class="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-purple-600 shadow-sm border border-purple-100">
                                Database
                            </div>
                        </div>
                        <div class="p-5 flex flex-col flex-1">
                            <h4 class="text-md font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">
                                Advanced MySQL Optimization
                            </h4>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mb-4">by Database Pros</p>
                            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 mt-auto">
                                <div class="flex items-center gap-1">
                                    <svg class="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                                    <span class="font-semibold text-gray-700 dark:text-gray-300">5.0</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <span>8 Hours</span>
                                </div>
                            </div>
                            <a href="#" class="block w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-purple-600 dark:hover:bg-purple-500 text-gray-700 dark:text-gray-200 hover:text-white text-center rounded-lg font-semibold text-xs transition-all duration-300 border border-gray-200 dark:border-gray-600 hover:border-transparent">
                                Start Learning →
                            </a>
                        </div>
                    </div>
            
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Recent Portfolios</h4>
                                <a href="{{ route('dashboard') }}" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">View All</a>
                            </div>
                            
                            <div class="space-y-4">
                                @forelse($certificates as $cert)
                                <div class="flex items-start justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                                    <div class="flex items-start space-x-3">
                                        <div class="flex-shrink-0">
                                            <div class="w-10 h-10 rounded-full bg-{{ $cert['color'] }}-500 flex items-center justify-center text-white font-bold text-xs">
                                                {{ $cert['initials'] }}
                                            </div>
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2">
                                                <h5 class="font-semibold text-gray-900 dark:text-gray-100">{{ $cert['message'] }}</h5>
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                                    {{ $cert['status'] === 'approved' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : '' }}
                                                    {{ $cert['status'] === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200' : '' }}
                                                    {{ $cert['status'] === 'rejected' ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200' : '' }}
                                                ">
                                                    {{ ucfirst($cert['status']) }}
                                                </span>
                                            </div>
                                            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ Str::limit($cert['description'] ?? 'No description', 100) }}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">Category: {{ $cert['name'] }}</p>
                                        </div>
                                    </div>
                                    <span class="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap ml-4">{{ $cert['time'] }}</span>
                                </div>
                                @empty
                                <div class="text-center py-8">
                                    <p class="text-gray-500 dark:text-gray-400 mb-2">No portfolios yet</p>
                                    <p class="text-sm text-gray-400 dark:text-gray-500">Start uploading your work to track your progress!</p>
                                </div>
                                @endforelse
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Activity Calendar</h4>
                                <span class="text-sm text-gray-600 dark:text-gray-400">{{ $currentMonth }}</span>
                            </div>
                            
                            <div class="grid grid-cols-7 gap-1 text-center text-xs">
                                @foreach(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as $day)
                                <div class="font-semibold text-gray-600 dark:text-gray-400 py-2">{{ $day }}</div>
                                @endforeach
                                
                                @foreach($calendarDays as $day)
                                <div class="aspect-square flex items-center justify-center">
                                    @if($day['date'])
                                    <button class="w-7 h-7 rounded-full flex items-center justify-center text-xs
                                        {{ $day['isToday'] ? 'bg-indigo-600 text-white font-semibold' : '' }}
                                        {{ $day['hasActivity'] && !$day['isToday'] ? 'bg-green-500 text-white font-semibold' : '' }}
                                        {{ !$day['hasActivity'] && !$day['isToday'] ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700' : '' }}
                                    ">
                                        {{ $day['date'] }}
                                    </button>
                                    @endif
                                </div>
                                @endforeach
                            </div>
                            
                            <div class="mt-4 flex items-center gap-3 text-xs">
                                <div class="flex items-center gap-1">
                                    <div class="w-3 h-3 rounded-full bg-indigo-600"></div>
                                    <span class="text-gray-600 dark:text-gray-400">Today</span>
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span class="text-gray-600 dark:text-gray-400">Submitted</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Pending Reviews</h4>
                                @if($upcomingActivities->count() > 0)
                                <span class="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full font-semibold">
                                    {{ $upcomingActivities->count() }}
                                </span>
                                @endif
                            </div>
                            
                            <div class="space-y-3">
                                @forelse($upcomingActivities as $activity)
                                <div class="flex items-start space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                                    <div class="flex-shrink-0">
                                        <div class="w-10 h-10 rounded-full bg-{{ $activity['color'] }}-500 flex items-center justify-center text-white font-bold text-xs">
                                            {{ $activity['day'] }}
                                        </div>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h5 class="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{{ $activity['title'] }}</h5>
                                        <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ $activity['date'] }}</p>
                                        <p class="text-xs text-yellow-600 dark:text-yellow-400 font-medium mt-1">⏳ {{ $activity['time'] }}</p>
                                        <p class="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">{{ $activity['location'] }}</p>
                                    </div>
                                </div>
                                @empty
                                <div class="text-center py-6">
                                    <p class="text-gray-500 dark:text-gray-400 text-sm">✅ All caught up!</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">No pending reviews</p>
                                </div>
                                @endforelse
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Detect if dark mode is active
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        // Define colors based on theme
        const colors = {
            text: isDarkMode ? '#e5e7eb' : '#374151',
            grid: isDarkMode ? '#374151' : '#e5e7eb',
            blue: {
                line: 'rgb(59, 130, 246)',
                fill: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            },
            green: {
                line: 'rgb(34, 197, 94)',
                fill: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
            }
        };

        // Portfolio Submissions Chart
        const portfolioCtx = document.getElementById('portfolioChart').getContext('2d');
        const portfolioData = @json($chartData);
        
        new Chart(portfolioCtx, {
            type: 'line',
            data: {
                labels: portfolioData.map(d => d.label),
                datasets: [{
                    label: 'Submissions',
                    data: portfolioData.map(d => d.count),
                    borderColor: colors.blue.line,
                    backgroundColor: colors.blue.fill,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: colors.blue.line,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: colors.text
                        },
                        grid: {
                            color: colors.grid
                        }
                    },
                    x: {
                        ticks: {
                            color: colors.text
                        },
                        grid: {
                            color: colors.grid
                        }
                    }
                }
            }
        });

        // Skills Progress Chart
        const skillsCtx = document.getElementById('skillsChart').getContext('2d');
        const skillsData = @json($skillsData);
        
        new Chart(skillsCtx, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: 'Skills Acquired',
                    data: skillsData.progression,
                    borderColor: colors.green.line,
                    backgroundColor: colors.green.fill,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: colors.green.line,
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1,
                            color: colors.text
                        },
                        grid: {
                            color: colors.grid
                        }
                    },
                    x: {
                        ticks: {
                            color: colors.text
                        },
                        grid: {
                            color: colors.grid
                        }
                    }
                }
            }
        });
    </script>
    @endpush
</x-app-layout>