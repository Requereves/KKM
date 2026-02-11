import React, { useRef, useState } from 'react';
import { usePage, useForm, Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { translations } from '@/translations';

export default function ProfilePage({ auth }) {
    // 1. Ambil data user & locale dari props Inertia
    const { props } = usePage();
    const user = auth.user;
    const lang = props.locale || 'en';
    const t = translations[lang];

    // --- LOGIC UPLOAD FOTO ---
    const fileInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Trigger klik input file hidden
    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    // Handle saat file dipilih -> Preview & Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 1. Set Preview Local (Agar terasa instan)
            setPhotoPreview(URL.createObjectURL(file));

            // 2. Kirim ke Backend
            const formData = new FormData();
            formData.append('photo', file);

            router.post(route('admin.profile.update-photo'), formData, {
                forceFormData: true,
                preserveScroll: true,
                onSuccess: () => {
                    // ✅ TEKNIK PRO: Force reload halaman penuh agar Header mengambil gambar baru (bukan dari cache)
                    router.visit(window.location.href, {
                        preserveScroll: true,
                        preserveState: false, // Penting: Reset state agar props auth diperbarui dari server
                    });
                },
                onError: (errors) => {
                    alert(errors.photo || 'Gagal mengupload foto. Pastikan format JPG/PNG dan ukuran di bawah 2MB.');
                }
            });
        }
    };
    // -------------------------

    // 2. Form Utama (Info & Password)
    const { data, setData, patch, processing, errors, reset, recentlySuccessful } = useForm({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        // Password fields (kosongkan defaultnya)
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // 3. Handle Submit ke Route Laravel
    const handleSubmit = (e) => {
        e.preventDefault();
        
        patch(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                // Reset field password agar aman
                reset('current_password', 'password', 'password_confirmation');
                
                // ✅ Refresh halaman jika nama berubah, agar Header ikut update
                router.visit(window.location.href, {
                    preserveScroll: true,
                    preserveState: false,
                });
            },
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={t.profile || "Profile"} />

            <div className="p-6 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.profile || "Profile"}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Update your personal information and security settings.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column - Profile Card & Photo Upload */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
                            
                            {/* Area Foto dengan Indikator Upload */}
                            <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                                <img 
                                    // Logic: Gunakan Preview (jika baru upload) -> Gunakan dari DB -> Gunakan Default UI Avatar
                                    src={
                                        photoPreview || 
                                        (user.avatar ? user.avatar : `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`)
                                    }
                                    alt="Profile" 
                                    className="w-32 h-32 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 transition-all"
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff` }}
                                />
                                <div className="absolute inset-0 rounded-full bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <span className="material-icons-outlined text-white text-2xl">camera_alt</span>
                                </div>
                            </div>
                            
                            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm capitalize">{user.role || 'Admin'}</p>

                            {/* Input File Tersembunyi */}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileChange}
                            />

                            <button 
                                type="button" 
                                onClick={handlePhotoClick}
                                className="mt-6 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <span className="material-icons-outlined text-sm">upload</span>
                                {t.upload_photo || "Change Photo"}
                            </button>
                        </div>
                    </div>

                    {/* Right Column - Edit Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            
                            {/* General Info Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span className="material-icons-outlined text-indigo-500">badge</span>
                                    {t.general_info || "General Information"}
                                </h3>
                            </div>
                            
                            {/* Inputs Section */}
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    
                                    {/* Name Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.full_name || "Full Name"}</label>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.name ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                                            />
                                        </div>
                                        {errors.name && <p className="text-xs text-rose-500 flex items-center gap-1"><span className="material-icons-outlined text-[10px]">error</span> {errors.name}</p>}
                                    </div>

                                    {/* Username Input */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.username || "Username"}</label>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">alternate_email</span>
                                            <input 
                                                type="text" 
                                                name="username"
                                                value={data.username}
                                                onChange={e => setData('username', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.username ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                                            />
                                        </div>
                                        {errors.username && <p className="text-xs text-rose-500 flex items-center gap-1"><span className="material-icons-outlined text-[10px]">error</span> {errors.username}</p>}
                                    </div>

                                    {/* Email Input */}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.email_address || "Email Address"}</label>
                                        <div className="relative">
                                            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                                            />
                                        </div>
                                        {errors.email && <p className="text-xs text-rose-500 flex items-center gap-1"><span className="material-icons-outlined text-[10px]">error</span> {errors.email}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Security Section Header */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                    <span className="material-icons-outlined text-indigo-500">lock</span>
                                    {t.security || "Security"}
                                </h3>

                                <div className="space-y-4">
                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.current_password || "Current Password"}</label>
                                        <input 
                                            type="password" 
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.current_password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                                            placeholder="••••••••"
                                        />
                                        {errors.current_password && <p className="text-xs text-rose-500 flex items-center gap-1"><span className="material-icons-outlined text-[10px]">error</span> {errors.current_password}</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* New Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.new_password || "New Password"}</label>
                                            <input 
                                                type="password" 
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.password ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                                                placeholder="••••••••"
                                            />
                                            {errors.password && <p className="text-xs text-rose-500 flex items-center gap-1"><span className="material-icons-outlined text-[10px]">error</span> {errors.password}</p>}
                                        </div>
                                        
                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.confirm_password || "Confirm Password"}</label>
                                            <input 
                                                type="password" 
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex items-center justify-end gap-3">
                                {recentlySuccessful && (
                                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-in fade-in slide-in-from-right-4">
                                        <span className="material-icons-outlined">check_circle</span>
                                        {t.profile_updated || "Profile updated successfully!"}
                                    </div>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {processing && <span className="material-icons-outlined animate-spin text-sm">sync</span>}
                                    {processing ? (t.saving || "Saving...") : (t.save_changes || "Save Changes")}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}