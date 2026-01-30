<x-app-layout>
    <x-slot name="header">
        <div class="flex justify-between items-center">
            <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {{ __('Detail Portfolio') }}
            </h2>
            <a href="{{ route('dashboard') }}" class="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800">
                &larr; Kembali ke Dashboard
            </a>
        </div>
    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[85vh]">
                
                <div class="lg:col-span-1 flex flex-col gap-6">
                    
                    <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-6 flex-1 overflow-y-auto">
                        
                        <h1 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {{ $portfolio->title }}
                        </h1>
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-6">
                            Uploaded by {{ $portfolio->full_name }} • {{ \Carbon\Carbon::parse($portfolio->created_at)->format('d M Y') }}
                        </p>

                        <div class="mb-6">
                            <h3 class="text-xs font-bold text-gray-400 uppercase mb-2">Status Submission</h3>
                            @if($portfolio->status === 'approved')
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                    ✅ Disetujui (Approved)
                                </span>
                            @elseif($portfolio->status === 'rejected')
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                                    ❌ Ditolak (Rejected)
                                </span>
                            @else
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    ⏳ Menunggu Review
                                </span>
                            @endif
                        </div>

                        @if($portfolio->admin_feedback)
                        <div class="mb-6 bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-500 p-4">
                            <h3 class="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase mb-1">Catatan Dosen/Admin</h3>
                            <p class="text-sm text-gray-700 dark:text-gray-300 italic">
                                "{{ $portfolio->admin_feedback }}"
                            </p>
                        </div>
                        @endif

                        <div class="mb-6">
                            <h3 class="text-xs font-bold text-gray-400 uppercase mb-2">Deskripsi</h3>
                            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {{ $portfolio->description ?? 'Tidak ada deskripsi.' }}
                            </p>
                        </div>

                        <div>
                            <h3 class="text-xs font-bold text-gray-400 uppercase mb-2">Kategori</h3>
                            <span class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                                {{ ucwords(str_replace('_', ' ', $portfolio->category)) }}
                            </span>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg p-4 text-center">
                        <a href="{{ asset('storage/' . $portfolio->file_path) }}" download 
                           class="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline">
                           Download PDF
                        </a>
                    </div>
                </div>

                <div class="lg:col-span-2 bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <iframe src="{{ asset('storage/' . $portfolio->file_path) }}" 
                            class="w-full h-full" 
                            frameborder="0">
                    </iframe>
                </div>

            </div>
        </div>
    </div>
</x-app-layout>