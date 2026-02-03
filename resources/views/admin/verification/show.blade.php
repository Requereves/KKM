<x-app-layout>
    <!-- Wrapper dengan Alpine Data untuk Logic Selection -->
    <div x-data="{ decision: null, feedback: '' }" 
         class="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300">
        
        <!-- LEFT COLUMN: PDF/File Preview -->
        <div class="lg:w-2/3 h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            <!-- Preview Header -->
            <div class="bg-slate-900 p-3 flex items-center justify-between border-b border-slate-700">
                <div class="flex items-center gap-4">
                    <a href="{{ route('verification.index') }}" class="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                        <span class="material-icons-outlined text-sm">arrow_back</span>
                        Kembali
                    </a>
                    <span class="text-slate-300 text-xs sm:text-sm font-medium truncate max-w-[150px] sm:max-w-xs border-l border-slate-700 pl-4">
                        {{ basename($portfolio->file_path) }}
                    </span>
                </div>
                <div class="flex items-center gap-2">
                    <a href="{{ $fileUrl }}" target="_blank" class="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold">
                        <span class="material-icons-outlined text-xs">open_in_new</span>
                        Buka Tab Baru
                    </a>
                </div>
            </div>
            
            <!-- Preview Body (Iframe) -->
            <div class="flex-1 bg-slate-500/50 relative overflow-hidden group">
                <iframe src="{{ $fileUrl }}" class="w-full h-full border-none">
                    <div class="flex items-center justify-center h-full flex-col text-white gap-2">
                        <span class="material-icons-outlined text-4xl opacity-50">description</span>
                        <p>Browser Anda tidak mendukung preview langsung.</p>
                        <a href="{{ $fileUrl }}" class="underline text-indigo-300 hover:text-white">Download File</a>
                    </div>
                </iframe>
            </div>
        </div>

        <!-- RIGHT COLUMN: Info & Decision Panel -->
        <div class="lg:w-1/3 h-full flex flex-col gap-6 overflow-y-auto pb-6 pr-1 custom-scrollbar">
            
            <!-- Info Card -->
            <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                    <span class="material-icons-outlined text-indigo-500">person</span>
                    Informasi Mahasiswa
                </h2>
                <div class="space-y-4">
                    <div class="grid grid-cols-1 gap-1">
                        <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Nama Lengkap</label>
                        <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ $portfolio->student->full_name }}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NIM</label>
                            <p class="font-mono text-sm text-slate-700 dark:text-slate-300">{{ $portfolio->student->nim }}</p>
                        </div>
                        <div>
                            <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Jurusan</label>
                            <p class="text-sm text-slate-700 dark:text-slate-300 truncate">{{ $portfolio->student->major ?? '-' }}</p>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Judul Dokumen</label>
                        <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-1">{{ $portfolio->title }}</p>
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kategori</label>
                        <span class="inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {{ str_replace('_', ' ', $portfolio->category) }}
                        </span>
                    </div>
                    <div>
                        <label class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Deskripsi</label>
                        <div class="mt-1 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg text-sm italic text-slate-500 border border-slate-100 dark:border-slate-800">
                            "{{ $portfolio->description ?? 'Tidak ada deskripsi tambahan.' }}"
                        </div>
                    </div>
                </div>
            </div>

            <!-- Decision Card -->
            <div class="flex-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-auto min-h-[400px]">
                <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <span class="material-icons-outlined text-indigo-500">gavel</span>
                    Keputusan Verifikasi
                </h2>

                <!-- Jika sudah diverifikasi sebelumnya -->
                @if($portfolio->status !== 'pending')
                    <div class="mb-6 p-4 rounded-lg border {{ $portfolio->status === 'approved' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800' : 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800' }}">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="material-icons-outlined text-lg {{ $portfolio->status === 'approved' ? 'text-emerald-600' : 'text-rose-600' }}">
                                {{ $portfolio->status === 'approved' ? 'check_circle' : 'cancel' }}
                            </span>
                            <p class="text-sm font-bold uppercase tracking-wide {{ $portfolio->status === 'approved' ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400' }}">
                                Status: {{ ucfirst($portfolio->status) }}
                            </p>
                        </div>
                        
                        @if($portfolio->verified_at)
                            <p class="text-xs text-slate-500 dark:text-slate-400 ml-7">
                                Diverifikasi pada: {{ $portfolio->verified_at->format('d M Y, H:i') }} WIB
                            </p>
                        @endif
                        
                        @if($portfolio->admin_feedback)
                            <div class="mt-3 ml-7 pt-3 border-t border-black/5 dark:border-white/5">
                                <p class="text-[10px] uppercase font-bold text-slate-400 mb-1">Feedback Admin:</p>
                                <p class="text-xs text-slate-700 dark:text-slate-300 italic">"{{ $portfolio->admin_feedback }}"</p>
                            </div>
                        @endif
                    </div>
                    <p class="text-xs text-slate-400 text-center mb-4">Ingin mengubah status? Silakan isi form di bawah.</p>
                @endif

                <!-- Form -->
                <form action="{{ route('verification.update', $portfolio->id) }}" method="POST" class="flex-1 flex flex-col">
                    @csrf
                    @method('PUT')
                    
                    <!-- Hidden Input untuk Decision (dimanipulasi oleh Alpine) -->
                    <input type="hidden" name="decision" x-model="decision">

                    <div class="space-y-3 flex-1">
                        <p class="text-xs text-slate-500 mb-2">Pilih hasil verifikasi untuk dokumen ini:</p>
                        
                        <!-- Approve Option -->
                        <div @click="decision = 'approve'"
                             class="cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all relative overflow-hidden group"
                             :class="decision === 'approve' 
                                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md'">
                            
                            <div class="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors"
                                 :class="decision === 'approve' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 dark:border-slate-600'">
                                <span x-show="decision === 'approve'" class="material-icons-outlined text-white text-[12px] animate-in zoom-in">check</span>
                            </div>
                            
                            <div>
                                <h3 class="font-bold text-sm" 
                                    :class="decision === 'approve' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'">
                                    Terima (Approve)
                                </h3>
                                <p class="text-xs text-slate-500 mt-0.5">Dokumen valid dan memenuhi syarat.</p>
                            </div>
                        </div>

                        <!-- Reject Option -->
                        <div @click="decision = 'reject'"
                             class="cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all relative overflow-hidden group"
                             :class="decision === 'reject' 
                                ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20' 
                                : 'border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-md'">
                            
                            <div class="w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 flex-shrink-0 transition-colors"
                                 :class="decision === 'reject' ? 'border-rose-500 bg-rose-500' : 'border-slate-300 dark:border-slate-600'">
                                <span x-show="decision === 'reject'" class="material-icons-outlined text-white text-[12px] animate-in zoom-in">close</span>
                            </div>
                            
                            <div>
                                <h3 class="font-bold text-sm" 
                                    :class="decision === 'reject' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'">
                                    Tolak (Reject)
                                </h3>
                                <p class="text-xs text-slate-500 mt-0.5">Dokumen tidak valid, buram, atau salah.</p>
                            </div>
                        </div>

                        <!-- Textarea Logic: Muncul jika Reject dipilih -->
                        <div x-show="decision === 'reject'" 
                             x-transition:enter="transition ease-out duration-300"
                             x-transition:enter-start="opacity-0 -translate-y-2"
                             x-transition:enter-end="opacity-100 translate-y-0"
                             style="display: none;"
                             class="pt-2">
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block flex justify-between">
                                Alasan Penolakan <span class="text-rose-500 text-[10px]">* Wajib diisi</span>
                            </label>
                            <textarea 
                                name="feedback"
                                x-model="feedback"
                                placeholder="Contoh: Dokumen tidak terbaca dengan jelas, mohon upload ulang scan asli..."
                                class="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none transition-all placeholder:text-slate-400"
                                rows="3"></textarea>
                            @error('feedback')
                                <p class="text-xs text-rose-500 mt-1 flex items-center gap-1">
                                    <span class="material-icons-outlined text-[12px]">error</span> {{ $message }}
                                </p>
                            @enderror
                        </div>
                    </div>

                    <!-- Submit Section -->
                    <div class="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                        <div x-show="decision" 
                             x-transition
                             class="mb-3 flex items-start gap-2 text-xs font-medium p-3 rounded-lg border transition-colors"
                             :class="decision === 'approve' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'"
                             style="display: none;">
                            <span class="material-icons-outlined text-sm mt-0.5">info</span>
                            <span x-text="decision === 'approve' ? 'Mahasiswa akan menerima notifikasi bahwa berkas ini telah Valid.' : 'Mahasiswa akan diminta untuk memperbaiki/upload ulang berkas.'"></span>
                        </div>

                        <button 
                            type="submit"
                            :disabled="!decision || (decision === 'reject' && !feedback.trim())"
                            class="w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transform active:scale-[0.98]"
                            :class="!decision 
                                ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400' 
                                : decision === 'approve' 
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' 
                                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'">
                            
                            <span class="material-icons-outlined text-lg" 
                                  x-text="decision === 'approve' ? 'verified' : (decision === 'reject' ? 'block' : 'help_outline')"></span>
                            <span x-text="decision === 'approve' ? 'Konfirmasi Valid' : (decision === 'reject' ? 'Konfirmasi Tolak' : 'Pilih Keputusan')"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <!-- Alpine.js (Jika belum ada di layout) -->
    <script src="//unpkg.com/alpinejs" defer></script>
</x-app-layout>