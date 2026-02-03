<x-app-layout>
    <div class="space-y-6 animate-in fade-in duration-500">
        
        <!-- Header & Tabs -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Verifikasi Berkas</h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm">
                    Kelola dan verifikasi berkas kompetensi mahasiswa.
                </p>
            </div>
            
            <!-- Tab Navigation -->
            <div class="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1 overflow-x-auto">
                @foreach(['all', 'pending', 'approved', 'rejected'] as $tab)
                    <a href="{{ route('verification.index', ['status' => $tab]) }}"
                       class="px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all flex items-center gap-2 whitespace-nowrap
                       {{ $status === $tab 
                          ? 'bg-indigo-600 text-white shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400' 
                       }}">
                        {{ $tab == 'all' ? 'Semua' : ucfirst($tab) }}
                        
                        <!-- Badge Count -->
                        <span class="text-[10px] px-1.5 py-0.5 rounded-full 
                            {{ $status === $tab ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' }}">
                            {{ $counts[$tab] ?? 0 }}
                        </span>
                    </a>
                @endforeach
            </div>
        </div>

        <!-- Search Bar -->
        <form method="GET" action="{{ route('verification.index') }}" class="relative">
            <input type="hidden" name="status" value="{{ $status }}">
            <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
                type="text" 
                name="search"
                value="{{ $search }}"
                placeholder="Cari Mahasiswa, NIM, atau Judul Berkas..." 
                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200"
            />
        </form>

        <!-- Alert Success Message -->
        @if(session('success'))
            <div class="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
                <span class="material-icons-outlined text-base">check_circle</span>
                <span>{!! session('success') !!}</span>
            </div>
        @endif

        <!-- Table -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
                            <th class="px-6 py-4">Mahasiswa</th>
                            <th class="px-6 py-4">Berkas Portfolio</th>
                            <th class="px-6 py-4">Kategori</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        @forelse($portfolios as $item)
                            <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="font-semibold text-slate-900 dark:text-white">
                                            {{ $item->student->full_name ?? 'N/A' }}
                                        </span>
                                        <span class="text-[10px] text-slate-500 uppercase tracking-tighter">
                                            {{ $item->student->nim ?? '-' }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="flex flex-col">
                                        <span class="text-slate-700 dark:text-slate-300 font-medium">
                                            {{ $item->title }}
                                        </span>
                                        <span class="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                                            {{ Str::limit($item->file_path, 30) }}
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                                        {{ str_replace('_', ' ', $item->category) }}
                                    </span>
                                </td>
                                <td class="px-6 py-4">
                                    @php
                                        $colors = [
                                            'pending' => 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500',
                                            'approved' => 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500',
                                            'rejected' => 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-500'
                                        ];
                                        $class = $colors[$item->status] ?? $colors['pending'];
                                    @endphp
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase {{ $class }}">
                                        {{ $item->status }}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <a href="{{ route('verification.show', $item->id) }}" 
                                       class="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-xs inline-flex items-center justify-end gap-1">
                                        <span class="material-icons-outlined text-sm">visibility</span> Detail
                                    </a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5" class="px-6 py-20 text-center">
                                    <div class="flex flex-col items-center justify-center space-y-3">
                                        <span class="material-icons-outlined text-6xl text-slate-200 dark:text-slate-800">folder_off</span>
                                        <p class="text-slate-500 italic">Data berkas tidak ditemukan.</p>
                                    </div>
                                </td>
                            </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
            
            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-800">
                {{ $portfolios->links() }}
            </div>
        </div>
    </div>
</x-app-layout>