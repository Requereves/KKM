import React, { useRef } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Edit({ mustVerifyEmail, status }) {
    const user = usePage().props.auth.user;

    // --- DAFTAR KATEGORI COURSE ---
    // Opsi minat belajar yang tersedia
    const interestOptions = [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "UI/UX Design",
        "Digital Marketing",
        "Cyber Security"
    ];

    // --- FORM DATA HANDLER ---
    
    // 1. Form Update Profil (Nama, Email, & INTEREST)
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
        interest: user.interest || '', // 👈 Ambil data interest dari user
    });

    // 2. Form Update Password
    const { 
        data: passwordData, 
        setData: setPasswordData, 
        put: putPassword, 
        errors: passwordErrors, 
        processing: passwordProcessing, 
        recentlySuccessful: passwordRecentlySuccessful 
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // 3. Form Avatar
    const { data: avatarData, setData: setAvatarData, post: postAvatar, errors: avatarErrors } = useForm({
        avatar: null,
    });

    const fileInputRef = useRef(null);

    // --- HANDLERS ---

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const submitPassword = (e) => {
        e.preventDefault();
        putPassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setPasswordData({
                    current_password: '',
                    password: '',
                    password_confirmation: '',
                });
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            avatarData.avatar = file;
            
            // Upload Foto menggunakan POST murni
            postAvatar(route('profile.avatar'), {
                preserveScroll: true,
                forceFormData: true, 
            });
        }
    };

    // --- LOGIC REKOMENDASI CERDAS ---
    const getRecommendation = () => {
        const role = user.role || 'mahasiswa';
        
        // Logic Admin
        if (role === 'admin') {
            return {
                title: "Administrator Power",
                desc: "Sebagai Admin, kami merekomendasikan Anda untuk memeriksa menu 'CMS' setiap pagi.",
                icon: "admin_panel_settings",
                color: "text-purple-600 bg-purple-100"
            };
        } 
        
        // Logic Mahasiswa berdasarkan Interest
        if (data.interest) {
             return {
                title: `Fokus: ${data.interest}`,
                desc: `Kami telah menyesuaikan rekomendasi kursus di Dashboard sesuai minat ${data.interest} kamu!`,
                icon: "school",
                color: "text-blue-600 bg-blue-100"
            };
        } else {
            // Fallback jika belum pilih interest
            return {
                title: "Tentukan Minatmu",
                desc: `Halo ${data.name}, yuk pilih 'Minat Belajar' di form profil agar rekomendasi kursus lebih akurat!`,
                icon: "lightbulb",
                color: "text-yellow-600 bg-yellow-100"
            };
        }
    };

    const recommendation = getRecommendation();

    return (
        <StudentLayout>
            <Head title="Profile Settings" />

            <div className="animate-in fade-in duration-500">
                {/* HEADER SECTION */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Update informasi pribadi dan pengaturan keamanan akunmu.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* ========================================== */}
                    {/* KOLOM KIRI: KARTU PROFIL & AVATAR */}
                    {/* ========================================== */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
                            
                            {/* Avatar Wrapper */}
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                {user.avatar ? (
                                    <img 
                                        src={`/storage/${user.avatar}`} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all"
                                    />
                                ) : (
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128`} 
                                        alt="Profile" 
                                        className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all"
                                    />
                                )}

                                {/* Overlay Icon Kamera */}
                                <div className="absolute inset-0 rounded-full bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <span className="material-icons-outlined text-white text-2xl">camera_alt</span>
                                </div>
                            </div>

                            {/* Hidden Input File */}
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleAvatarChange}
                            />

                            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                            
                            {/* Role Badge */}
                            <div className="mt-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                                    {user.role}
                                </span>
                            </div>

                            {/* Tombol Upload */}
                            <button 
                                type="button" 
                                onClick={() => fileInputRef.current.click()}
                                className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-sm">upload</span>
                                Upload Foto
                            </button>

                            {avatarErrors.avatar && <p className="mt-2 text-xs text-red-500">{avatarErrors.avatar}</p>}
                        </div>

                        {/* ✨ SMART RECOMMENDATION CARD ✨ */}
                        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-icons-outlined text-6xl">lightbulb</span>
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                                    Saran Untukmu
                                </h3>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${recommendation.color}`}>
                                        <span className="material-icons-outlined">{recommendation.icon}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{recommendation.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                            {recommendation.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ========================================== */}
                    {/* KOLOM KANAN: FORM UPDATE */}
                    {/* ========================================== */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            
                            {/* 1. FORM GENERAL INFO */}
                            <form onSubmit={submitProfile}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-icons-outlined text-indigo-500">badge</span>
                                        Informasi Umum
                                    </h3>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    {/* Notifikasi Sukses */}
                                    {recentlySuccessful && (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium mb-4">
                                            <span className="material-icons-outlined text-base">check_circle</span>
                                            Profil berhasil diperbarui.
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-6">
                                        {/* Input Nama */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">person</span>
                                                <input 
                                                    type="text" 
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                                />
                                            </div>
                                            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                                        </div>

                                        {/* Input Email */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alamat Email</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">mail</span>
                                                <input 
                                                    type="email" 
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                                />
                                            </div>
                                            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                                        </div>

                                        {/* 👇 INPUT BARU: MINAT BELAJAR (INTEREST) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Minat Belajar</label>
                                            <div className="relative">
                                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">school</span>
                                                <select
                                                    value={data.interest}
                                                    onChange={(e) => setData('interest', e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all dark:text-white sm:text-sm appearance-none cursor-pointer"
                                                >
                                                    <option value="" disabled>Pilih Minat Utama...</option>
                                                    {interestOptions.map((option, index) => (
                                                        <option key={index} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                                {/* Icon Panah Dropdown */}
                                                <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400">Rekomendasi course di dashboard akan disesuaikan dengan pilihan ini.</p>
                                            {errors.interest && <span className="text-red-500 text-xs">{errors.interest}</span>}
                                        </div>

                                    </div>

                                    <div className="flex justify-end">
                                        <button 
                                            disabled={processing}
                                            type="submit" 
                                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                                        >
                                            {processing ? 'Menyimpan...' : 'Simpan Profil'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* PEMBATAS VISUAL */}
                            <div className="border-t border-slate-100 dark:border-slate-800"></div>

                            {/* 2. FORM UPDATE PASSWORD */}
                            <form onSubmit={submitPassword}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-icons-outlined text-indigo-500">lock</span>
                                        Keamanan Password
                                    </h3>
                                </div>

                                <div className="p-6 space-y-4">
                                     {/* Notifikasi Sukses Password */}
                                     {passwordRecentlySuccessful && (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium mb-4">
                                            <span className="material-icons-outlined text-base">check_circle</span>
                                            Password berhasil diubah.
                                        </div>
                                    )}

                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password Saat Ini</label>
                                        <input 
                                            type="password" 
                                            value={passwordData.current_password}
                                            onChange={(e) => setPasswordData('current_password', e.target.value)}
                                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                            placeholder="••••••••"
                                        />
                                        {passwordErrors.current_password && (
                                            <span className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                <span className="material-icons-outlined text-[14px]">error</span> {passwordErrors.current_password}
                                            </span> 
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password Baru</label>
                                            <input 
                                                type="password" 
                                                value={passwordData.password}
                                                onChange={(e) => setPasswordData('password', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                                placeholder="••••••••"
                                            />
                                            {passwordErrors.password && (
                                                <span className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                    <span className="material-icons-outlined text-[14px]">error</span> {passwordErrors.password}
                                                </span>
                                            )}
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Konfirmasi Password</label>
                                            <input 
                                                type="password" 
                                                value={passwordData.password_confirmation}
                                                onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white sm:text-sm"
                                                placeholder="••••••••"
                                            />
                                            {passwordErrors.password_confirmation && (
                                                <span className="text-red-500 text-xs flex items-center gap-1 mt-1">
                                                    <span className="material-icons-outlined text-[14px]">error</span> {passwordErrors.password_confirmation}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-end mt-4">
                                        <button 
                                            disabled={passwordProcessing}
                                            type="submit" 
                                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold rounded-lg shadow-lg transition-all flex items-center gap-2 text-sm disabled:opacity-50"
                                        >
                                            {passwordProcessing ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}