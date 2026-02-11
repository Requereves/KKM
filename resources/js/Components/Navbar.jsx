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

    const linkClass = (path) => `
        px-3 py-2 text-sm font-medium transition-colors duration-200
        ${isActive(path) 
            ? 'text-white border-b-2 border-indigo-500' 
            : 'text-slate-400 hover:text-white hover:border-b-2 hover:border-slate-600'}
    `;

    return (
        <nav className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* SISI KIRI: Logo & Menu */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                                A
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white">
                                Arahin<span className="text-indigo-400">.id</span>
                            </span>
                        </Link>
                        
                        {/* Menu Navigasi */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link href={route('home')} className={linkClass('/')}>{t.home}</Link>
                            <Link href={route('courses.index')} className={linkClass('/courses')}>{t.courses}</Link>
                            <Link href={route('portfolio.index')} className={linkClass('/competence')}>{t.competence}</Link>
                            <Link href="#" className={linkClass('/psychologist')}>{t.psychologist}</Link>
                        </div>
                    </div>

                    {/* SISI KANAN: Toggles & Profile */}
                    <div className="flex items-center gap-3">
                        
                        {/* Language Selector */}
                        <button 
                            onClick={handleLanguageChange}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-800 transition-all"
                        >
                            <img 
                                src={language === 'id' ? "https://flagcdn.com/w20/id.png" : "https://flagcdn.com/w20/gb.png"} 
                                alt="lang" 
                                className="w-5 h-auto rounded-sm" 
                            />
                            <span className="text-xs font-bold uppercase">{language}</span>
                        </button>

                        {/* Theme Toggle */}
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
                        >
                            <span className="material-icons-outlined text-xl">
                                {darkMode ? 'light_mode' : 'dark_mode'}
                            </span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative ml-2">
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 border border-blue-400/30">
                                    {auth.user.name.charAt(0)}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <p className="text-sm font-semibold text-white leading-none">
                                        {auth.user.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        Student Account
                                    </p>
                                </div>
                                <span className={`material-icons-outlined text-slate-500 text-sm transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                    <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                                        <span className="material-icons-outlined text-lg">person</span>
                                        Profil Saya
                                    </Link>
                                    <hr className="my-1 border-slate-700" />
                                    <Link 
                                        href={route('logout')} 
                                        method="post" 
                                        as="button" 
                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 transition-colors"
                                    >
                                        <span className="material-icons-outlined text-lg">logout</span>
                                        Keluar
                                    </Link>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;