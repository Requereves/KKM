<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Halaman "Lihat Semua Notifikasi" (Route: /notifications)
     */
    public function index()
    {
        // Ambil notifikasi user saat ini dengan pagination 15 item per halaman
        $notifications = auth()->user()->notifications()->paginate(15)->through(function ($n) {
            return [
                'id' => $n->id,
                'type' => class_basename($n->type),
                'data' => $n->data,
                'read_at' => $n->read_at,
                'created_at_human' => $n->created_at->diffForHumans(), // Contoh: "2 minutes ago"
                'created_at_date' => $n->created_at->format('d M Y, H:i'), // Contoh: "15 Oct 2023, 10:00"
            ];
        });

        // Render ke komponen React (Admin/Notifications/Index.jsx)
        return Inertia::render('Admin/Notifications/Index', [
            'notifications' => $notifications
        ]);
    }

    /**
     * Tandai satu notifikasi sebagai sudah dibaca
     */
    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
        }

        return Redirect::back();
    }

    /**
     * Tandai SEMUA notifikasi sebagai sudah dibaca
     */
    public function markAllRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        
        return Redirect::back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }

    /**
     * Hapus satu notifikasi (Hard Delete)
     * Method baru untuk fitur "Hapus" (silang/sampah)
     */
    public function destroy($id)
    {
        $notification = auth()->user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->delete();
        }

        return Redirect::back()->with('success', 'Notifikasi berhasil dihapus.');
    }
}