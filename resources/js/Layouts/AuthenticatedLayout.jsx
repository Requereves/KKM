import React, { useState, useEffect, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import { translations } from '@/translations';

export default function Authenticated({ user, header, children }) {
    const { url, props } = usePage();
    const { locale } = props; // Mengambil locale dari shared props

    // State untuk Theme & Language
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState(locale || 'id');

    // Load preferences saat mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        } else {
            // Default ke dark mode jika belum ada settingan (opsional)
            // setTheme('dark');
            // document.documentElement.classList.add('dark');
        }

        const savedLang = localStorage.getItem('lang');
        if (savedLang) {
            setLang(savedLang);
        }
    }, []);

    // --- Handlers ---
    const toggleTheme = useCallback(() => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    }, [theme]);

    const toggleLang = useCallback(() => {
        const newLang = lang === 'id' ? 'en' : 'id';
        setLang(newLang);
        localStorage.setItem('lang', newLang);
        
        // Panggil route switch bahasa di Laravel
        router.get(route('lang.switch', newLang), {}, { preserveScroll: true });
    }, [lang]);

    // Tentukan menu mana yang aktif berdasarkan URL (untuk Sidebar)
    const getCurrentView = () => {
        if (url.startsWith('/admin/dashboard')) return 'dashboard';
        if (url.startsWith('/admin/verification')) return 'verification';
        if (url.startsWith('/admin/students')) return 'students';
        if (url.startsWith('/admin/jobs')) return 'jobs';
        if (url.startsWith('/admin/courses') || url.startsWith('/admin/training')) return 'courses';
        if (url.startsWith('/admin/cms') || url.startsWith('/admin/announcements')) return 'cms';
        if (url.startsWith('/admin/stats')) return 'stats';
        if (url.startsWith('/admin/users')) return 'users';
        if (url.startsWith('/admin/consultations')) return 'consultations'; // Tambahan untuk Psikolog
        
        return ''; 
    };

    return (
        <div className={`flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
            
            {/* Sidebar */}
            <Sidebar
                lang={lang}
                currentView={getCurrentView()} 
                pendingCount={props.pendingCount || 0} 
            />

            <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
                
                {/* Header */}
                {/* Kita hapus prop 'user', 'onProfileClick' dsb karena Header sekarang mandiri */}
                <Header
                    theme={theme}
                    onToggleTheme={toggleTheme}
                    lang={lang}
                    onToggleLang={toggleLang}
                    // Data notifikasi masih perlu dipass jika logicnya ada di Layout/Parent
                    pendingVerifications={props.pendingVerifications || []}
                    onNotificationClick={() => router.get(route('admin.verification.index'))}
                />

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        
                        {/* Header Halaman (Title/Breadcrumb) */}
                        {header && (
                            <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                {header}
                            </div>
                        )}
                        
                        {/* Isi Halaman (Slot) */}
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {children}
                        </div>
                    </div>
                    
                    {/* Footer Global */}
                    <footer className="text-center text-[10px] text-slate-500 dark:text-slate-600 py-8 border-t border-slate-200 dark:border-slate-900 transition-colors mt-auto">
                        {translations[lang]?.footer?.replace('{heart}', '♥') || '© 2026 Arahin.id - Built with ♥ for Education'}
                    </footer>
                </main>
            </div>
        </div>
    );
}