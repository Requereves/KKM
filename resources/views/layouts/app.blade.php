<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body class="font-sans antialiased">
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        
        {{-- 1. INCLUDE SIDEBAR (Posisi Fixed di Kiri) --}}
        @include('layouts.sidebar')

        {{-- 2. INCLUDE TOPBAR (Navigation) --}}
        {{-- Note: File navigation.blade.php sudah kita kasih margin-left (md:ml-64) sendiri tadi --}}
        @include('layouts.navigation')

        @isset($header)
        {{-- Tambahkan 'md:ml-64' agar header tidak tertutup sidebar di desktop --}}
        <header class="bg-white dark:bg-gray-800 shadow md:ml-64 transition-all duration-300">
            <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {{ $header }}
            </div>
        </header>
        @endisset

        <main>
            {{-- Tambahkan 'md:ml-64' agar konten utama tidak tertutup sidebar di desktop --}}
            <div class="md:ml-64 transition-all duration-300">
                {{ $slot }}
            </div>
        </main>
    </div>
    @stack('scripts')
</body>

</html>