<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SystemNotification extends Notification
{
    use Queueable;

    // Kita siapkan variabel agar notifikasi ini dinamis
    public $title;
    public $message;
    public $url;
    public $icon;
    public $color;

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $message, $url = '#', $icon = 'notifications', $color = 'bg-indigo-100 text-indigo-600')
    {
        $this->title = $title;
        $this->message = $message;
        $this->url = $url;
        $this->icon = $icon;
        $this->color = $color;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database']; // ✅ Simpan ke database agar muncul di Header
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'link' => $this->url,
            'icon' => $this->icon,
            'color' => $this->color,
        ];
    }
}