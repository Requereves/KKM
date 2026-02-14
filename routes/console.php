<?php

// Hapus notifikasi yang sudah dibaca DAN lebih lama dari 30 hari
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('notifications')
        ->whereNotNull('read_at')
        ->where('created_at', '<', now()->subDays(30))
        ->delete();
})->daily();
