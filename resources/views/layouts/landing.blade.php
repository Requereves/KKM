<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name', 'Arahin.id') }} - Ekosistem Validasi Kompetensi</title>
    
    {{-- Favicon --}}
    <link rel="icon" href="{{ asset('favicon.png') }}">

    {{-- Scripts & Fonts --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    {{-- Alpine.js (Wajib untuk Mobile Menu) --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        [x-cloak] { display: none !important; }
        
        .glass-nav {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(12px);
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
        }
        .hero-gradient {
            background: radial-gradient(circle at top right, #e0f2fe, transparent),
                        radial-gradient(circle at bottom left, #eff6ff, transparent);
        }
        .card-shelf {
            transition: transform 0.3s ease;
        }
        .card-shelf:hover {
            transform: translateY(-10px);
        }
    </style>
</head>
<body class="bg-white text-slate-900 font-sans antialiased">

    {{-- Navbar dengan Alpine.js Data --}}
    <nav class="fixed w-full z-50 glass-nav" x-data="{ mobileOpen: false }">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {{-- 1. LOGO --}}
            <div class="flex items-center gap-2 flex-shrink-0">
                <img src="{{ asset('favicon.png') }}" alt="Logo" class="w-10 h-10 object-contain">
                <a href="/" class="text-2xl font-extrabold text-slate-900 tracking-tight">
                    Arahin<span class="text-blue-600">.id</span>
                </a>
            </div>

            {{-- 2. DESKTOP MENU (Hidden di Mobile) --}}
            <div class="hidden md:flex items-center gap-8 font-semibold text-slate-600">
                <a href="#" class="hover:text-blue-600 transition">Beranda</a>
                <a href="#solusi" class="hover:text-blue-600 transition">Solusi</a>
                <a href="#fitur" class="hover:text-blue-600 transition">Fitur</a>
                <a href="#kontak" class="hover:text-blue-600 transition">Kontak</a>
            </div>
            
            {{-- 3. DESKTOP AUTH BUTTONS (Hidden di Mobile) --}}
            <div class="hidden md:flex items-center gap-4">
                @if (Route::has('login'))
                    @auth
                        <a href="{{ url('/dashboard') }}" class="px-6 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-full hover:bg-blue-100 transition">Dashboard</a>
                    @else
                        <a href="{{ route('login') }}" class="px-6 py-2.5 font-bold text-slate-600 hover:text-blue-600 transition">Masuk</a>

                        @if (Route::has('register'))
                            <a href="{{ route('register') }}" class="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">Daftar Sekarang</a>
                        @endif
                    @endauth
                @endif
            </div>

            {{-- 4. MOBILE HAMBURGER BUTTON (Muncul di Mobile) --}}
            <div class="md:hidden flex items-center">
                <button @click="mobileOpen = !mobileOpen" class="text-slate-800 p-2 focus:outline-none hover:bg-slate-100 rounded-lg transition">
                    <i class="fa-solid fa-bars text-2xl" x-show="!mobileOpen"></i>
                    <i class="fa-solid fa-xmark text-2xl" x-show="mobileOpen" x-cloak></i>
                </button>
            </div>
        </div>

        {{-- ✅ 5. MOBILE MENU DROPDOWN --}}
        <div x-show="mobileOpen" 
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 -translate-y-2"
             x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0"
             x-transition:leave-end="opacity-0 -translate-y-2"
             class="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl md:hidden flex flex-col px-6 py-6 gap-4"
             x-cloak>
            
            <a href="#" @click="mobileOpen = false" class="text-lg font-semibold text-slate-600 hover:text-blue-600">Beranda</a>
            <a href="#solusi" @click="mobileOpen = false" class="text-lg font-semibold text-slate-600 hover:text-blue-600">Solusi</a>
            <a href="#fitur" @click="mobileOpen = false" class="text-lg font-semibold text-slate-600 hover:text-blue-600">Fitur</a>
            <a href="#kontak" @click="mobileOpen = false" class="text-lg font-semibold text-slate-600 hover:text-blue-600">Kontak</a>
            
            <hr class="border-slate-200 my-2">

            @if (Route::has('login'))
                @auth
                    <a href="{{ url('/dashboard') }}" class="w-full text-center py-3 bg-blue-50 text-blue-600 font-bold rounded-xl">Dashboard</a>
                @else
                    <a href="{{ route('login') }}" class="w-full text-center py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50">Masuk</a>
                    
                    @if (Route::has('register'))
                        <a href="{{ route('register') }}" class="w-full text-center py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700">Daftar Sekarang</a>
                    @endif
                @endauth
            @endif
        </div>
    </nav>

    <main>
        {{-- Ini adalah tempat konten (Hero, Features, dll) akan muncul --}}
        @yield('content')
    </main>

    <footer id="kontak" class="bg-white pt-20 pb-10 border-t border-slate-100">
        <div class="max-w-7xl mx-auto px-6 text-center">
            <h2 class="text-3xl font-extrabold mb-4 text-blue-900">Siap Menjadi Lulusan Berdaya Saing?</h2>
            <p class="text-slate-600 mb-10 max-w-xl mx-auto">Bergabunglah dengan ekosistem digital Arahin.id dan tunjukkan kompetensi nyata Anda kepada industri.</p>
            
            @if (Route::has('register'))
                <a href="{{ route('register') }}" class="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition mb-20 inline-block">
                    Daftar Gratis Sekarang
                </a>
            @endif

            <div class="flex flex-col md:flex-row justify-between items-center border-t border-slate-100 pt-10 text-slate-400 text-sm font-medium gap-4">
                <div>© {{ date('Y') }} Arahin.id Project. Semua Hak Dilindungi.</div>
                <div class="flex gap-6">
                    <a href="#" class="hover:text-blue-600">Syarat & Ketentuan</a>
                    <a href="#" class="hover:text-blue-600">Kebijakan Privasi</a>
                </div>
            </div>
        </div>
    </footer>

</body>
</html>