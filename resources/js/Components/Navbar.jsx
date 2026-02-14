import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { DICTIONARY } from '../types';

const Navbar = ({ darkMode, toggleDarkMode, language = 'id' }) => {
    const { url, props } = usePage();
    const { auth } = props;
    const t = DICTIONARY[language] || DICTIONARY['id'];

    // State untuk dropdown profil
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // ✅ State baru untuk Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    // Helper class styling link navbar (DESKTOP)
    const linkClass = (path) => `
        px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md
        ${isActive(path) 
            ? 'text-white border-b-2 border-indigo-500 bg-slate-800/50' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800 hover:border-b-2 hover:border-slate-600'}
    `;

    // ✅ Helper class styling link navbar (MOBILE)
    const mobileLinkClass = (path) => `
        block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200
        ${isActive(path)
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
    `;

    // Logic Avatar
    const userAvatar = auth.user.avatar_url 
        ? auth.user.avatar_url 
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=0D8ABC&color=fff`;

    return (
        <nav className="sticky top-0 z-50 bg-[#0f172a] border-b border-slate-800 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    
                    {/* SISI KIRI: Logo & Menu Desktop */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-2 group">
                            <img 
                                src="/images/logo.png" 
                                alt="Arahin.id Logo" 
                                className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
                            />
                            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">
                                Arahin<span className="text-indigo-400">.id</span>
                            </span>
                        </Link>
                        
                        {/* Menu Navigasi (Hanya Tampil di Desktop 'md') */}
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
                            <Link href={route('psychologist.index')} className={linkClass('/psychologist')}>
                                {t.psychologist || 'Psikolog'} 
                            </Link>
                        </div>
                    </div>

                    {/* SISI KANAN: Toggles & Profile & Mobile Button */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        
                        {/* Language Selector (Hidden on very small screens if needed, but kept here) */}
                        <div className="relative group hidden xs:block">
                            <button 
                                onClick={handleLanguageChange}
                                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 text-white hover:bg-slate-800 transition-all"
                            >
                                <img 
                                    src={language === 'id' ? "https://flagcdn.com/w20/id.png" : "https://flagcdn.com/w20/gb.png"} 
                                    alt="lang" 
                                    className="w-5 h-auto rounded-sm shadow-sm" 
                                />
                                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">{language}</span>
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
                        <div className="relative ml-1 sm:ml-2">
                            <div 
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-slate-800 rounded-xl transition-all border border-transparent hover:border-slate-700"
                            >
                                {/* AVATAR IMAGE */}
                                <img 
                                    src={userAvatar} 
                                    alt={auth.user.name} 
                                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-slate-600 shadow-sm"
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
                                <span className={`material-icons-outlined text-slate-500 text-sm transition-transform duration-200 hidden sm:block ${isDropdownOpen ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </div>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                    <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-3">
                                            <img src={userAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover border border-slate-600" onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.user.name)}&background=0D8ABC&color=fff` }} />
                                            <div className="overflow-hidden">
                                                <p className="text-sm text-white font-medium truncate">{auth.user.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{auth.user.email}</p>
                                            </div>
                                        </div>
                                        <div className="py-1">
                                            <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors" onClick={() => setIsDropdownOpen(false)}>
                                                <span className="material-icons-outlined text-lg">person</span>
                                                Profil Saya
                                            </Link>
                                        </div>
                                        <div className="my-1 border-t border-slate-800"></div>
                                        <div className="py-1">
                                            <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-900/10 hover:text-rose-300 transition-colors">
                                                <span className="material-icons-outlined text-lg">logout</span>
                                                Keluar
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ✅ MOBILE HAMBURGER BUTTON (Hanya Tampil di Mobile) */}
                        <div className="flex md:hidden ml-2">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none transition-colors"
                            >
                                <span className="material-icons-outlined text-2xl">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* ✅ MOBILE MENU PANEL (Dropdown Responsive) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top-2 duration-200">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link 
                            href={route('home')} 
                            className={mobileLinkClass('/')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.home}
                        </Link>
                        <Link 
                            href={route('courses.index')} 
                            className={mobileLinkClass('/courses')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.courses}
                        </Link>
                        <Link 
                            href={route('portfolio.index')} 
                            className={mobileLinkClass('/portfolio')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.competence}
                        </Link>
                        <Link 
                            href={route('psychologist.index')} 
                            className={mobileLinkClass('/psychologist')}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.psychologist || 'Psikolog'}
                        </Link>
                        
                        {/* Mobile Language Switcher (Optional, since header has one) */}
                        <div className="border-t border-slate-800 mt-4 pt-4 pb-2">
                            <div className="flex items-center px-3">
                                <button 
                                    onClick={handleLanguageChange}
                                    className="flex items-center gap-3 w-full text-slate-300 hover:text-white"
                                >
                                    <span className="material-icons-outlined text-lg">language</span>
                                    <span>Ganti Bahasa ({language === 'id' ? 'English' : 'Indonesia'})</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;