<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewStudentRegistered extends Notification
{
    use Queueable;

    public $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['database']; // ✅ Simpan ke database
    }

    public function toArray($notifiable)
    {
        // Data ini yang akan dibaca di React (props.data)
        return [
            'title' => 'Mahasiswa Baru!',
            'message' => $this->message,
            'link' => route('admin.students.index'), // Link tujuan saat diklik
            'icon' => 'person_add', // Icon Material Design
            'color' => 'bg-emerald-100 text-emerald-600', // Warna icon
        ];
    }
}