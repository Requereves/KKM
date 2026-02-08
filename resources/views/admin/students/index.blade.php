<x-app-layout>
    <!-- Bagian Header (Opsional, akan muncul di bagian atas halaman) -->
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Students Management') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <!-- Konten Utama Anda -->
            <div x-data="studentManager()" x-init="init()">
                <div class="space-y-6 animate-in fade-in duration-500">
                    <!-- Header Konten -->
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl font-bold text-slate-900 dark:text-white">{{ __('Students') }}</h1>
                            <p class="text-slate-500 dark:text-slate-400 text-sm">
                                {{ __('Total Students') }}: <span x-text="students.length"></span>
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button 
                                @click="exportCSV()"
                                class="px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                            >
                                <span class="material-icons-outlined text-lg">download</span>
                                Export CSV
                            </button>
                        </div>
                    </div>

                    <!-- Search and Filters -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="md:col-span-2 relative">
                            <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                            <input 
                                type="text" 
                                x-model="search"
                                placeholder="{{ __('Search student...') }}" 
                                class="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
                            />
                        </div>
                        <div>
                            <select 
                                x-model="majorFilter"
                                class="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
                            >
                                <option value="all">Semua Jurusan / All Majors</option>
                                <template x-for="major in majors" :key="major">
                                    <option :value="major" x-text="major"></option>
                                </template>
                            </select>
                        </div>
                    </div>

                    <!-- Students Table -->
                    <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
                                        <th class="px-6 py-4">{{ __('Student') }}</th>
                                        <th class="px-6 py-4">{{ __('Major') }} / {{ __('Year') }}</th>
                                        <th class="px-6 py-4">{{ __('Phone') }}</th>
                                        <th class="px-6 py-4">{{ __('Skills') }}</th>
                                        <th class="px-6 py-4 text-center">{{ __('Status') }}</th>
                                        <th class="px-6 py-4 text-right">{{ __('Action') }}</th>
                                        <th class="px-6 py-4 text-right">{{ __('Edit') }}</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    <template x-for="student in filteredStudents" :key="student.id">
                                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td class="px-6 py-4">
                                                <div class="flex items-center gap-3">
                                                    <img :src="student.avatar" class="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" />
                                                    <div>
                                                        <p class="font-semibold text-slate-900 dark:text-white" x-text="student.fullName"></p>
                                                        <p class="text-[10px] text-slate-500 uppercase tracking-wider" x-text="student.nim"></p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4">
                                                <div class="flex flex-col">
                                                    <span class="text-slate-700 dark:text-slate-300 font-medium" x-text="student.major"></span>
                                                    <span class="text-[10px] text-slate-500" x-text="student.yearOfEntry"></span>
                                                </div>
                                            </td>
                                            <td class="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs" x-text="student.phone"></td>


                                           <td class="px-6 py-4">
                                                <div class="flex flex-wrap gap-1.5 items-center">
                                                    <!-- Loop untuk menampilkan 2 skill pertama -->
                                                    <template x-for="(skill, index) in student.skills.slice(0, 2)" :key="index">
                                                        <span class="px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50 uppercase tracking-tight">
                                                            <span x-text="skill.name"></span>
                                                            <!-- <code class="text-[10px]" x-text="JSON.stringify(student.skills)"></code> -->
                                                        </span>
                                                    </template>

                                                    <!-- Jika skill lebih dari 2, tampilkan badge -->
                                                    <template x-if="student.skills.length > 2">
                                                        <span class="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
                                                            x-text="`+${student.skills.length - 2}`">
                                                        </span>
                                                    </template>
                                                    
                                                    <!-- Jika tidak punya skill sama sekali -->
                                                    <template x-if="student.skills.length === 0">
                                                        <span class="text-[11px] text-slate-400 italic">No skills</span>
                                                    </template>
                                                </div>
                                            </td>


                                            <!-- Status -->
                                            <td class="px-6 py-4 text-center">
                                                <div class="flex justify-center items-center gap-2">
                                                    <!-- Titik Indikator -->
                                                    <span class="relative flex h-2 w-2" x-show="student.status === 'active'">
                                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                                    </span>
                                                    <span class="h-2 w-2 rounded-full bg-slate-300" x-show="student.status === 'inactive'"></span>
                                                    
                                                    <!-- Label Status -->
                                                    <span :class="{
                                                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500': student.status === 'active',
                                                            'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400': student.status === 'inactive'
                                                        }"
                                                        class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase" 
                                                        x-text="student.status">
                                                    </span>
                                                </div>
                                            </td>

                                            <td class="px-6 py-4 text-center">
                                                <button 
                                                    @click="selectedStudent = student"
                                                    class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                >
                                                    <span class="material-icons-outlined text-lg">visibility</span>
                                                </button>
                                            </td>

                                            <!-- Edit -->
                                            <td class="px-6 py-4 text-right">
                                                 <a 
                                                    :href="'/admin/students/' + student.id + '/edit'"
                                                    class="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-amber-600 transition-colors"
                                                 >
                                                    <span class="material-icons-outlined text-lg">edit</span>
                                            </td>

                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                            
                            <!-- Empty State -->
                            <div x-show="filteredStudents.length === 0" class="py-16 text-center">
                                <span class="material-icons-outlined text-5xl text-slate-200 dark:text-slate-800 mb-2">school</span>
                                <p class="text-slate-500 text-sm">Tidak ada data mahasiswa ditemukan.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Student Detail Modal -->
                <div x-show="selectedStudent" 
                     x-transition:enter="transition ease-out duration-200"
                     x-transition:enter-start="opacity-0"
                     x-transition:enter-end="opacity-100"
                     class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" 
                     style="display: none;">
                    
                    <div @click="selectedStudent = null" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

                    <div class="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] relative animate-in slide-in-from-bottom-4 duration-300">
                        <!-- Header Modal -->
                        <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                            <div class="flex items-center gap-4">
                                <img :src="selectedStudent?.avatar" class="w-16 h-16 rounded-full border-2 border-white dark:border-slate-700 shadow-md object-cover" />
                                <div>
                                    <h2 class="text-xl font-bold text-slate-900 dark:text-white leading-tight" x-text="selectedStudent?.fullName"></h2>
                                    <div class="flex flex-col mt-1 gap-1">
                                        <p class="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide">
                                            NIM: <span x-text="selectedStudent?.nim"></span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button @click="selectedStudent = null" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                                <span class="material-icons-outlined">close</span>
                            </button>
                        </div>
                        
                        <div class="p-8 overflow-y-auto">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div class="space-y-6">
                                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <span class="material-icons-outlined text-sm">badge</span> Informasi Umum
                                    </h3>
                                    <div class="space-y-4">
                                        <div class="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Jurusan</label>
                                            <p class="text-sm font-semibold text-slate-900 dark:text-white" x-text="selectedStudent?.major"></p>
                                        </div>
                                        <div class="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                                            <label class="text-[10px] text-slate-400 uppercase font-bold block mb-1">Email</label>
                                            <p class="text-sm font-semibold text-slate-900 dark:text-white truncate" x-text="selectedStudent?.email"></p>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                        <span class="material-icons-outlined text-sm">psychology</span> Skills
                                    </h3>
                                    <div class="flex flex-wrap gap-2">
                                        <template x-for="skill in selectedStudent?.skills" :key="skill">
                                            <span class="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30" x-text="skill"></span>
                                        </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    @push('scripts')
    <script>
        function studentManager() {
            return {
                search: '',
                majorFilter: 'all',
                selectedStudent: null,
                students: @json($students), 
                majors: [],

                init() {
                    this.majors = [...new Set(this.students.map(s => s.major).filter(Boolean))].sort();
                },

                get filteredStudents() {
                    const searchTerm = this.search.toLowerCase().trim();
                    return this.students.filter(student => {
                        const matchesSearch = 
                            (student.fullName || '').toLowerCase().includes(searchTerm) || 
                            (student.nim || '').toLowerCase().includes(searchTerm) || 
                            (student.email || '').toLowerCase().includes(searchTerm);
                        const matchesMajor = this.majorFilter === 'all' || student.major === this.majorFilter;
                        return matchesSearch && matchesMajor;
                    });
                },

                exportCSV() {
                    const headers = ['Name', 'NIM', 'Major', 'Year', 'Email', 'Phone', 'Status', 'Skills'];
                    const rows = this.filteredStudents.map(s => {
                        return [
                            `"${(s.fullName || '').replace(/"/g, '""')}"`,
                            `"${s.nim || ''}"`,
                            `"${s.major || ''}"`,
                            `"${s.yearOfEntry || ''}"`,
                            `"${s.email || ''}"`,
                            `"${s.phone || ''}"`,
                            `"${s.status || ''}"`,
                            `"${(s.skills || []).join('; ')}"`
                        ].join(',');
                    });
                    const csvContent = [headers.join(','), ...rows].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.setAttribute('href', url);
                    link.setAttribute('download', `export_mahasiswa_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }
        }
    </script>
    @endpush
</x-app-layout>