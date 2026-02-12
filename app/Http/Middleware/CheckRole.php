<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Cek apakah user memiliki salah satu role yang diizinkan
        if (! in_array($request->user()->role, $roles)) {
            // Jika Psikolog mencoba akses halaman Admin murni, lempar ke halaman konsultasi
            if ($request->user()->role === 'psychologist') {
                return redirect()->route('admin.consultations.index');
            }
            
            // Jika user biasa coba-coba masuk, lempar 403 Forbidden
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}