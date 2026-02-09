<x-app-layout>
    <div class="min-h-screen bg-gray-50/50 py-12">
        <div class="max-w-5xl mx-auto sm:px-6 lg:px-8">
            
            <div class="mb-8">
                <a href="{{ route('admin.courses.index') }}" class="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors group">
                    <span class="material-icons-outlined text-lg mr-1 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Kembali ke Daftar Course
                </a>
            </div>

            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-4 sm:px-0">
                <div>
                    <h1 class="text-2xl font-bold text-gray-900">Edit Course</h1>
                    <p class="text-gray-500 text-sm mt-1">Perbarui informasi materi pembelajaran.</p>
                </div>
            </div>

            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {{-- Action mengarah ke route update, jangan lupa tambahkan ID course --}}
                <form action="{{ route('admin.courses.update', $course->id) }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    @method('PUT') {{-- Wajib untuk method Update --}}
                    
                    <div class="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                        
                        <div class="p-8 lg:col-span-2 space-y-6">
                            
                            <div>
                                <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">Judul Materi / Course</label>
                                <input type="text" id="title" name="title" value="{{ old('title', $course->title) }}"
                                    class="w-full rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm py-2.5 px-4 @error('title') border-red-500 ring-red-100 @enderror" 
                                    required>
                                @error('title')
                                    <p class="mt-1 text-xs text-red-500 flex items-center gap-1">
                                        <span class="material-icons-outlined text-[14px]">error</span> {{ $message }}
                                    </p>
                                @enderror
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label for="category" class="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                                    <div class="relative">
                                        <select id="category" name="category" 
                                            class="w-full appearance-none rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm py-2.5 px-4 cursor-pointer @error('category') border-red-500 ring-red-100 @enderror">
                                            @foreach(['Web Development', 'Mobile Development', 'Data Science', 'UI/UX Design', 'Digital Marketing', 'Cyber Security'] as $cat)
                                                <option value="{{ $cat }}" {{ old('category', $course->category) == $cat ? 'selected' : '' }}>{{ $cat }}</option>
                                            @endforeach
                                        </select>
                                        <span class="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">expand_more</span>
                                    </div>
                                </div>

                                <div>
                                    <label for="instructor" class="block text-sm font-semibold text-gray-700 mb-2">Instruktur / Sumber</label>
                                    <div class="relative">
                                        <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">person</span>
                                        <input type="text" id="instructor" name="instructor" value="{{ old('instructor', $course->instructor) }}"
                                            class="w-full pl-10 rounded-xl border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-sm py-2.5 px-4 @error('instructor') border-red-500 ring-red-100 @enderror" 
                                            required>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="p-8 bg-gray-50/50 lg:col-span-1" x-data="{ photoName: null, photoPreview: '{{ $course->thumbnail ? asset('storage/' . $course->thumbnail) : null }}' }">
                            <label class="block text-sm font-semibold text-gray-700 mb-4">Thumbnail Gambar</label>
                            
                            <input type="file" id="thumbnail" name="thumbnail" class="hidden" accept="image/*"
                                x-ref="photo"
                                x-on:change="
                                    photoName = $refs.photo.files[0].name;
                                    const reader = new FileReader();
                                    reader.onload = (e) => { photoPreview = e.target.result; };
                                    reader.readAsDataURL($refs.photo.files[0]);
                                ">

                            <div class="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group bg-white"
                                 @click="$refs.photo.click()">
                                
                                {{-- Tampilan default jika belum ada gambar sama sekali --}}
                                <div x-show="!photoPreview" class="text-center p-6 transition-opacity" :class="{'opacity-50': photoPreview}">
                                    <div class="bg-indigo-50 text-indigo-500 rounded-full p-3 inline-flex mb-3">
                                        <span class="material-icons-outlined text-2xl">add_photo_alternate</span>
                                    </div>
                                    <p class="text-sm font-medium text-gray-600">Klik untuk ganti gambar</p>
                                </div>

                                {{-- Image Preview (Gambar Lama atau Baru) --}}
                                <div x-show="photoPreview" style="display: none;" class="absolute inset-0 w-full h-full">
                                    <span class="block w-full h-full bg-cover bg-center bg-no-repeat"
                                          x-bind:style="'background-image: url(\'' + photoPreview + '\');'">
                                    </span>
                                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span class="text-white text-xs font-medium border border-white px-3 py-1 rounded-full">Ganti Gambar</span>
                                    </div>
                                </div>
                            </div>
                            
                            <p class="text-center text-xs text-gray-400 mt-4">
                                Biarkan kosong jika tidak ingin mengubah gambar.
                            </p>
                        </div>
                    </div>

                    <div class="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
                        <a href="{{ route('admin.courses.index') }}" 
                           class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-100 hover:text-gray-900 transition-colors">
                            Batal
                        </a>
                        <button type="submit" 
                                class="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2">
                            <span class="material-icons-outlined text-lg">save</span>
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</x-app-layout>