<div x-show="sidebarOpen" 
     x-transition:enter="transition-opacity ease-linear duration-300"
     x-transition:enter-start="opacity-0"
     x-transition:enter-end="opacity-100"
     x-transition:leave="transition-opacity ease-linear duration-300"
     x-transition:leave-start="opacity-100"
     x-transition:leave-end="opacity-0"
     @click="sidebarOpen = false"
     class="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm md:hidden" 
     style="display: none;">
</div>

<aside :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
       class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col h-screen flex-shrink-0">
    
    <div class="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl cursor-pointer">
            <span class="material-icons-outlined text-yellow-500 dark:text-yellow-400">school</span>
            <span>KKM APP</span>
        </div>
        <button @click="sidebarOpen = false" class="md:hidden ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400">
            <span class="material-icons-outlined">close</span>
        </button>
    </div>

    <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        @php
            // 1. Cek Role User untuk menentukan arah Dashboard
            // Default ke 'dashboard' (mahasiswa) jika role tidak terbaca
            $userRole = auth()->user()->role ?? 'mahasiswa'; 
            $dashboardRoute = $userRole === 'admin' ? 'admin.dashboard' : 'dashboard';

            // 2. Definisi Menu dengan TRANSLATION (Fitur Bahasa)
            $menus = [
                [
                    'route' => $dashboardRoute, 
                    'active' => $dashboardRoute, // Highlight jika persis di dashboard
                    'label' => __('messages.dashboard'), // 👈 Mengambil teks dari kamus
                    'icon' => 'dashboard'
                ],
                [
                    'route' => 'verification.index', 
                    'active' => 'verification.*',    // Highlight nyala untuk semua halaman verifikasi (termasuk detail)
                    'label' => __('messages.verification'), // 👈 Mengambil teks dari kamus
                    'icon' => 'verified', 
                    'badge' => isset($pendingVerificationsCount) ? $pendingVerificationsCount : 0 
                ],
                [
                    'route' => 'students.index', 
                    'active' => 'students.*',
                    'label' => __('messages.students'), // 👈 Mengambil teks dari kamus
                    'icon' => 'people'
                ],
                [
                    'route' => 'jobs.index', 
                    'active' => 'jobs.*',
                    'label' => __('messages.jobs'), // 👈 Mengambil teks dari kamus
                    'icon' => 'work_outline'
                ],
                [
                    'route' => 'courses.index', 
                    'active' => 'courses.*',
                    'label' => __('messages.training'), // 👈 Mengambil teks dari kamus
                    'icon' => 'auto_stories'
                ],
                [
                    'route' => 'cms.index', 
                    'active' => 'cms.*',
                    'label' => __('messages.cms'), // 👈 Mengambil teks dari kamus
                    'icon' => 'campaign'
                ],
                [
                    'route' => 'stats.index', 
                    'active' => 'stats.*',
                    'label' => __('messages.stats'), // 👈 Mengambil teks dari kamus
                    'icon' => 'analytics'
                ],
            ];
        @endphp

        @foreach($menus as $menu)
            @php
                // Logika Pintar: Cek 'active' pattern kalau ada, kalau tidak pakai 'route' biasa
                $checkPattern = $menu['active'] ?? $menu['route'];
                $isActive = request()->routeIs($checkPattern);
                
                // Safety Check: Pastikan route ada sebelum dipanggil biar gak error 
                // (Berguna jika temanmu belum selesai bikin route Mahasiswa/Lowongan)
                $url = Route::has($menu['route']) ? route($menu['route']) : '#';
            @endphp
            
            <a href="{{ $url }}"
               class="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors group relative
               {{ $isActive 
                  ? 'bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border-l-4 border-indigo-600' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800' }}">
                
                <div class="flex items-center gap-3">
                    <span class="material-icons-outlined text-lg {{ $isActive ? 'text-indigo-600 dark:text-indigo-400' : 'group-hover:text-indigo-600 dark:group-hover:text-indigo-400' }}">
                        {{ $menu['icon'] }}
                    </span>
                    {{ $menu['label'] }}
                </div>

                @if(isset($menu['badge']) && $menu['badge'] > 0)
                    <span class="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                        {{ $menu['badge'] }}
                    </span>
                @endif
            </a>
        @endforeach
    </nav>

    <div class="p-4 border-t border-slate-200 dark:border-slate-800">
        <form method="POST" action="{{ route('logout') }}">
            @csrf
            <button type="submit" class="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <span class="material-icons-outlined text-lg">logout</span>
                Keluar
            </button>
        </form>
    </div>
</aside>