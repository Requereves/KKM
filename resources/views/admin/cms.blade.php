<x-app-layout>
    
    {{-- Container Utama dengan Alpine Data untuk Modal --}}
    <div x-data="{ showModal: false }">

        {{-- Header Halaman --}}
        <div class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold text-slate-900 dark:text-white">CMS / User Management</h1>
                    <p class="text-slate-600 dark:text-slate-400 text-sm mt-1">Kelola akun administrator sistem.</p>
                </div>
                
                {{-- TOMBOL UTAMA: Memicu Modal --}}
                <button @click="showModal = true" 
                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-indigo-500/30 transition-all">
                    <span class="material-icons-outlined text-lg">person_add</span>
                    Tambah Admin
                </button>
            </div>
        </div>

        {{-- Feedback Message (Sukses/Error) --}}
        @if(session('success'))
        <div class="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <span class="material-icons-outlined">check_circle</span>
            {{ session('success') }}
        </div>
        @endif

        @if($errors->any())
        <div class="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
            <ul class="list-disc list-inside">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
        @endif

        {{-- Tabel Daftar Admin --}}
        <div class="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                        <tr>
                            <th class="px-6 py-4">Nama</th>
                            <th class="px-6 py-4">Email</th>
                            <th class="px-6 py-4">Role</th>
                            <th class="px-6 py-4">Bergabung</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        @foreach($admins as $admin)
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td class="px-6 py-4 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                                    {{ substr($admin->name, 0, 1) }}
                                </div>
                                {{ $admin->name }}
                                @if(auth()->id() === $admin->id)
                                    <span class="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full ml-2">You</span>
                                @endif
                            </td>
                            <td class="px-6 py-4 text-slate-600 dark:text-slate-400">{{ $admin->email }}</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-bold uppercase">
                                    Admin
                                </span>
                            </td>
                            <td class="px-6 py-4 text-slate-500 dark:text-slate-500">
                                {{ $admin->created_at->format('d M Y') }}
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        {{-- ========================================================= --}}
        {{-- MODAL FORM TAMBAH ADMIN --}}
        {{-- ========================================================= --}}
        <div x-show="showModal" 
             style="display: none;"
             class="fixed inset-0 z-50 overflow-y-auto" 
             aria-labelledby="modal-title" 
             role="dialog" 
             aria-modal="true">
            
            {{-- Backdrop Gelap --}}
            <div x-show="showModal"
                 x-transition:enter="ease-out duration-300"
                 x-transition:enter-start="opacity-0"
                 x-transition:enter-end="opacity-100"
                 x-transition:leave="ease-in duration-200"
                 x-transition:leave-start="opacity-100"
                 x-transition:leave-end="opacity-0"
                 class="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity"></div>

            {{-- Container Modal --}}
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div x-show="showModal"
                     @click.outside="showModal = false"
                     x-transition:enter="ease-out duration-300"
                     x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                     x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100"
                     x-transition:leave="ease-in duration-200"
                     x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100"
                     x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                     class="relative transform overflow-hidden rounded-lg bg-white dark:bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200 dark:border-slate-800">
                    
                    {{-- Header Modal --}}
                    <div class="bg-white dark:bg-slate-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div class="sm:flex sm:items-start">
                            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                <span class="material-icons-outlined text-indigo-600 dark:text-indigo-400">admin_panel_settings</span>
                            </div>
                            <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <h3 class="text-base font-semibold leading-6 text-slate-900 dark:text-white" id="modal-title">Tambah Admin Baru</h3>
                                <div class="mt-2">
                                    <p class="text-sm text-slate-500 dark:text-slate-400">
                                        Akun ini akan memiliki akses penuh ke sistem. Pastikan password aman.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {{-- Form Start --}}
                    <form method="POST" action="{{ route('admin.create') }}">
                        @csrf
                        <div class="bg-white dark:bg-slate-900 px-4 py-5 sm:p-6 space-y-4">
                            
                            {{-- Input Nama --}}
                            <div>
                                <label for="name" class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Nama Lengkap</label>
                                <div class="mt-1">
                                    <input type="text" name="name" id="name" required 
                                           class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:ring-slate-700 dark:text-white">
                                </div>
                            </div>

                            {{-- Input Email --}}
                            <div>
                                <label for="email" class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Email Address</label>
                                <div class="mt-1">
                                    <input type="email" name="email" id="email" required 
                                           class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:ring-slate-700 dark:text-white">
                                </div>
                            </div>

                            {{-- Input Password --}}
                            <div>
                                <label for="password" class="block text-sm font-medium leading-6 text-slate-900 dark:text-slate-200">Password</label>
                                <div class="mt-1">
                                    <input type="password" name="password" id="password" required minlength="8"
                                           class="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-slate-800 dark:ring-slate-700 dark:text-white">
                                </div>
                                <p class="mt-1 text-xs text-slate-500">Minimal 8 karakter.</p>
                            </div>

                        </div>

                        {{-- Footer Modal (Tombol Action) --}}
                        <div class="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="submit" class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto transition-colors">
                                Simpan Admin
                            </button>
                            <button type="button" @click="showModal = false" class="mt-3 inline-flex w-full justify-center rounded-md bg-white dark:bg-slate-700 px-3 py-2 text-sm font-semibold text-slate-900 dark:text-slate-200 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 sm:mt-0 sm:w-auto transition-colors">
                                Batal
                            </button>
                        </div>
                    </form>
                    {{-- Form End --}}

                </div>
            </div>
        </div>

    </div>
</x-app-layout>