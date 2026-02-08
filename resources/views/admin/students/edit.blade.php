<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Edit Student Profile') }}
        </h2>
    </x-slot>

    <div class="py-12">
        <div class="max-w-4xl mx-auto sm:px-6 lg:px-8">
            <!-- Back Button -->
            <a href="{{ route('students.index') }}"
                class="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
                <span class="material-icons-outlined text-base mr-1">arrow_back</span>
                Kembali ke Daftar
            </a>

            <div
                class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <form action="{{ route('students.update', $student->id) }}" method="POST" class="p-8 space-y-8">
                    @csrf
                    @method('PUT')

                    <!-- Profile Header -->
                    <div class="flex items-center gap-6 pb-8 border-b border-slate-100 dark:border-slate-800">
                        <img src="https://ui-avatars.com/api/?name={{ urlencode($student->full_name) }}&background=6366f1&color=fff"
                            class="w-20 h-20 rounded-full ring-4 ring-slate-50 dark:ring-slate-800">
                        <div>
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ $student->full_name }}</h3>
                            <p class="text-sm text-slate-500 uppercase tracking-widest font-mono">{{ $student->nim }}
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Full Name -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama
                                Lengkap</label>
                            <input type="text" name="full_name" value="{{ old('full_name', $student->full_name) }}"
                                required
                                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all">
                        </div>

                        <!-- NIM (Readonly biasanya) -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">NIM</label>
                            <input type="text" value="{{ $student->nim }}" disabled
                                class="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 cursor-not-allowed">
                        </div>

                        <!-- Major -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Jurusan</label>
                            <select name="major"
                                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all">
                                @foreach(['Teknik Informatika', 'Sistem Informasi', 'Desain Komunikasi Visual', 'Manajemen'] as $m)
                                    <option value="{{ $m }}" {{ old('major', $student->major) == $m ? 'selected' : '' }}>
                                        {{ $m }}</option>
                                @endforeach
                            </select>
                        </div>

                        <!-- Year of Entry -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Angkatan</label>
                            <input type="number" name="year_of_entry"
                                value="{{ old('year_of_entry', $student->year_of_entry) }}" required
                                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all">
                        </div>

                        <!-- Email -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</label>
                            <input type="email" name="email" value="{{ old('email', $student->email) }}" required
                                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all">
                        </div>

                        <!-- Phone -->
                        <div class="space-y-2">
                            <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor HP</label>
                            <input type="text" name="phone" value="{{ old('phone', $student->phone) }}"
                                class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all">
                        </div>
                    </div>

                    <!-- Skill -->
                                    
                <div class="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800" 
                    x-data="{ 
                        selectedSkills: {{ $student->skills->map(fn($s) => ['id' => (string)$s->id, 'name' => $s->skill_name])->toJson() }},
                        
                        addSkill(el) {
                            const id = el.value;
                            const name = el.options[el.selectedIndex].text;
                            if (id && !this.selectedSkills.some(s => s.id === id)) {
                                this.selectedSkills.push({ id: id, name: name });
                            }
                            el.value = '';
                        },
                        removeSkill(id) {
                            this.selectedSkills = this.selectedSkills.filter(s => s.id !== id);
                        }
                    }">
                    
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span class="material-icons-outlined text-sm">psychology</span>
                        Manage Skills
                    </label>

                    <!-- Badge Skills -->
                    <div class="flex flex-wrap gap-2 mb-4">
                        <template x-for="skill in selectedSkills" :key="skill.id">
                            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50">
                                
                               
                                <span x-text="skill.name"></span>
                                
                                <button type="button" @click="removeSkill(skill.id)" class="flex items-center justify-center hover:text-rose-500 transition-colors">
                                    <span class="material-icons-outlined text-sm">close</span>
                                </button>

                                <input type="hidden" name="skills[]" :value="skill.id">
                            </span>
                        </template>

                        <template x-if="selectedSkills.length === 0">
                            <p class="text-sm text-slate-400 italic">Belum ada skill yang dipilih.</p>
                        </template>
                    </div>

                    <!-- Dropdown Pilih Skill -->
                    <select @change="addSkill($event.target)" 
                            class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all">
                        <option value="">+ Tambah Skill...</option>
                        @foreach($allSkills as $skill)
                            <option value="{{ $skill->id }}" 
                                    x-show="!selectedSkills.some(s => s.id == '{{ $skill->id }}')"
                                    x-cloak>
                                {{ $skill->skill_name }} <!-- Ganti $skill->name menjadi $skill->skill_name -->
                            </option>
                        @endforeach
                    </select>
                </div>
                    <!-- Status Switch -->
                    <div
                        class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between border border-slate-100 dark:border-slate-800">
                        <div>
                            <p class="text-sm font-bold text-slate-900 dark:text-white">Status Mahasiswa</p>
                            <p class="text-xs text-slate-500">Tentukan apakah akun mahasiswa ini aktif atau tidak.</p>
                        </div>
                        <select name="is_active"
                            class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm px-3 py-1">
                            <option value="1" {{ $student->is_active ? 'selected' : '' }}>Active</option>
                            <option value="0" {{ !$student->is_active ? 'selected' : '' }}>Inactive</option>
                        </select>
                    </div>

                    <!-- Actions -->
                    <div class="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <a href="{{ route('students.index') }}"
                            class="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Batal</a>
                        <button type="submit"
                            class="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- @push('scripts')
        <script>
            function skillPicker() {
                return {
                    // ambil data awal (ID dan Nama) langsung dari database
                    selectedSkills: @json($student->skills->map(function ($s) {
                        return ['id' => (string) $s->id, 'name' => $s->name];
                    })),

                    // Fungsi tambah skill
                    addSkill(event) {
                        const select = event.target;
                        const id = select.value;
                        const name = select.options[select.selectedIndex].text;

                        if (id && !this.selectedSkills.some(s => s.id === id)) {
                            this.selectedSkills.push({ id: id, name: name });
                        }

                        // Reset dropdown ke "+ Tambah Skill"
                        select.value = "";
                    },

                    // Fungsi hapus skill
                    removeSkill(id) {
                        this.selectedSkills = this.selectedSkills.filter(s => s.id !== id);
                    }
                }
            }
        </script>
    @endpush -->
</x-app-layout>