<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\HandleInertiaRequests; 

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. Middleware Global untuk Web
        $middleware->web(append: [
            HandleInertiaRequests::class,
            \App\Http\Middleware\Localization::class,
            \App\Http\Middleware\UpdateUserLastSeen::class,
        ]);

        // 2. 🔥 DAFTARKAN ALIAS 'role' DI SINI
        // Ini wajib agar route middleware ['role:admin'] bisa jalan
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();