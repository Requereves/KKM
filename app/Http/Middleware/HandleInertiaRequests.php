<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            
            // 👇 DATA USER LOGIN
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'username' => $request->user()->username, // Tambahkan ini
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    
                    // ✅ KUNCI PERUBAHAN DI SINI:
                    // Kita mapping property 'avatar' di frontend agar mengambil value dari 'avatar_url' (Accessor di Model)
                    // Ini yang membawa timestamp (?t=...) agar gambar refresh otomatis
                    'avatar' => $request->user()->avatar_url, 
                ] : null,
            ],

            'language' => session('locale', 'id'), 

            // 👇 FLASH MESSAGES
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}