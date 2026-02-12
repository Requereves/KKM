import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ConsultationIndex({ auth, consultations }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [search, setSearch] = useState('');

    // Setup Form untuk Update Status & Feedback
    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        status: 'pending',
        admin_feedback: '',
    });

    // --- HANDLERS ---
    
    const openModal = (item) => {
        setSelectedItem(item);
        setData({
            status: item.status,
            admin_feedback: item.admin_feedback || '', // Isi feedback lama jika ada
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kirim PUT request ke Admin Controller
        put(route('admin.consultations.update', selectedItem.id), {
            onSuccess: () => {
                closeModal();
                // Opsional: Tampilkan toast notifikasi (bisa pakai library atau flash message bawaan)
            },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data konsultasi ini?')) {
            router.delete(route('admin.consultations.destroy', id));
        }
    };

    // --- HELPERS FOR UI ---

    // Filter pencarian client-side sederhana
    const filteredData = consultations.filter(item => 
        item.user.name.toLowerCase().includes(search.toLowerCase()) ||
        item.subject.toLowerCase().includes(search.toLowerCase())
    );

    // Warna Badge Status
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 border-blue-200'; // Sedang diproses/dijadwalkan
            case 'done': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'rejected': return 'bg-rose-100 text-rose-800 border-rose-200';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    // Warna Badge Urgensi
    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'high': return 'text-rose-600 bg-rose-50 border border-rose-100';
            case 'medium': return 'text-orange-600 bg-orange-50 border border-orange-100';
            default: return 'text-slate-600 bg-slate-50 border border-slate-100';
        }
    };

    // Hitung Statistik Sederhana
    const stats = {
        total: consultations.length,
        pending: consultations.filter(c => c.status === 'pending').length,
        done: consultations.filter(c => c.status === 'done').length,
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Manajemen Konsultasi" />

            <div className="space-y-6">
                
                {/* 1. HEADER & STATS CARDS */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Konsultasi Psikolog</h2>
                        <p className="text-slate-500 dark:text-slate-400">Kelola permintaan konsultasi dan bimbingan mahasiswa.</p>
                    </div>
                </div>

                {/* Grid Statistik (Mirip page Admin Dashboard kamu) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                            <span className="material-icons-outlined text-3xl">folder_shared</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Permintaan</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.total}</h3>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-xl">
                            <span className="material-icons-outlined text-3xl">pending_actions</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Perlu Tindakan (Pending)</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.pending}</h3>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-950 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                            <span className="material-icons-outlined text-3xl">task_alt</span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Selesai</p>
                            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stats.done}</h3>
                        </div>
                    </div>
                </div>

                {/* 2. MAIN CONTENT (SEARCH & TABLE) */}
                <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                    
                    {/* Toolbar */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white">Daftar Masuk</h3>
                        <div className="relative w-full sm:w-72">
                            <span className="material-icons-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                            <input 
                                type="text" 
                                placeholder="Cari nama atau topik..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-800 dark:text-slate-200 font-bold uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Mahasiswa</th>
                                    <th className="px-6 py-4">Topik & Urgensi</th>
                                    <th className="px-6 py-4">Tgl. Harapan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredData.length > 0 ? (
                                    filteredData.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                                                        {item.user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 dark:text-white">{item.user.name}</p>
                                                        <p className="text-xs text-slate-500">{item.user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-slate-800 dark:text-white mb-1">{item.subject}</p>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${getUrgencyColor(item.urgency)}`}>
                                                    {item.urgency} Priority
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {new Date(item.preferred_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(item.status)}`}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button 
                                                        onClick={() => openModal(item)}
                                                        className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors tooltip"
                                                        title="Lihat Detail & Balas"
                                                    >
                                                        <span className="material-icons-outlined">visibility</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors tooltip"
                                                        title="Hapus Data"
                                                    >
                                                        <span className="material-icons-outlined">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                                            <span className="material-icons-outlined text-4xl mb-2 text-slate-300">search_off</span>
                                            <p>Data konsultasi tidak ditemukan.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* 3. MODAL DETAIL & REPLY */}
            {isModalOpen && selectedItem && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal}></div>

                    {/* Modal Content */}
                    <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white">Detail Konsultasi</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                            
                            {/* Info Mahasiswa */}
                            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                                        {selectedItem.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 dark:text-white">{selectedItem.user.name}</p>
                                        <p className="text-xs text-slate-500">Mahasiswa</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Topik:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedItem.subject}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Tanggal Harapan:</span>
                                        <span className="font-medium text-slate-800 dark:text-slate-200">
                                            {new Date(selectedItem.preferred_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Pesan Mahasiswa */}
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Pesan / Keluhan</label>
                                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-xl">
                                    "{selectedItem.description}"
                                </p>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            {/* Form Admin */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                
                                {/* Status Update */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Update Status</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="pending">Pending (Menunggu)</option>
                                        <option value="approved">Approved (Disetujui/Dijadwalkan)</option>
                                        <option value="done">Done (Selesai)</option>
                                        <option value="rejected">Rejected (Ditolak)</option>
                                    </select>
                                    {errors.status && <p className="text-rose-500 text-xs mt-1">{errors.status}</p>}
                                </div>

                                {/* Feedback / Balasan */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Balasan / Catatan Admin <span className="text-slate-400 font-normal">(Akan muncul di dashboard mahasiswa)</span>
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={data.admin_feedback}
                                        onChange={(e) => setData('admin_feedback', e.target.value)}
                                        placeholder="Contoh: Jadwal kamu disetujui pada jam 10.00 WIB, silakan datang ke Ruang BK."
                                        className="w-full rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-800 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    ></textarea>
                                    {errors.admin_feedback && <p className="text-rose-500 text-xs mt-1">{errors.admin_feedback}</p>}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        {!processing && <span className="material-icons-outlined text-sm">save</span>}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}