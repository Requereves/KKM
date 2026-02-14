import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
// ✅ Import Modal Baru
import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';

export default function NotificationsIndex({ auth, notifications }) {
    
    // --- STATE UNTUK MODAL ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedNotifId, setSelectedNotifId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Helper: Mark as Read
    const markAsRead = (id) => {
        router.patch(route('notifications.read', id), {}, { preserveScroll: true });
    };

    // Helper: Mark All Read
    const markAllRead = () => {
        router.patch(route('notifications.readAll'), {}, { preserveScroll: true });
    };

    // 1. Buka Modal saat tombol hapus diklik
    const openDeleteModal = (id) => {
        setSelectedNotifId(id);
        setIsDeleteModalOpen(true);
    };

    // 2. Eksekusi Hapus (Dipanggil dari Modal)
    const confirmDelete = () => {
        setIsDeleting(true);
        router.delete(route('notifications.destroy', selectedNotifId), { 
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteModalOpen(false);
                setIsDeleting(false);
                setSelectedNotifId(null);
            },
            onError: () => {
                setIsDeleting(false);
                alert('Gagal menghapus notifikasi.');
            }
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Semua Notifikasi" />

            <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifikasi</h1>
                        <p className="text-slate-500 text-sm">Riwayat aktivitas dan pemberitahuan sistem.</p>
                    </div>
                    {auth.user.unread_count > 0 && (
                        <button 
                            onClick={markAllRead}
                            className="text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                        >
                            Tandai Semua Dibaca
                        </button>
                    )}
                </div>

                {/* List Notifikasi */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {notifications.data.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {notifications.data.map((item) => (
                                <div 
                                    key={item.id} 
                                    className={`p-5 flex gap-4 transition-colors ${!item.read_at ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                                >
                                    {/* Icon */}
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${item.data.color || 'bg-slate-100 text-slate-500'}`}>
                                        <span className="material-icons-outlined text-xl">{item.data.icon || 'notifications'}</span>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`text-base ${!item.read_at ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                {item.data.title}
                                            </h4>
                                            <span className="text-xs text-slate-400 whitespace-nowrap ml-2" title={item.created_at_date}>
                                                {item.created_at_human}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 mb-2">
                                            {item.data.message}
                                        </p>
                                        
                                        <div className="flex items-center gap-4">
                                            {item.data.link && (
                                                <Link 
                                                    href={item.data.link} 
                                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                                >
                                                    Lihat Detail <span className="material-icons-outlined text-[10px]">arrow_forward</span>
                                                </Link>
                                            )}
                                            
                                            {!item.read_at && (
                                                <button 
                                                    onClick={() => markAsRead(item.id)}
                                                    className="text-xs text-slate-400 hover:text-slate-600"
                                                >
                                                    Tandai dibaca
                                                </button>
                                            )}

                                            {/* Tombol Hapus (Pemicu Modal) */}
                                            <button 
                                                onClick={() => openDeleteModal(item.id)}
                                                className="text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 ml-auto sm:ml-0 group"
                                                title="Hapus notifikasi permanen"
                                            >
                                                <span className="material-icons-outlined text-lg group-hover:scale-110 transition-transform">delete</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Unread Indicator */}
                                    {!item.read_at && (
                                        <div className="flex items-center">
                                            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-sm"></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-500">
                            <span className="material-icons-outlined text-4xl mb-2 text-slate-300">notifications_off</span>
                            <p>Tidak ada notifikasi saat ini.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {notifications.links && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex gap-1">
                            {notifications.links.map((link, key) => (
                                link.url ? (
                                    <Link
                                        key={key}
                                        href={link.url}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded text-sm ${link.active ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border hover:bg-slate-50'}`}
                                    />
                                ) : (
                                    <span 
                                        key={key} 
                                        dangerouslySetInnerHTML={{ __html: link.label }} 
                                        className="px-3 py-1 rounded text-sm text-slate-300 border bg-slate-50"
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ✅ RENDER POP-UP DI SINI */}
            <DeleteConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Hapus Notifikasi"
                message="Apakah Anda yakin ingin menghapus notifikasi ini? Tindakan ini tidak dapat dibatalkan dan notifikasi akan hilang permanen."
                processing={isDeleting}
            />

        </AuthenticatedLayout>
    );
}