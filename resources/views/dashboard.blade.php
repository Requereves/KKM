<x-app-layout>
    
    @if($user->role === 'admin')
    
        {{-- ======================================================================= --}}
        {{-- TAMPILAN DASHBOARD ADMIN --}}
        {{-- ======================================================================= --}}

        <div class="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors mb-6">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {{ __('messages.welcome') }}, {{ explode(' ', $user->name)[0] }}! 👋
            </h1>
            <p class="text-slate-600 dark:text-slate-400">
                {{-- Menggunakan {!! !!} karena ada tag HTML span di dalam file bahasa --}}
                {!! __('messages.pending_alert', ['count' => $pendingCount]) !!}
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            
            <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-amber-500/50 transition-all">
                <div class="absolute right-0 top-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-outlined text-6xl text-amber-500">hourglass_empty</span>
                </div>
                {{-- TRANSLATION APPLIED --}}
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{{ __('messages.need_verification') }}</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ $pendingCount }} {{ __('messages.files') }}</h3>
                    @if($pendingCount > 0)
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20">
                        <span class="material-icons-outlined text-[10px]">priority_high</span>
                        Urgent
                    </span>
                    @endif
                </div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Butuh tindakan segera</p>
            </div>

            <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-indigo-600/50 transition-all">
                <div class="absolute right-0 top-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-outlined text-6xl text-indigo-600">school</span>
                </div>
                {{-- TRANSLATION APPLIED --}}
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{{ __('messages.total_students') }}</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ number_format($totalStudents) }}</h3>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20">
                        <span class="material-icons-outlined text-[10px]">trending_up</span>
                        Active
                    </span>
                </div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Terdaftar dalam sistem</p>
            </div>

            <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                <div class="absolute right-0 top-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-outlined text-6xl text-emerald-500">work</span>
                </div>
                {{-- TRANSLATION APPLIED --}}
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{{ __('messages.active_jobs') }}</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ $activeJobs }} {{ __('messages.positions') }}</h3>
                </div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Terbuka untuk pelamar</p>
            </div>

            <div class="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div class="absolute right-0 top-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
                    <span class="material-icons-outlined text-6xl text-purple-500">handshake</span>
                </div>
                {{-- TRANSLATION APPLIED --}}
                <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{{ __('messages.industry_partners') }}</p>
                <div class="flex items-baseline gap-2">
                    <h3 class="text-3xl font-bold text-slate-900 dark:text-white">{{ $partnersCount }}</h3>
                    <span class="text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20">
                        Verified
                    </span>
                </div>
                <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Kolaborasi aktif</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            
            <div class="lg:col-span-2">
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-full flex flex-col">
                    <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        {{-- TRANSLATION APPLIED --}}
                        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ __('messages.recent_requests') }}</h3>
                        {{-- TRANSLATION APPLIED --}}
                        <a href="{{ route('verification.index') }}" class="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline">{{ __('messages.view_all') }}</a>
                    </div>
                    <div class="overflow-x-auto flex-1">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
                                    <th class="px-5 py-3">Mahasiswa</th>
                                    <th class="px-5 py-3">Berkas</th>
                                    <th class="px-5 py-3">Kategori</th>
                                    <th class="px-5 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                @forelse($recentVerifications as $item)
                                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td class="px-5 py-3">
                                        <div class="flex flex-col">
                                            <span class="font-semibold text-slate-900 dark:text-white">{{ $item->student->full_name }}</span>
                                            <span class="text-[10px] text-slate-500 uppercase">{{ $item->student->nim }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3">
                                        <div class="flex flex-col">
                                            <span class="text-slate-700 dark:text-slate-300 font-medium truncate max-w-[150px]">{{ $item->title }}</span>
                                            <span class="text-[10px] text-slate-400 italic">...{{ substr($item->file_path, -15) }}</span>
                                        </div>
                                    </td>
                                    <td class="px-5 py-3">
                                        <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                                            {{ str_replace('_', ' ', $item->category) }}
                                        </span>
                                    </td>
                                    <td class="px-5 py-3 text-right">
                                        <a href="{{ route('verification.show', $item->id) }}" class="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-xs">
                                            Review
                                        </a>
                                    </td>
                                </tr>
                                @empty
                                <tr>
                                    <td colspan="4" class="px-5 py-8 text-center text-slate-500 text-sm">
                                        Tidak ada permintaan pending.
                                    </td>
                                </tr>
                                @endforelse
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-full transition-colors flex flex-col">
                {{-- TRANSLATION APPLIED --}}
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">{{ __('messages.quick_actions') }}</h3>
                <div class="space-y-3 flex-1">
                    <a href="#" class="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 group">
                        <div class="bg-white/20 p-2 rounded-lg">
                            <span class="material-icons-outlined text-xl">work</span>
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-sm">Tambah Lowongan</p>
                            <p class="text-xs text-indigo-100">Buat postingan pekerjaan baru</p>
                        </div>
                        <span class="material-icons-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                    </a>

                    <button class="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-all group">
                        <div class="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-2 rounded-lg group-hover:bg-amber-500/20">
                            <span class="material-icons-outlined text-xl">cast_for_education</span>
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-sm text-slate-900 dark:text-white">Info Pelatihan</p>
                            <p class="text-xs text-slate-500">Kelola jadwal training</p>
                        </div>
                    </button>

                    <button class="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-all group">
                        <div class="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-500 p-2 rounded-lg group-hover:bg-pink-500/20">
                            <span class="material-icons-outlined text-xl">rocket_launch</span>
                        </div>
                        <div class="text-left">
                            <p class="font-semibold text-sm text-slate-900 dark:text-white">Proyek Industri</p>
                            <p class="text-xs text-slate-500">Buka kesempatan proyek</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">Kompetensi Unggulan</h3>
                <div id="competencyChart" class="h-64 w-full flex items-center justify-center"></div>
            </div>

            <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 transition-colors">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Kesenjangan Skill (Skill Gap)</h3>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-3 text-[10px]">
                        <div class="flex items-center gap-1">
                            <span class="w-2.5 h-2.5 rounded-sm bg-indigo-600"></span>
                            <span class="text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Skill Mahasiswa</span>
                        </div>
                        <div class="flex items-center gap-1">
                            <span class="w-2.5 h-2.5 rounded-sm bg-slate-300 dark:bg-slate-600"></span>
                            <span class="text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Permintaan Industri</span>
                        </div>
                    </div>
                </div>
                <div id="skillChart" class="h-64 w-full"></div>
            </div>
        </div>

    @else
    
        {{-- ======================================================================= --}}
        {{-- TAMPILAN DASHBOARD MAHASISWA --}}
        {{-- ======================================================================= --}}
        {{-- (Bagian ini tidak saya ubah bahasanya dulu karena kamus 'messages.php' --}}
        {{-- kita tadi hanya fokus untuk Admin. Agar tidak error, biarkan default.) --}}

        <div class="space-y-6">
            
            <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h3 class="text-2xl font-bold mb-2">Welcome back, {{ $userName }}! 👋</h3>
                    <p class="text-gray-600 dark:text-gray-400">
                        Kamu memiliki <span class="font-semibold text-green-600 dark:text-green-400">{{ $approvedPortfolios }}</span>
                        portofolio disetujui dari total <span class="font-semibold">{{ $totalPortfolios }}</span> pengajuan
                        (<span class="font-semibold">{{ $progressPercentage }}%</span> approval rate).
                    </p>
                    <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Terus bangun portofolio dan tingkatkan skill kamu!
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Statistik Pengajuan</h4>
                        <span class="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                            4 Bulan Terakhir
                        </span>
                    </div>
                    <div class="relative h-64 w-full">
                        <canvas id="portfolioChart"></canvas>
                    </div>
                    <div class="mt-4 text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            Total: <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ $totalPortfolios }}</span> Portofolio
                        </p>
                    </div>
                </div>

                <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Progres Skill</h4>
                        <span class="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                            Current: {{ $skillsData['current'] }}
                        </span>
                    </div>
                    <div class="relative h-64 w-full">
                        <canvas id="skillsChart"></canvas>
                    </div>
                    <div class="mt-4 text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                        <p class="text-sm text-gray-600 dark:text-gray-400">
                            <span class="font-bold text-blue-600 dark:text-blue-400">{{ $skillsData['current'] }}</span>
                            Skill Dikuasai
                        </p>
                    </div>
                </div>
            </div>

            <div>
                <div class="flex justify-between items-end mb-4 px-1">
                    <div>
                        <h3 class="text-xl font-bold text-gray-800 dark:text-gray-200">Rekomendasi Untukmu 🎯</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Berdasarkan minat: <span class="font-semibold text-indigo-600 dark:text-indigo-400">Software Engineering</span></p>
                    </div>
                    <a href="#" class="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                        Lihat Semua
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>
            
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full overflow-hidden">
                        <div class="relative h-40 overflow-hidden">
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
                            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                <a href="#" class="block w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-gray-700 dark:text-gray-200 hover:text-white text-center rounded-lg font-semibold text-xs transition-all duration-300">
                                    Mulai Belajar →
                                </a>
                            </div>
                        </div>
                    </div>
            
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full overflow-hidden">
                        <div class="relative h-40 overflow-hidden">
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
                            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                <a href="#" class="block w-full py-2 px-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-600 text-green-700 dark:text-green-400 hover:text-white text-center rounded-lg font-semibold text-xs transition-all duration-300">
                                    Lanjutkan →
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full overflow-hidden">
                        <div class="relative h-40 overflow-hidden">
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
                            <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                <a href="#" class="block w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-purple-600 text-gray-700 dark:text-gray-200 hover:text-white text-center rounded-lg font-semibold text-xs transition-all duration-300">
                                    Mulai Belajar →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div class="lg:col-span-2">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                    Portofolio Terbaru
                                </h4>
                                <a href="#" class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                                    Lihat Semua
                                </a>
                            </div>

                            <div class="space-y-4">
                                @forelse($certificates as $cert)
                                <div onclick="openPortfolioModal(this)" 
                                    class="flex items-start justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600 group"
                                    
                                    data-id="{{ $cert['id'] }}" 
                                    data-title="{{ $cert['message'] }}"
                                    data-category="{{ $cert['name'] }}"
                                    data-status="{{ $cert['status'] }}"
                                    data-description="{{ $cert['description'] ?? 'Tidak ada deskripsi.' }}"
                                    {{-- Gunakan null check untuk feedback --}}
                                    data-feedback="{{ $cert['admin_feedback'] ?? 'Belum ada feedback.' }}"
                                >
                                    <div class="flex items-start space-x-4 pointer-events-none">
                                        <div class="flex-shrink-0 mt-1">
                                            <div class="w-10 h-10 rounded-full bg-{{ $cert['color'] ?? 'gray' }}-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white dark:ring-gray-800">
                                                {{ $cert['initials'] }}
                                            </div>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <div class="flex flex-wrap items-center gap-2 mb-1">
                                                <h5 class="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {{ $cert['message'] }}
                                                </h5>
                                                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide
                                                    {{ $cert['status'] === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : '' }}
                                                    {{ $cert['status'] === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : '' }}
                                                    {{ $cert['status'] === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : '' }}
                                                ">
                                                    {{ $cert['status'] }}
                                                </span>
                                            </div>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {{ Str::limit($cert['description'] ?? 'No description available', 80) }}
                                            </p>
                                            <p class="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                                <span class="material-icons-outlined text-[10px]">category</span> 
                                                {{ $cert['name'] }}
                                            </p>
                                        </div>
                                    </div>
                                    <span class="text-xs text-gray-400 whitespace-nowrap ml-2">{{ $cert['time'] }}</span>
                                </div>
                                @empty
                                <div class="text-center py-12 flex flex-col items-center">
                                    <span class="material-icons-outlined text-4xl text-gray-300 mb-2">folder_off</span>
                                    <p class="text-gray-500 dark:text-gray-400">Belum ada portofolio.</p>
                                </div>
                                @endforelse
                            </div>
                        </div>
                    </div>
                </div>

                <div class="space-y-6">
                    
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Kalender</h4>
                                <span class="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
                                    {{ $currentMonth }}
                                </span>
                            </div>

                            <div class="grid grid-cols-7 gap-1 text-center mb-2">
                                @foreach(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'] as $day)
                                <div class="text-xs font-bold text-gray-400 uppercase tracking-wider py-2">{{ $day }}</div>
                                @endforeach
                            </div>
                            
                            <div class="grid grid-cols-7 gap-1 text-center">
                                @foreach($calendarDays as $day)
                                <div class="aspect-square flex items-center justify-center p-0.5">
                                    @if($day['date'])
                                    <div class="w-full h-full rounded-lg flex items-center justify-center text-xs transition-all relative group
                                        {{ $day['isToday'] ? 'bg-indigo-600 text-white font-bold shadow-md' : '' }}
                                        {{ $day['hasActivity'] && !$day['isToday'] ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold border border-green-200 dark:border-green-800' : '' }}
                                        {{ !$day['hasActivity'] && !$day['isToday'] ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' : '' }}
                                    ">
                                        {{ $day['date'] }}
                                        @if($day['hasActivity'])
                                            <span class="absolute bottom-1 w-1 h-1 rounded-full {{ $day['isToday'] ? 'bg-white' : 'bg-green-500' }}"></span>
                                        @endif
                                    </div>
                                    @endif
                                </div>
                                @endforeach
                            </div>

                            <div class="mt-4 flex items-center justify-center gap-4 text-xs border-t border-gray-100 dark:border-gray-700 pt-3">
                                <div class="flex items-center gap-1.5">
                                    <div class="w-2 h-2 rounded-full bg-indigo-600"></div>
                                    <span class="text-gray-500">Hari ini</span>
                                </div>
                                <div class="flex items-center gap-1.5">
                                    <div class="w-2 h-2 rounded-full bg-green-500"></div>
                                    <span class="text-gray-500">Ada Kegiatan</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                        <div class="p-6">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-semibold text-lg text-gray-800 dark:text-gray-200">Pending Review</h4>
                                @if($upcomingActivities->count() > 0)
                                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900 text-xs font-bold text-yellow-800 dark:text-yellow-200">
                                    {{ $upcomingActivities->count() }}
                                </span>
                                @endif
                            </div>

                            <div class="space-y-3">
                                @forelse($upcomingActivities as $activity)
                                <div class="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                    <div class="flex-shrink-0 text-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1.5 min-w-[3rem]">
                                        <span class="block text-xs text-gray-500 uppercase">{{ Str::substr($activity['date'], 0, 3) }}</span>
                                        <span class="block text-lg font-bold text-gray-800 dark:text-gray-200">{{ $activity['day'] }}</span>
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <h5 class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                            {{ $activity['title'] }}
                                        </h5>
                                        <div class="flex items-center gap-2 mt-0.5">
                                            <span class="text-[10px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-800/50">
                                                Menunggu
                                            </span>
                                            <span class="text-xs text-gray-500 truncate">{{ $activity['location'] }}</span>
                                        </div>
                                    </div>
                                </div>
                                @empty
                                <div class="text-center py-6">
                                    <span class="material-icons-outlined text-green-500 text-3xl mb-1">task_alt</span>
                                    <p class="text-gray-500 dark:text-gray-400 text-sm">Semua aman!</p>
                                    <p class="text-xs text-gray-400 dark:text-gray-500">Tidak ada review tertunda</p>
                                </div>
                                @endforelse
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="portfolioModal" class="relative z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div class="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity opacity-100"></div>

            <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div class="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">
                        
                        <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white" id="modalTitle">
                                Detail Portofolio
                            </h3>
                            <button type="button" onclick="closePortfolioModal()" class="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span class="material-icons-outlined">close</span>
                            </button>
                        </div>

                        <div class="px-4 py-5 sm:p-6">
                            <div class="space-y-4">
                                <div>
                                    <span id="modalStatus" class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset">
                                        Status
                                    </span>
                                </div>

                                <div>
                                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
                                    <p id="modalCategory" class="text-sm font-medium text-gray-900 dark:text-gray-100">Category Name</p>
                                </div>

                                <div>
                                    <label class="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Deskripsi</label>
                                    <div class="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 max-h-32 overflow-y-auto" id="modalDescription">
                                        Deskripsi...
                                    </div>
                                </div>

                                <div class="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-3">
                                    <label class="block text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                        <span class="material-icons-outlined text-xs">comment</span> Feedback Admin
                                    </label>
                                    <p id="modalFeedback" class="text-sm text-gray-800 dark:text-gray-200 italic">
                                        No feedback.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100 dark:border-gray-700">
                            <a id="modalPdfLink" href="#" class="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto transition-colors items-center gap-2">
                                <span class="material-icons-outlined text-sm">visibility</span> Lihat Detail
                            </a>
                            <button type="button" onclick="closePortfolioModal()" class="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto transition-colors">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    @endif

    @push('scripts')
    
    @if($user->role === 'admin')
        <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const isDark = document.documentElement.classList.contains('dark');
                const textColor = isDark ? '#94a3b8' : '#64748b';

                // --- Chart 1: Competencies (Pie) ---
                const competencyOptions = {
                    series: @json($competencyData),
                    labels: @json($competencyLabels),
                    chart: {
                        type: 'donut',
                        height: 300,
                        fontFamily: 'inherit',
                        background: 'transparent'
                    },
                    colors: ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'],
                    stroke: { show: false },
                    dataLabels: { enabled: false },
                    legend: {
                        position: 'bottom',
                        labels: { colors: textColor }
                    },
                    tooltip: {
                        theme: isDark ? 'dark' : 'light'
                    },
                    plotOptions: {
                        pie: {
                            donut: {
                                size: '70%',
                                labels: {
                                    show: true,
                                    name: { color: textColor },
                                    value: { color: isDark ? '#fff' : '#1e293b' },
                                    total: {
                                        show: true,
                                        label: 'Total',
                                        color: textColor,
                                        formatter: function (w) {
                                            return w.globals.seriesTotals.reduce((a, b) => a + b, 0)
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                new ApexCharts(document.querySelector("#competencyChart"), competencyOptions).render();

                // --- Chart 2: Skill Gap (Bar) ---
                const skillOptions = {
                    series: [{
                        name: 'Skill Mahasiswa',
                        data: @json($skillData)
                    }, {
                        name: 'Permintaan Industri',
                        data: @json($industryDemandData)
                    }],
                    chart: {
                        type: 'bar',
                        height: 300,
                        toolbar: { show: false },
                        fontFamily: 'inherit',
                        background: 'transparent'
                    },
                    colors: ['#4F46E5', '#cbd5e1'],
                    plotOptions: {
                        bar: {
                            horizontal: false,
                            columnWidth: '55%',
                            borderRadius: 4
                        },
                    },
                    dataLabels: { enabled: false },
                    stroke: {
                        show: true,
                        width: 2,
                        colors: ['transparent']
                    },
                    xaxis: {
                        categories: @json($skillLabels),
                        labels: { style: { colors: textColor, fontSize: '10px' } },
                        axisBorder: { show: false },
                        axisTicks: { show: false }
                    },
                    yaxis: {
                        labels: { style: { colors: textColor } }
                    },
                    grid: {
                        borderColor: isDark ? '#334155' : '#e2e8f0',
                        strokeDashArray: 4,
                    },
                    legend: { show: false },
                    tooltip: {
                        theme: isDark ? 'dark' : 'light'
                    }
                };
                new ApexCharts(document.querySelector("#skillChart"), skillOptions).render();
            });
        </script>
    
    @else
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <script>
        document.addEventListener('DOMContentLoaded', function() {
            const isDarkMode = document.documentElement.classList.contains('dark');

            const colors = {
                text: isDarkMode ? '#9ca3af' : '#4b5563', // gray-400 : gray-600
                grid: isDarkMode ? '#374151' : '#e5e7eb', // gray-700 : gray-200
                indigo: {
                    line: '#6366f1',
                    fill: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                },
                blue: {
                    line: '#3b82f6',
                    fill: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
                }
            };

            const commonOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1, color: colors.text, font: { size: 10 } },
                        grid: { color: colors.grid, drawBorder: false }
                    },
                    x: {
                        ticks: { color: colors.text, font: { size: 10 } },
                        grid: { display: false }
                    }
                },
                elements: {
                    line: { tension: 0.4 },
                    point: { radius: 3, hitRadius: 10, hoverRadius: 5 }
                }
            };

            // 1. Portfolio Chart
            const portfolioCtx = document.getElementById('portfolioChart');
            if (portfolioCtx) {
                const portfolioData = @json($chartData);
                new Chart(portfolioCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: portfolioData.map(d => d.label),
                        datasets: [{
                            label: 'Pengajuan',
                            data: portfolioData.map(d => d.count),
                            borderColor: colors.indigo.line,
                            backgroundColor: colors.indigo.fill,
                            fill: true,
                            pointBackgroundColor: colors.indigo.line,
                            pointBorderColor: '#fff',
                        }]
                    },
                    options: commonOptions
                });
            }

            // 2. Skills Chart
            const skillsCtx = document.getElementById('skillsChart');
            if (skillsCtx) {
                const skillsData = @json($skillsData);
                new Chart(skillsCtx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                        datasets: [{
                            label: 'Skill Dikuasai',
                            data: skillsData.progression,
                            borderColor: colors.blue.line,
                            backgroundColor: colors.blue.fill,
                            fill: true,
                            pointBackgroundColor: colors.blue.line,
                            pointBorderColor: '#fff',
                        }]
                    },
                    options: commonOptions
                });
            }
        });

        // --- MODAL LOGIC ---
        const modal = document.getElementById('portfolioModal');

        window.openPortfolioModal = function(element) {
            // Get Data
            const title = element.getAttribute('data-title');
            const category = element.getAttribute('data-category');
            const status = element.getAttribute('data-status');
            const description = element.getAttribute('data-description');
            const feedback = element.getAttribute('data-feedback');
            const id = element.getAttribute('data-id');

            // Populate Modal
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalCategory').textContent = category;
            document.getElementById('modalDescription').textContent = description;
            document.getElementById('modalFeedback').textContent = feedback;
            
            // Dynamic Link
            const link = document.getElementById('modalPdfLink');
            link.href = "/portfolio/" + id; 

            // Status Badge Styling
            const statusEl = document.getElementById('modalStatus');
            statusEl.textContent = status.toUpperCase();
            statusEl.className = 'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset'; // Reset

            if (status === 'approved') {
                statusEl.classList.add('bg-green-50', 'text-green-700', 'ring-green-600/20', 'dark:bg-green-900/30', 'dark:text-green-400');
            } else if (status === 'rejected') {
                statusEl.classList.add('bg-red-50', 'text-red-700', 'ring-red-600/10', 'dark:bg-red-900/30', 'dark:text-red-400');
            } else {
                statusEl.classList.add('bg-yellow-50', 'text-yellow-800', 'ring-yellow-600/20', 'dark:bg-yellow-900/30', 'dark:text-yellow-300');
            }

            // Show Modal
            modal.classList.remove('hidden');
        }

        window.closePortfolioModal = function() {
            modal.classList.add('hidden');
        }

        // Escape Key Listener
        document.addEventListener('keydown', function(event) {
            if (event.key === "Escape") {
                closePortfolioModal();
            }
        });
        </script>
    @endif
    @endpush
</x-app-layout>