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

            // 👇 1. DATA USER LOGIN (Shared ke semua komponen React)
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    
                    // Update: Username & Interest
                    'username' => $request->user()->username, 
                    'interest' => $request->user()->interest,

                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    
                    // Avatar URL
                    'avatar_url' => $request->user()->avatar_url, 

                    // 👇 UPDATE PENTING: NOTIFICATIONS
                    // Mengirim data notifikasi ke Header.jsx
                    'notifications' => $request->user()->notifications()
                        ->latest()
                        ->take(3) // ✅ BATASI 3 NOTIFIKASI SAJA
                        ->get()
                        ->map(function ($n) {
                            return [
                                'id' => $n->id,
                                'type' => class_basename($n->type), // Nama class notifikasi
                                'data' => $n->data, // Isi pesan (title, message, link, icon)
                                'read_at' => $n->read_at,
                                'created_at_human' => $n->created_at->diffForHumans(), // Contoh: "2 minutes ago"
                            ];
                        }),
                    
                    // Menghitung TOTAL unread count (Tetap akurat meski dropdown dibatasi)
                    'unread_count' => $request->user()->unreadNotifications()->count(),
                ] : null,
            ],

            // 👇 2. PENGATURAN BAHASA (LOCALE)
            'locale' => app()->getLocale(),
            'language' => session('locale', 'id'),

            // 👇 3. FLASH MESSAGES (Untuk Notifikasi Sukses/Gagal)
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}