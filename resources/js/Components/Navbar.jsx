import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { DICTIONARY } from '../types';

const Navbar = ({ darkMode, toggleDarkMode, language = 'id' }) => {
    const { url, props } = usePage();
    const { auth } = props;
    const t = DICTIONARY[language] || DICTIONARY['id'];

    // State untuk dropdown profil
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fungsi ganti bahasa via Laravel Route
    const handleLanguageChange = () => {
        const nextLang = language === 'id' ? 'en' : 'id';
        router.get(route('lang.switch', nextLang), {}, { preserveScroll: true });
    };

    // Helper untuk mendeteksi link aktif
    const isActive = (path) => {
        if (path === '/') return url === '/home' || url === '/';
        return url.startsWith(path);
    };

    // Helper class styling link navbar
    const linkClass = (path) => `
        px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md
        ${isActive(path) 
            ? 'text-white border-b-2 border-indigo-500 bg-slate-800/50' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800 hover:border-b-2 hover:border-slate-600'}
    `;

    // Logic Avatar (Gunakan URL dari Middleware HandleInertiaRequests)
    // Jika avatar_url null, pakai UI Avatars
    const userAvatar = auth.user.avatar_url 
        ? auth.user.avatar_url 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=0D8ABC&color=fff`;

    return (
        <nav className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* SISI KIRI: Logo & Menu */}
                    <div className="flex items-center gap-8">
                        {/* Logo Arahin.id */}
                        <Link href={route('home')} className="flex items-center gap-2 group">
                            <img 
                                src="/images/logo.png" 
                                alt="Arahin.id Logo" 
                                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
                            />
                            {/* Opsional: Jika ingin tetap ada teks di sebelah logo */}
                            <span className="font-bold text-xl tracking-tight text-white">
                                Arahin<span className="text-indigo-400">.id</span>
                            </span>
                        </Link>
                        
                        {/* Menu Navigasi */}
                        <div className="hidden md:flex items-center space-x-2">
                            <Link href={route('home')} className={linkClass('/')}>
                                {t.home}
                            </Link>
                            <Link href={route('courses.index')} className={linkClass('/courses')}>
                                {t.courses}
                            </Link>
                            <Link href={route('portfolio.index')} className={linkClass('/portfolio')}>
                                {t.competence}
                            </Link>
                            
                            {/* Link Psikolog */}
                            <Link href={route('psychologist.index')} className={linkClass('/psychologist')}>
                                {t.psychologist || 'Psikolog'} 
                            </Link>
                        </div>
                    </div>

                    {/* SISI KANAN: Toggles & Profile */}
                    <div className="flex items-center gap-3">
                        
                        {/* Language Selector */}
                        <div className="relative group">
                            <button 
                                onClick={handleLanguageChange}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-800 transition-all"
                            >
                                <img 
                                    src={language === 'id' ? "https://flagcdn.com/w20/id.png" : "https://flagcdn.com/w20/gb.png"} 
                                    alt="lang" 
                                    className="w-5 h-auto rounded-sm shadow-sm" 
                                />
                                <span className="text-xs font-bold uppercase tracking-wider">{language}</span>
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 text-slate-400 hover:text-yellow-400 hover:bg-slate-800 rounded-full transition-all duration-300"
                            title="Toggle Dark Mode"
                        >
                            <span className="material-icons-outlined text-xl">
                                {darkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative ml-2">
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
                            >
                                {/* AVATAR IMAGE */}
                                <img 
                                    src={userAvatar} 
                                    alt={auth.user.name} 
                                    className="h-9 w-9 rounded-full object-cover border border-slate-600 shadow-sm"
                                    // Fallback jika gambar error/hilang -> Balik ke UI Avatars
                                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=0D8ABC&color=fff` }}
                                />
                                
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-semibold text-white leading-none max-w-[100px] truncate">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1 capitalize">
                                        {auth.user.role || 'Student'}
                                    </p>
                                </div>
                                <span className={`material-icons-outlined text-slate-500 text-sm transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    {/* Backdrop transparan untuk menutup dropdown saat klik luar */}
                                    <div 
                                        className="fixed inset-0 z-40" 
                                        onClick={() => setIsDropdownOpen(false)}
                                    ></div>
                                    
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
                                            <img 
                                                src={userAvatar} 
                                                alt="avatar" 
                                                className="w-10 h-10 rounded-full object-cover border border-slate-600"
                                                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=0D8ABC&color=fff` }}
                                            />
                                            <div className="overflow-hidden">
                                                <p className="text-sm text-white font-medium truncate">{auth.user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="py-1">
                                            <Link 
                                                href={route('profile.edit')} 
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <span className="material-icons-outlined text-lg">person</span>
                                                Profil Saya
                                            </Link>
                                        </div>
                                        
                                        <div className="my-1 border-t border-slate-800"></div>
                                        
                                        <div className="py-1">
                                            <Link 
                                                href={route('logout')} 
                                                method="post" 
                                                as="button" 
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-900/10 hover:text-rose-300 transition-colors"
                                            >
                                                <span className="material-icons-outlined text-lg">logout</span>
                                                Keluar
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;