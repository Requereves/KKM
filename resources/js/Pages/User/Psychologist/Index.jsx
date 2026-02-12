import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

export default function Psychologist({ auth, consultations }) {
    const { flash } = usePage().props;

    // Setup Form dengan Inertia useForm
    const { data, setData, post, processing, errors, reset } = useForm({
        subject: '',
        urgency: 'low',
        preferred_date: '',
        description: '',
    });

    // Handle Submit
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('psychologist.store'), {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    };

    // Helper untuk warna badge status
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800';
            case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800';
            case 'done': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
            default: return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
        }
    };

    // Helper Label Status
    const getStatusLabel = (status) => {
        switch (status) {
            case 'approved': return 'Disetujui / Dijadwalkan';
            case 'rejected': return 'Ditolak';
            case 'done': return 'Selesai';
            default: return 'Menunggu Konfirmasi';
        }
    };

    return (
        <StudentLayout>
            <Head title="Layanan Psikologi" />

            <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 1. HERO SECTION */}
                <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
                    {/* Decorative Circles */}
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-white/10 blur-3xl"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 shadow-inner">
                            <span className="material-icons-outlined text-4xl">support_agent</span>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">Pusat Bimbingan & Konseling</h2>
                            <p className="text-indigo-100 text-sm md:text-base max-w-2xl leading-relaxed">
                                Kesehatan mental dan karirmu adalah prioritas kami. 
                                Ceritakan masalahmu, ajukan jadwal konsultasi, dan dapatkan bimbingan dari ahlinya. 
                                <span className="font-semibold text-white"> Privasi 100% Terjaga.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* NOTIFIKASI SUKSES */}
                {flash.success && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3 border border-emerald-100 dark:border-emerald-800 shadow-sm animate-bounce-in">
                        <span className="material-icons-outlined text-xl">check_circle</span>
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* 2. FORM PENGAJUAN (Kiri - Lebar 4/12) */}
                    <div className="lg:col-span-4 sticky top-24">
                        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                                <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">
                                    <span className="material-icons-outlined">edit_note</span>
                                </span>
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">Buat Pengajuan</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Topik */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Topik Masalah</label>
                                    <div className="relative">
                                        <span className="material-icons-outlined absolute left-3 top-3 text-slate-400 pointer-events-none">topic</span>
                                        <select 
                                            value={data.subject}
                                            onChange={e => setData('subject', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                                        >
                                            <option value="" disabled>Pilih Topik...</option>
                                            <option value="Bimbingan Karir">Bimbingan Karir & CV</option>
                                            <option value="Masalah Akademik">Masalah Akademik / Studi</option>
                                            <option value="Kesehatan Mental">Kesehatan Mental / Stress</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                    {errors.subject && <p className="text-rose-500 text-xs ml-1">{errors.subject}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Urgensi */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Urgensi</label>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-3 top-3 text-slate-400 pointer-events-none">priority_high</span>
                                            <select 
                                                value={data.urgency}
                                                onChange={e => setData('urgency', e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                                            >
                                                <option value="low">Normal</option>
                                                <option value="medium">Penting</option>
                                                <option value="high">Darurat</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {/* Tanggal */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Tgl. Harapan</label>
                                        <div className="relative">
                                            <input 
                                                type="date" 
                                                value={data.preferred_date}
                                                onChange={e => setData('preferred_date', e.target.value)}
                                                className="w-full pl-3 pr-3 py-2.5 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                                            />
                                        </div>
                                        {errors.preferred_date && <p className="text-rose-500 text-xs ml-1">{errors.preferred_date}</p>}
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Ceritakan Singkat</label>
                                    <textarea 
                                        rows="5"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Jelaskan gambaran masalah atau hal yang ingin kamu diskusikan..."
                                        className="w-full p-4 rounded-xl border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all resize-none"
                                    ></textarea>
                                    {errors.description && <p className="text-rose-500 text-xs ml-1">{errors.description}</p>}
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="w-full group relative bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 overflow-hidden disabled:opacity-70"
                                >
                                    <div className="relative z-10 flex items-center justify-center gap-2">
                                        {processing ? 'Mengirim...' : 'Kirim Permintaan'}
                                        <span className="material-icons-outlined text-sm group-hover:translate-x-1 transition-transform">send</span>
                                    </div>
                                    {/* Hover Effect Background */}
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* 3. RIWAYAT KONSULTASI (Kanan - Lebar 8/12) */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-slate-950 rounded-2xl p-6 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 h-full min-h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="p-2 bg-pink-50 dark:bg-pink-900/30 text-pink-600 rounded-lg">
                                        <span className="material-icons-outlined">history_edu</span>
                                    </span>
                                    <h3 className="font-bold text-slate-800 dark:text-white text-lg">Riwayat Konsultasi</h3>
                                </div>
                                <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                    Total: {consultations.length}
                                </span>
                            </div>

                            {consultations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-80 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm">
                                        <span className="material-icons-outlined text-slate-300 text-4xl">inbox</span>
                                    </div>
                                    <h4 className="text-slate-600 dark:text-slate-300 font-bold text-lg">Belum ada riwayat</h4>
                                    <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">
                                        Kamu belum pernah mengajukan konsultasi. Silakan isi formulir di sebelah kiri untuk memulai.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {consultations.map((item, index) => (
                                        <div 
                                            key={item.id} 
                                            className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-300"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            {/* Header Card */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${item.status === 'done' ? 'bg-blue-500' : (item.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500')}`}></div>
                                                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{item.subject}</h4>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(item.status)}`}>
                                                    {item.status === 'approved' && <span className="material-icons-outlined text-[14px]">event_available</span>}
                                                    {item.status === 'pending' && <span className="material-icons-outlined text-[14px]">hourglass_empty</span>}
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </div>
                                            
                                            {/* Body Card */}
                                            <div className="pl-5 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                                                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                                                    "{item.description}"
                                                </p>

                                                {/* Feedback Section */}
                                                {item.admin_feedback ? (
                                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="material-icons-outlined text-indigo-500 text-sm">admin_panel_settings</span>
                                                            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">Balasan Admin</span>
                                                        </div>
                                                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.admin_feedback}</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg inline-block">
                                                        <span className="material-icons-outlined text-sm">schedule_send</span>
                                                        Menunggu respon dari tim psikolog...
                                                    </div>
                                                )}
                                            </div>

                                            {/* Footer Card */}
                                            <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1" title="Tanggal Harapan">
                                                        <span className="material-icons-outlined text-sm">event</span>
                                                        {new Date(item.preferred_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1" title="Waktu Pengajuan">
                                                        <span className="material-icons-outlined text-sm">access_time</span>
                                                        {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div className="font-medium">
                                                    ID: #{item.id}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}