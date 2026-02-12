import React, { useRef } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react'; // ✅ Import router

export default function Edit({ mustVerifyEmail, status }) {
    // Ambil data user dari props Inertia
    const user = usePage().props.auth.user;

    // --- DAFTAR KATEGORI COURSE ---
    const interestOptions = [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "UI/UX Design",
        "Digital Marketing",
        "Cyber Security"
    ];

    // --- FORM DATA HANDLER ---
    
    // 1. Form Update Profil (Nama, USERNAME, Email, & Interest)
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        username: user.username || '', // ✅ WAJIB: Tambahkan ini agar lolos validasi
        email: user.email,
        interest: user.interest || '',
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
        patch(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // ✅ FORCE REFRESH: Agar nama di Header & Sidebar langsung berubah
                router.visit(window.location.href, {
                    preserveScroll: true,
                    preserveState: false, 
                });
            },
        });
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
            postAvatar(route('profile.avatar'), {
                preserveScroll: true,
                forceFormData: true, 
                onSuccess: () => {
                    // Force Refresh halaman agar gambar berubah
                    window.location.reload(); 
                },
            });
        }
    };

    // --- LOGIC REKOMENDASI ---
    const getRecommendation = () => {
        const role = user.role || 'mahasiswa';
        
        if (role === 'admin') {
            return {
                title: "Administrator Power",
                desc: "Sebagai Admin, kami merekomendasikan Anda untuk memeriksa menu 'CMS' setiap pagi.",
                icon: "admin_panel_settings",
                color: "text-purple-600 bg-purple-100"
            };
        } 

        if (data.interest) {
             return {
                title: `Fokus: ${data.interest}`,
                desc: `Kami telah menyesuaikan rekomendasi kursus di Dashboard sesuai minat ${data.interest} kamu!`,
                icon: "school",
                color: "text-blue-600 bg-blue-100"
            };
        } else {
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Update informasi pribadi dan pengaturan keamanan akunmu.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* KOLOM KIRI: KARTU PROFIL */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
                            
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <img 
                                    src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128`} 
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all shadow-md"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=ffffff&size=128` }}
                                />
                                <div className="absolute inset-0 rounded-full bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <span className="material-icons-outlined text-white text-2xl">camera_alt</span>
                                </div>
                            </div>

                            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />

                            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                            
                            <div className="mt-1">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {user.role}
                                </span>
                            </div>

                            <button type="button" onClick={() => fileInputRef.current.click()} className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700">
                                <span className="material-icons-outlined text-sm">upload</span>
                                Upload Foto
                            </button>
                            {avatarErrors.avatar && <p className="mt-2 text-xs text-red-500">{avatarErrors.avatar}</p>}
                        </div>

                        {/* Recommendation Card */}
                        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><span className="material-icons-outlined text-6xl">lightbulb</span></div>
                            <div className="relative z-10">
                                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Saran Untukmu</h3>
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-lg ${recommendation.color}`}><span className="material-icons-outlined">{recommendation.icon}</span></div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{recommendation.title}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{recommendation.desc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: FORM UPDATE */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            
                            <form onSubmit={submitProfile}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-icons-outlined text-indigo-500">badge</span>
                                        Informasi Umum
                                    </h3>
                                </div>
                                
                                <div className="p-6 space-y-6">
                                    {recentlySuccessful && (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium mb-4">
                                            <span className="material-icons-outlined text-base">check_circle</span>
                                            Profil berhasil diperbarui.
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Nama Lengkap */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
                                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                                            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                                        </div>

                                        {/* Username (INPUT BARU ✅) */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Username</label>
                                            <input type="text" value={data.username} onChange={(e) => setData('username', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                                            {errors.username && <span className="text-red-500 text-xs">{errors.username}</span>}
                                        </div>

                                        {/* Email */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Alamat Email</label>
                                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white" />
                                            {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                                        </div>

                                        {/* Minat Belajar */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Minat Belajar</label>
                                            <div className="relative">
                                                <select value={data.interest} onChange={(e) => setData('interest', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer">
                                                    <option value="" disabled>Pilih Minat Utama...</option>
                                                    {interestOptions.map((option, index) => (
                                                        <option key={index} value={option}>{option}</option>
                                                    ))}
                                                </select>
                                                <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                                            </div>
                                            {errors.interest && <span className="text-red-500 text-xs">{errors.interest}</span>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button disabled={processing} type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-70">
                                            {processing ? 'Menyimpan...' : 'Simpan Profil'}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            <div className="border-t border-slate-100 dark:border-slate-800"></div>

                            {/* Form Password (Sama seperti sebelumnya) */}
                            <form onSubmit={submitPassword}>
                                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-icons-outlined text-indigo-500">lock</span> Keamanan Password
                                    </h3>
                                </div>
                                <div className="p-6 space-y-4">
                                    {passwordRecentlySuccessful && <div className="text-emerald-600 text-sm font-medium mb-2">Password berhasil diubah.</div>}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Password Saat Ini</label>
                                        <input type="password" value={passwordData.current_password} onChange={(e) => setPasswordData('current_password', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none dark:text-white" />
                                        {passwordErrors.current_password && <span className="text-red-500 text-xs">{passwordErrors.current_password}</span>}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Password Baru</label>
                                            <input type="password" value={passwordData.password} onChange={(e) => setPasswordData('password', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none dark:text-white" />
                                            {passwordErrors.password && <span className="text-red-500 text-xs">{passwordErrors.password}</span>}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Konfirmasi Password</label>
                                            <input type="password" value={passwordData.password_confirmation} onChange={(e) => setPasswordData('password_confirmation', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none dark:text-white" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button disabled={passwordProcessing} type="submit" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg shadow-lg transition-all text-sm disabled:opacity-50">Update Password</button>
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