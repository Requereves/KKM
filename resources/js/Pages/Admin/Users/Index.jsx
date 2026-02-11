import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdminIndex({ auth, admins }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form Handling dengan Inertia useForm
    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    // Handle Submit (Create Admin)
    const handleSubmit = (e) => {
        e.preventDefault();
        // ✅ Pastikan menggunakan route 'admin.users.store'
        post(route('admin.users.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset(); // Reset form jika sukses
            },
            // onError otomatis mengisi object 'errors'
        });
    };

    // Handle Delete
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
            // ✅ Pastikan menggunakan route 'admin.users.destroy'
            router.delete(route('admin.users.destroy', id), {
                preserveScroll: true
            });
        }
    };

    // Helper: Format Tanggal
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manage Admins" />

            <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans">
                
                {/* --- Header Section --- */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Management</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Kelola akun administrator sistem.</p>
                    </div>
                    <button 
                        onClick={() => { setIsModalOpen(true); clearErrors(); }}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                    >
                        <span className="material-icons-outlined text-xl">add</span>
                        <span className="font-medium">Tambah Admin</span>
                    </button>
                </div>

                {/* --- Table Section --- */}
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Admin User</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Bergabung</th>
                                    <th className="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar Initials */}
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                                                    {admin.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-slate-900 dark:text-white">{admin.name}</div>
                                                    <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded inline-block mt-1">
                                                        Super Admin
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                                            {admin.email}
                                        </td>
                                        <td className="p-4 text-sm text-slate-500 dark:text-slate-400">
                                            {formatDate(admin.created_at)}
                                        </td>
                                        <td className="p-4 text-right">
                                            {/* Tombol Hapus (Hanya muncul jika bukan akun sendiri) */}
                                            {auth.user.id !== admin.id ? (
                                                <button 
                                                    onClick={() => handleDelete(admin.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                                                    title="Hapus Admin"
                                                >
                                                    <span className="material-icons-outlined text-lg">delete</span>
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 italic pr-2">Akun Anda</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {admins.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="p-10 text-center text-slate-500 dark:text-slate-400">
                                            <span className="material-icons-outlined text-4xl mb-2 text-slate-300">person_off</span>
                                            <p>Belum ada data admin lain.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* --- MODAL ADD ADMIN --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    ></div>

                    {/* Modal Content */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                        
                        {/* Header Modal */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tambah Admin Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            
                            {/* Input Name */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className={`w-full rounded-lg border bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
                                    placeholder="Contoh: Budi Santoso"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                />
                                {errors.name && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><span className="material-icons-outlined text-[12px]">error</span> {errors.name}</p>}
                            </div>

                            {/* Input Email */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                <input 
                                    type="email" 
                                    className={`w-full rounded-lg border bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
                                    placeholder="admin@kkm.id"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                />
                                {errors.email && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><span className="material-icons-outlined text-[12px]">error</span> {errors.email}</p>}
                            </div>

                            {/* Input Password */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                                <input 
                                    type="password" 
                                    className={`w-full rounded-lg border bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 dark:border-slate-700'}`}
                                    placeholder="Min. 8 karakter"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                />
                                {errors.password && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><span className="material-icons-outlined text-[12px]">error</span> {errors.password}</p>}
                            </div>

                            {/* Input Password Confirmation */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password</label>
                                <input 
                                    type="password" 
                                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                    placeholder="Ketik ulang password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 mt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 rounded-lg"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {processing && <span className="material-icons-outlined animate-spin text-sm">sync</span>}
                                    {processing ? 'Menyimpan...' : 'Simpan Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}