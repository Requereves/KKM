<x-app-layout>
    <div class="animate-in fade-in duration-500">
        
        {{-- HEADER SECTION --}}
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                <p class="text-slate-500 dark:text-slate-400 text-sm">Update informasi pribadi dan pengaturan keamanan akunmu.</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {{-- ========================================== --}}
            {{-- KOLOM KIRI: KARTU PROFIL & AVATAR --}}
            {{-- ========================================== --}}
            <div class="lg:col-span-1 space-y-6">
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
                    
                    {{-- Form Upload Avatar (Auto Submit saat file dipilih) --}}
                    <form id="avatar-form" action="{{ route('profile.avatar') }}" method="POST" enctype="multipart/form-data" class="w-full flex flex-col items-center">
                        @csrf
                        @method('PATCH')

                        {{-- Avatar Image Wrapper --}}
                        <div class="relative group cursor-pointer" onclick="document.getElementById('avatar-input').click()">
                            
                            {{-- Logic: Cek apakah user punya avatar custom di database --}}
                            @if($user->avatar)
                                <img 
                                    src="{{ asset('storage/' . $user->avatar) }}" 
                                    alt="Profile" 
                                    class="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all"
                                >
                            @else
                                {{-- Fallback ke UI Avatars jika belum ada foto --}}
                                <img 
                                    src="https://ui-avatars.com/api/?name={{ urlencode($user->name) }}&background=6366f1&color=ffffff&size=128" 
                                    alt="Profile" 
                                    class="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all"
                                >
                            @endif

                            {{-- Overlay Icon Kamera --}}
                            <div class="absolute inset-0 rounded-full bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <span class="material-icons-outlined text-white text-2xl">camera_alt</span>
                            </div>
                        </div>

                        {{-- Hidden File Input --}}
                        <input 
                            type="file" 
                            id="avatar-input" 
                            name="avatar" 
                            class="hidden" 
                            accept="image/*"
                            onchange="document.getElementById('avatar-form').submit()"
                        >
                    </form>
                    
                    <h2 class="mt-4 text-xl font-bold text-slate-900 dark:text-white">{{ $user->name }}</h2>
                    
                    {{-- Role Badge --}}
                    <div class="mt-1">
                        <span class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                            {{ $user->role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' }}">
                            {{ $user->role }}
                        </span>
                    </div>

                    {{-- Tombol Upload Trigger --}}
                    <button type="button" onclick="document.getElementById('avatar-input').click()" class="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                        <span class="material-icons-outlined text-sm">upload</span>
                        Upload Foto
                    </button>

                    {{-- Error Message jika file bermasalah --}}
                    @error('avatar')
                        <p class="mt-2 text-xs text-red-500">{{ $message }}</p>
                    @enderror

                    {{-- Success Message --}}
                    @if (session('status') === 'avatar-updated')
                        <p class="mt-2 text-xs text-emerald-500 font-bold flex items-center gap-1 animate-pulse">
                            <span class="material-icons-outlined text-sm">check_circle</span> Foto diperbarui!
                        </p>
                    @endif
                </div>
            </div>

            {{-- ========================================== --}}
            {{-- KOLOM KANAN: FORM UPDATE (GABUNGAN) --}}
            {{-- ========================================== --}}
            <div class="lg:col-span-2 space-y-6">
                
                {{-- Container Putih Utama --}}
                <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    
                    {{-- 1. FORM GENERAL INFO --}}
                    <form method="post" action="{{ route('profile.update') }}" class="p-0">
                        @csrf
                        @method('patch')

                        <div class="p-6 border-b border-slate-100 dark:border-slate-800">
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-icons-outlined text-indigo-500">badge</span>
                                Informasi Umum
                            </h3>
                        </div>
                        
                        <div class="p-6 space-y-6">
                            {{-- Notifikasi Sukses Profile --}}
                            @if (session('status') === 'profile-updated')
                                <div class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium mb-4">
                                    <span class="material-icons-outlined text-base">check_circle</span>
                                    Profil berhasil diperbarui.
                                </div>
                            @endif

                            <div class="grid grid-cols-1 gap-6">
                                {{-- Input Nama --}}
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                                    <div class="relative">
                                        <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value="{{ old('name', $user->name) }}"
                                            required
                                            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    @error('name') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>

                                {{-- Input Email --}}
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alamat Email</label>
                                    <div class="relative">
                                        <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value="{{ old('email', $user->email) }}"
                                            required
                                            class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                        />
                                    </div>
                                    @error('email') <span class="text-red-500 text-xs">{{ $message }}</span> @enderror
                                </div>
                            </div>

                            <div class="flex justify-end">
                                <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 text-sm">
                                    Simpan Profil
                                </button>
                            </div>
                        </div>
                    </form>

                    {{-- PEMBATAS VISUAL --}}
                    <div class="border-t border-slate-100 dark:border-slate-800"></div>

                    {{-- 2. FORM UPDATE PASSWORD --}}
                    <form method="post" action="{{ route('password.update') }}" class="p-0">
                        @csrf
                        @method('put')

                        <div class="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                            <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span class="material-icons-outlined text-indigo-500">lock</span>
                                Keamanan Password
                            </h3>
                        </div>

                        <div class="p-6 space-y-4">
                             {{-- Notifikasi Sukses Password --}}
                             @if (session('status') === 'password-updated')
                                <div class="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium mb-4">
                                    <span class="material-icons-outlined text-base">check_circle</span>
                                    Password berhasil diubah.
                                </div>
                            @endif

                            {{-- Current Password --}}
                            <div class="space-y-2">
                                <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password Saat Ini</label>
                                <input 
                                    type="password" 
                                    name="current_password"
                                    class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                    placeholder="••••••••"
                                />
                                @error('current_password', 'updatePassword') 
                                    <span class="text-red-500 text-xs flex items-center gap-1 mt-1">
                                        <span class="material-icons-outlined text-[14px]">error</span> {{ $message }}
                                    </span> 
                                @enderror
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {{-- New Password --}}
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password Baru</label>
                                    <input 
                                        type="password" 
                                        name="password"
                                        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                    
                                    {{-- LOGIKA 1: Tampilkan error password standar (misal: min 8 chars), TAPI JANGAN tampilkan error 'match/cocok' --}}
                                    @if($errors->updatePassword->has('password'))
                                        @foreach($errors->updatePassword->get('password') as $message)
                                            @if(!str_contains(strtolower($message), 'match') && !str_contains(strtolower($message), 'cocok'))
                                                <span class="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                    <span class="material-icons-outlined text-[14px]">error</span> {{ $message }}
                                                </span> 
                                            @endif
                                        @endforeach
                                    @endif
                                </div>

                                {{-- Confirm Password --}}
                                <div class="space-y-2">
                                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Konfirmasi Password</label>
                                    <input 
                                        type="password" 
                                        name="password_confirmation"
                                        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                    
                                    {{-- LOGIKA 2: Cek error di 'password', kalau soal 'match/cocok', tampilkan DISINI --}}
                                    @if($errors->updatePassword->has('password'))
                                        @foreach($errors->updatePassword->get('password') as $message)
                                            @if(str_contains(strtolower($message), 'match') || str_contains(strtolower($message), 'cocok'))
                                                <span class="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                    <span class="material-icons-outlined text-[14px]">error</span> {{ $message }}
                                                </span> 
                                            @endif
                                        @endforeach
                                    @endif
                                </div>
                            </div>

                            <div class="flex justify-end mt-4">
                                <button type="submit" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm">
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    </div>
</x-app-layout>