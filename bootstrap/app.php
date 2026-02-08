<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
// 👇 1. JANGAN LUPA IMPORT BARIS INI
use App\Http\Middleware\HandleInertiaRequests; 

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 👇 2. TAMBAHKAN KODE INI DI SINI
        $middleware->web(append: [

            HandleInertiaRequests::class,
            // Middleware Bahasa yang baru kita buat
            \App\Http\Middleware\Localization::class,
            \App\Http\Middleware\UpdateUserLastSeen::class,

        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();