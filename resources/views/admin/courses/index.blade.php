<x-app-layout>
    <div class="min-h-screen bg-gray-50/50 py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
            
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4 px-4 sm:px-0">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Daftar Kursus</h1>
                    <p class="text-gray-500 mt-1 text-sm">Kelola semua materi pembelajaran untuk mahasiswa di sini.</p>
                </div>
                <a href="{{ route('admin.courses.create') }}" 
                   class="inline-flex items-center justify-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-indigo-600/20 gap-2 transform hover:-translate-y-0.5">
                    <span class="material-icons-outlined text-xl">add_circle</span>
                    <span>Tambah Course</span>
                </a>
            </div>

            @if(session('success'))
                <div x-data="{ show: true }" x-show="show" x-transition.duration.300ms
                     class="mb-6 flex items-center p-4 bg-green-50 border border-green-100 rounded-xl shadow-sm text-green-700 relative overflow-hidden">
                    <div class="absolute inset-y-0 left-0 w-1 bg-green-500"></div>
                    <span class="material-icons-outlined mr-3 text-green-600 text-xl">check_circle</span>
                    <span class="font-medium">{{ session('success') }}</span>
                    <button @click="show = false" class="ml-auto text-green-400 hover:text-green-600 transition-colors p-1 rounded-lg hover:bg-green-100">
                        <span class="material-icons-outlined">close</span>
                    </button>
                </div>
            @endif

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full whitespace-nowrap">
                        <thead>
                            <tr class="bg-gray-50/50 text-left border-b border-gray-100">
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Course Info</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Kategori</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Instruktur</th>
                                <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            @forelse($courses as $course)
                            <tr class="hover:bg-indigo-50/30 transition-colors duration-200 group">
                                
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-4">
                                        <div class="relative h-16 w-24 flex-shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-100 group-hover:shadow-md transition-all duration-300">
                                            @if($course->thumbnail)
                                                <img src="{{ asset('storage/' . $course->thumbnail) }}" 
                                                     class="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                                     alt="{{ $course->title }}">
                                            @else
                                                <div class="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                    <span class="material-icons-outlined">image</span>
                                                </div>
                                            @endif
                                        </div>
                                        <div>
                                            <div class="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors max-w-xs">
                                                {{ $course->title }}
                                            </div>
                                            <div class="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                <span class="material-icons-outlined text-[10px]">schedule</span>
                                                {{ $course->created_at->format('d M Y') }}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="px-6 py-4">
                                    @php
                                        $colors = [
                                            'Web Development' => 'bg-blue-50 text-blue-700 border-blue-200',
                                            'Data Science' => 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                            'UI/UX Design' => 'bg-purple-50 text-purple-700 border-purple-200',
                                            'Mobile Development' => 'bg-orange-50 text-orange-700 border-orange-200',
                                            'Cyber Security' => 'bg-red-50 text-red-700 border-red-200',
                                            'Digital Marketing' => 'bg-pink-50 text-pink-700 border-pink-200',
                                        ];
                                        $badgeStyle = $colors[$course->category] ?? 'bg-gray-50 text-gray-700 border-gray-200';
                                    @endphp
                                    <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border {{ $badgeStyle }}">
                                        {{ $course->category }}
                                    </span>
                                </td>

                                <td class="px-6 py-4">
                                    <div class="flex items-center text-sm text-gray-600">
                                        <div class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-2 text-gray-400">
                                            <span class="material-icons-outlined text-xs">person</span>
                                        </div>
                                        {{ $course->instructor }}
                                    </div>
                                </td>

                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        
                                        {{-- Tombol Edit --}}
                                        <a href="{{ route('admin.courses.edit', $course->id) }}" 
                                           class="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg group/btn relative" 
                                           title="Edit Course">
                                            <span class="material-icons-outlined text-xl">edit</span>
                                        </a>

                                        {{-- Tombol Hapus --}}
                                        <form action="{{ route('admin.courses.destroy', $course->id) }}" method="POST" 
                                              onsubmit="return confirm('Apakah Anda yakin ingin menghapus course &quot;{{ $course->title }}&quot;? Data tidak bisa dikembalikan.');"
                                              class="inline-block">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" 
                                                    class="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg group/btn relative" 
                                                    title="Hapus Course">
                                                <span class="material-icons-outlined text-xl">delete</span>
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                            @empty
                            <tr>
                                <td colspan="4" class="px-6 py-16 text-center">
                                    <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                                        <div class="bg-indigo-50 p-4 rounded-full mb-4 ring-8 ring-indigo-50/50">
                                            <span class="material-icons-outlined text-4xl text-indigo-400">school</span>
                                        </div>
                                        <h3 class="text-lg font-bold text-gray-900 mb-1">Belum ada course</h3>
                                        <p class="text-gray-500 text-sm mb-6 leading-relaxed">
                                            Mulai tambahkan materi pembelajaran agar mahasiswa dapat mengaksesnya di dashboard mereka.
                                        </p>
                                        <a href="{{ route('admin.courses.create') }}" 
                                           class="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline flex items-center gap-1">
                                            <span>+ Tambah Course Pertama</span>
                                            <span class="material-icons-outlined text-sm">arrow_forward</span>
                                        </a>
                                    </div>
                                </td>
                            </tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
                
                @if($courses->hasPages())
                    <div class="bg-gray-50/50 px-6 py-4 border-t border-gray-100">
                        {{ $courses->links() }}
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-app-layout>