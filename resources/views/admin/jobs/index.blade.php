<x-app-layout>
    <div x-data="jobManager()" x-init="init()">
        <div class="space-y-6 animate-in fade-in duration-500">
            
            <!-- Header -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ __('Pekerjaan') }}</h1>
                    <p class="text-slate-500 dark:text-slate-400 text-sm">{{ __('Kelola lowongan pekerjaan dan pelamar Anda') }}</p>
                </div>
                <a href="{{ route('jobs.create') }}" 
                   class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                    <span class="material-icons-outlined text-lg">add</span>
                    {{ __('Tambah Pekerjaan') }}
                </a>
            </div>

            <!-- Filters & Search -->
            <div class="flex flex-col md:flex-row gap-4">
                <div class="relative flex-1">
                    <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input 
                        type="text" 
                        x-model="search"
                        placeholder="{{ __('Cari judul, perusahaan, atau lokasi...') }}"
                        class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
                    />
                </div>
                <div class="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shrink-0 overflow-x-auto">
                    <template x-for="f in ['all', 'active', 'closed', 'draft']">
                        <button
                            @click="filter = f"
                            :class="filter === f ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'"
                            class="px-4 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-all"
                            x-text="f === 'all' ? 'Semua' : f"
                        ></button>
                    </template>
                </div>
            </div>

            <!-- Jobs Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <template x-for="job in filteredJobs" :key="job.id">
                    <div 
                        @click="detailsModalJob = job"
                        class="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
                    >
                        <div class="p-5 flex items-start gap-4">
                            <img :src="job.logo" :alt="job.company" class="w-12 h-12 rounded-lg object-cover shadow-sm bg-slate-50 dark:bg-slate-800" />
                            <div class="flex-1 min-w-0">
                                <h3 class="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" x-text="job.title"></h3>
                                <p class="text-xs text-slate-500 dark:text-slate-400 truncate" x-text="job.company"></p>
                                <div class="flex items-center gap-2 mt-2">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700" x-text="job.type"></span>
                                    <span :class="{
                                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500': job.status === 'active',
                                        'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-500': job.status === 'closed',
                                        'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500': job.status === 'draft'
                                    }" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" x-text="job.status"></span>
                                </div>
                            </div>
                        </div>
                        
                        <div class="px-5 pb-5 flex-1">
                            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                                <span class="material-icons-outlined text-sm">location_on</span>
                                <span x-text="job.location"></span>
                            </div>
                            <div class="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                <span class="material-icons-outlined text-sm">payments</span>
                                <span x-text="job.salary"></span>
                            </div>
                        </div>

                        <div class="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 rounded-b-xl flex justify-between items-center">
                            <div class="flex -space-x-2">
                                <template x-if="job.applicantsCount > 0">
                                    <span class="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-[8px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center justify-center border-2 border-white dark:border-slate-800" x-text="job.applicantsCount"></span>
                                </template>
                                <template x-if="job.applicantsCount === 0">
                                    <span class="text-[10px] text-slate-400 italic">No applicants</span>
                                </template>
                            </div>
                            <span class="text-[10px] font-mono text-slate-400">
                                Exp: <span x-text="job.expiresAt"></span>
                            </span>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Empty State -->
            <div x-show="filteredJobs.length === 0" class="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <span class="material-icons-outlined text-6xl text-slate-200 dark:text-slate-800">work_off</span>
                <p class="text-slate-500 italic">No jobs found.</p>
            </div>
        </div>

        <!-- Job Detail Modal -->
        <div x-show="detailsModalJob" 
             x-transition.opacity
             class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm"
             style="display: none;">
            
            <div @click="detailsModalJob = null" class="absolute inset-0"></div>

            <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] relative">
                <!-- Modal Header -->
                <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                    <div class="flex items-center gap-4">
                        <img :src="detailsModalJob?.logo" class="w-16 h-16 rounded-xl object-cover shadow-md bg-white" />
                        <div>
                            <h2 class="text-xl font-bold text-slate-900 dark:text-white" x-text="detailsModalJob?.title"></h2>
                            <p class="text-slate-500 dark:text-slate-400 font-medium" x-text="detailsModalJob?.company"></p>
                        </div>
                    </div>
                    <button @click="detailsModalJob = null" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400">
                        <span class="material-icons-outlined">close</span>
                    </button>
                </div>
                
                <!-- Modal Body -->
                <div class="p-6 overflow-y-auto">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 space-y-6">
                            <div>
                                <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase mb-2">Deskripsi</h3>
                                <p class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap" x-text="detailsModalJob?.description"></p>
                            </div>
                            <div>
                                <h3 class="text-xs font-bold text-slate-900 dark:text-white uppercase mb-2">Persyaratan</h3>
                                <ul class="list-disc pl-5 space-y-1">
                                    <template x-for="req in detailsModalJob?.requirements">
                                        <li class="text-sm text-slate-600 dark:text-slate-300" x-text="req"></li>
                                    </template>
                                </ul>
                            </div>
                        </div>

                        <!-- Sidebar Info -->
                        <div class="space-y-4">
                            <div class="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                                <div>
                                    <label class="text-[10px] text-slate-400 uppercase font-bold block">Gaji</label>
                                    <p class="text-sm font-semibold text-slate-900 dark:text-white" x-text="detailsModalJob?.salary"></p>
                                </div>
                                <div>
                                    <label class="text-[10px] text-slate-400 uppercase font-bold block">Lokasi</label>
                                    <p class="text-sm font-semibold text-slate-900 dark:text-white" x-text="detailsModalJob?.location"></p>
                                </div>
                            </div>
                            
                            <div class="flex flex-col gap-2">
                                <a :href="'/admin/jobs/' + detailsModalJob?.id + '/applicants'" 
                                   class="w-full py-2 bg-indigo-600 text-center text-white rounded-lg text-sm font-bold shadow-lg">
                                    Lihat Pelamar (<span x-text="detailsModalJob?.applicantsCount"></span>)
                                </a>
                                <div class="flex gap-2">
                                    <a :href="'/admin/jobs/' + detailsModalJob?.id + '/edit'" 
                                       class="flex-1 py-2 bg-slate-100 dark:bg-slate-800 text-center text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium">
                                        Edit
                                    </a>
                                    <button @click="deleteId = detailsModalJob.id; detailsModalJob = null" 
                                            class="flex-1 py-2 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium">
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div x-show="deleteId" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md" style="display: none;">
            <div class="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl p-6 text-center">
                <h3 class="text-xl font-bold text-slate-900 dark:text-white">Konfirmasi Hapus</h3>
                <p class="text-sm text-slate-500 mt-2 mb-6">Apakah Anda yakin ingin menghapus lowongan ini?</p>
                <div class="flex gap-3">
                    <button @click="deleteId = null" class="flex-1 py-2 bg-slate-100 rounded-xl">Batal</button>
                    <form :action="'/admin/jobs/' + deleteId" method="POST" class="flex-1">
                        @csrf
                        @method('DELETE')
                        <button type="submit" class="w-full py-2 bg-rose-600 text-white rounded-xl">Hapus</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    @push('scripts')
    <script>
        function jobManager() {
            return {
                search: '',
                filter: 'all',
                jobs: @json($jobs),
                detailsModalJob: null,
                deleteId: null,

                get filteredJobs() {
                    return this.jobs.filter(job => {
                        const matchesFilter = this.filter === 'all' || job.status === this.filter;
                        const matchesSearch = 
                            job.title.toLowerCase().includes(this.search.toLowerCase()) || 
                            job.company.toLowerCase().includes(this.search.toLowerCase()) ||
                            job.location.toLowerCase().includes(this.search.toLowerCase());
                        return matchesFilter && matchesSearch;
                    });
                }
            }
        }
    </script>
    @endpush
</x-app-layout>