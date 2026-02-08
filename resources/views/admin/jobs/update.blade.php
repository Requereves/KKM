<x-app-layout>
    <div class="max-w-4xl mx-auto py-12 px-4">
        <!-- Header -->
        <div class="flex items-center gap-4 mb-6">
            {{-- Pastikan nama route sesuai dengan php artisan route:list --}}
            <a href="{{ route('jobs.index') }}" class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <span class="material-icons-outlined">arrow_back</span>
            </a>
            <div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">
                    {{ isset($job) ? 'Edit Lowongan' : 'Tambah Lowongan Baru' }}
                </h2>
                <p class="text-sm text-slate-500">
                    {{ isset($job) ? 'ID: ' . $job->id : 'Isi detail lowongan di bawah ini' }}
                </p>
            </div>
        </div>

        <!-- Form -->
        {{-- Logic Action: Jika ada $job maka update, jika tidak maka store --}}
        <form action="{{ isset($job) ? route('jobs.update', $job) : route('jobs.store') }}" 
              method="POST" 
              class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
            
            @csrf
            {{-- Method PUT hanya untuk Edit --}}
            @if(isset($job)) 
                @method('PUT') 
            @endif

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Job Title -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Judul Pekerjaan</label>
                    <input type="text" name="title" value="{{ old('title', $job->title ?? '') }}" required
                           class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                           placeholder="e.g. Frontend Developer">
                </div>

                <!-- Company -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Perusahaan</label>
                    <input type="text" name="company" value="{{ old('company', $job->company ?? '') }}" required
                           class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                </div>

                <!-- Location -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi</label>
                    <input type="text" name="location" value="{{ old('location', $job->location ?? '') }}" required
                           class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                </div>

                <!-- Salary -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Gaji (Salary)</label>
                    <input type="text" name="salary" value="{{ old('salary', $job->salary ?? '') }}"
                           class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                           placeholder="e.g. IDR 5.000.000">
                </div>

                <!-- Job Type -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tipe Pekerjaan</label>
                    <select name="type" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                        @foreach(['Full-time', 'Internship', 'Part-time', 'Contract'] as $type)
                            <option value="{{ $type }}" {{ old('type', $job->type ?? '') == $type ? 'selected' : '' }}>{{ $type }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Status -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <select name="status" class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                        @foreach(['draft', 'active', 'closed'] as $status)
                            <option value="{{ $status }}" {{ old('status', $job->status ?? 'draft') == $status ? 'selected' : '' }}>{{ ucfirst($status) }}</option>
                        @endforeach
                    </select>
                </div>

                <!-- Dates -->
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Posting</label>
                    {{-- Gunakan created_at jika edit, gunakan hari ini jika tambah --}}
                    <input type="date" name="posted_at" 
                           value="{{ old('posted_at', isset($job) ? $job->created_at->format('Y-m-d') : date('Y-m-d')) }}"
                           class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                </div>
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Berakhir</label>
                    {{-- Proteksi agar tidak error format() jika expires_at null --}}
                    <input type="date" name="expires_at" 
                           value="{{ old('expires_at', (isset($job) && $job->expires_at) ? $job->expires_at->format('Y-m-d') : '') }}"
                           class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">
                </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</label>
                <textarea name="description" rows="4" 
                          class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white">{{ old('description', $job->description ?? '') }}</textarea>
            </div>

            <!-- Requirements (Textarea to Array Logic) -->
            <div class="space-y-2">
                <label class="text-xs font-bold text-slate-500 uppercase tracking-wider">Persyaratan (Satu per baris)</label>
                {{-- Gabungkan array menjadi baris teks jika mode edit --}}
                <textarea name="requirements" rows="4" placeholder="Contoh:&#10;Minimal S1&#10;Bisa Laravel"
                          class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-mono text-sm">@if(old('requirements')){{ old('requirements') }}@elseif(isset($job) && is_array($job->requirements)){{ implode("\n", $job->requirements) }}@endif</textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
                <a href="{{ route('jobs.index') }}" 
                   class="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all">
                    Batal
                </a>
                <button type="submit" 
                        class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                    {{ isset($job) ? 'Update Pekerjaan' : 'Simpan Pekerjaan' }}
                </button>
            </div>
        </form>
    </div>
</x-app-layout>