<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UpdateUserLastSeen
{
    public function handle($request, Closure $next)
    {
        if (Auth::check()) {
            // Update waktu
            DB::table('students')
                ->where('user_id', Auth::user()->id)
                ->update(['last_seen_at' => now()]);
        }

        return $next($request);
    }
}