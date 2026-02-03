<header class="sticky top-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 shadow-sm transition-colors">
    <button @click="sidebarOpen = !sidebarOpen" class="md:hidden text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white">
        <span class="material-icons-outlined">menu</span>
    </button>
    
    <div class="ml-auto flex items-center gap-2 sm:gap-4">
        
        @php
            // Logika Toggle: Jika ID ubah ke EN, jika EN ubah ke ID
            $currentLocale = app()->getLocale();
            $targetLocale = $currentLocale == 'id' ? 'en' : 'id';
        @endphp

        <a href="{{ route('lang.switch', $targetLocale) }}" 
           class="h-10 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
           title="Ganti ke Bahasa {{ strtoupper($targetLocale) }}">
            <span class="material-icons-outlined text-lg">language</span>
            <span class="text-xs font-bold uppercase">{{ $currentLocale }}</span>
            <span class="text-[10px] text-slate-400">
                <span class="material-icons-outlined text-sm">swap_horiz</span>
            </span>
        </a>

        <button 
            @click="toggleTheme()"
            class="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
            :title="darkMode ? 'Switch to Light' : 'Switch to Dark'">
            <span x-show="!darkMode" class="material-icons-outlined">dark_mode</span>
            <span x-show="darkMode" class="material-icons-outlined" style="display: none;">light_mode</span>
        </button>

        <div class="relative" x-data="{ showNotifications: false }">
            <button 
                @click="showNotifications = !showNotifications"
                @click.outside="showNotifications = false"
                class="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative">
                <span class="material-icons-outlined">notifications</span>
                
                {{-- Logic Notifikasi Badge --}}
                @if(isset($pendingVerifications) && count($pendingVerifications) > 0)
                    <span class="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                @endif
            </button>

            <div x-show="showNotifications"
                 x-transition:enter="transition ease-out duration-100"
                 x-transition:enter-start="transform opacity-0 scale-95"
                 x-transition:enter-end="transform opacity-100 scale-100"
                 x-transition:leave="transition ease-in duration-75"
                 x-transition:leave-start="transform opacity-100 scale-100"
                 x-transition:leave-end="transform opacity-0 scale-95"
                 class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                 style="display: none;">
                
                <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h4 class="font-bold text-slate-800 dark:text-white">Notifikasi</h4>
                    @if(isset($pendingVerifications) && count($pendingVerifications) > 0)
                        <a href="{{ route('verification.index') ?? '#' }}" class="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider hover:underline">
                            Lihat Semua
                        </a>
                    @endif
                </div>

                <div class="max-h-64 overflow-y-auto">
                    @forelse($pendingVerifications ?? [] as $item)
                        <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex gap-3 bg-indigo-50/30 dark:bg-indigo-900/10">
                            <div class="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-indigo-600"></div>
                            <div>
                                <p class="text-xs font-medium text-slate-800 dark:text-slate-200">
                                    {{ $item->name ?? 'Mahasiswa' }} mengunggah {{ $item->category ?? 'dokumen' }}
                                </p>
                                <p class="text-[10px] text-slate-500 mt-1">
                                    {{ \Carbon\Carbon::parse($item->created_at)->diffForHumans() }}
                                </p>
                            </div>
                        </div>
                    @empty
                        <div class="p-4 text-center text-slate-500 text-sm">
                            Tidak ada notifikasi baru
                        </div>
                    @endforelse
                </div>
            </div>
        </div>
        
        <div x-data="{ open: false }" class="relative">
            <div @click="open = !open" @click.outside="open = false" 
                 class="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1 rounded-lg transition-colors group">
                
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {{ Auth::user()->name ?? 'Guest' }}
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400 capitalize">
                        {{ Auth::user()->role ?? 'Guest' }}
                    </p>
                </div>
                
                @php
                    // Handle avatar path sesuai database (misal: avatars/xxx.png)
                    $avatar = Auth::user() && Auth::user()->avatar 
                        ? asset('storage/' . Auth::user()->avatar) 
                        : 'https://ui-avatars.com/api/?name='.urlencode(Auth::user()->name ?? 'Guest').'&background=random';
                @endphp
                
                <img alt="User Avatar" 
                     class="w-9 h-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all object-cover" 
                     src="{{ $avatar }}" />
            </div>

            <div x-show="open" 
                 x-transition 
                 class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-slate-700" 
                 style="display: none;">
                <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Profile</a>
                <form method="POST" action="{{ route('logout') }}">
                    @csrf
                    <button type="submit" class="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                        Log Out
                    </button>
                </form>
            </div>
        </div>

    </div>
</header>