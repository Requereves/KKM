<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema; // Untuk settingan database kamu yang lama
use Illuminate\Support\Facades\URL;    // <--- TAMBAHAN PENTING: Untuk memaksa HTTPS

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Tetap pertahankan ini agar migrasi database aman
        Schema::defaultStringLength(191);

        // TAMBAHAN: Paksa HTTPS jika aplikasi berjalan di Production (Vercel)
        // Ini solusi untuk masalah layar putih / Mixed Content error
        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}