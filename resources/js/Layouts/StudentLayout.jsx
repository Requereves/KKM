import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from '@/Components/Navbar'; // Pastikan path ke file Navbar baru sudah benar

export default function StudentLayout({ children }) {
    // Ambil data dari props global Inertia
    const { auth, language } = usePage().props;
    
    // --- DARK MODE LOGIC (Tetap di Layout agar konsisten) ---
    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark';
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => setDarkMode(!darkMode);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex flex-col">
            
            {/* 
               GANTI NAV LAMA DENGAN KOMPONEN NAVBAR BARU 
               Kita kirimkan props yang dibutuhkan Navbar
            */}
            <Navbar 
                darkMode={darkMode} 
                toggleDarkMode={toggleTheme} 
                language={language || 'id'} 
            />

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 w-full max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {children}
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 mt-auto">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        &copy; {new Date().getFullYear()} Arahin.id Project. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}