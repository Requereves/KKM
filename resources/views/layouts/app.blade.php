<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" 
      x-data="{ 
          darkMode: localStorage.getItem('theme') === 'dark',
          sidebarOpen: false,
          toggleTheme() {
              this.darkMode = !this.darkMode;
              localStorage.setItem('theme', this.darkMode ? 'dark' : 'light');
              if (this.darkMode) {
                  document.documentElement.classList.add('dark');
              } else {
                  document.documentElement.classList.remove('dark');
              }
          }
      }"
      x-init="$watch('darkMode', val => val ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')); 
              if(darkMode) document.documentElement.classList.add('dark');"
      :class="{ 'dark': darkMode }">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'KKM App') }}</title>

    {{-- 1. FONT & ICONS --}}
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600,700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">

    {{-- 2. VITE (Opsional, jika kamu pakai build process) --}}
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    {{-- 3. TAILWIND CSS (CDN) --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Figtree', 'sans-serif'],
                    },
                    colors: {
                        indigo: { 50: '#eef2ff', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 900: '#312e81' },
                        slate: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617' }
                    }
                }
            }
        }
    </script>

    {{-- 4. CUSTOM STYLES (Untuk Animasi Halaman Profile) --}}
    <style>
        /* Animasi Fade In & Slide */
        .animate-in { animation: fadeIn 0.5s ease-out forwards; }
        .fade-in { opacity: 0; }
        .slide-in-from-right-4 { transform: translateX(1rem); }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateX(10px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        /* Scrollbar Halus */
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .dark ::-webkit-scrollbar-thumb { background: #475569; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
    </style>

    {{-- 5. ALPINE JS --}}
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="font-sans antialiased bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
    
    <div class="flex h-screen overflow-hidden">
        
        {{-- SIDEBAR --}}
        {{-- Pastikan file ini ada di resources/views/components/sidebar.blade.php --}}
        @include('components.sidebar')

        {{-- MAIN CONTENT AREA --}}
        <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            
            {{-- HEADER (Topbar) --}}
            {{-- Pastikan file ini ada di resources/views/components/header.blade.php --}}
            {{-- Jika belum ada, kamu bisa membuat file kosong dulu atau hapus baris ini sementara --}}
            @if(view()->exists('components.header'))
                @include('components.header')
            @endif

            {{-- CONTENT SLOT --}}
            <main class="w-full grow p-6">
                {{ $slot }}
            </main>
            
        </div>
    </div>

    @stack('scripts')
    
</body>
</html>