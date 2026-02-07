import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function StudentLayout({ children }) {
    const { auth } = usePage().props;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingUserDropdown, setShowingUserDropdown] = useState(false);
    
    // --- DARK MODE LOGIC ---
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
            
            {/* --- NAVBAR --- */}
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 w-full transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        
                        {/* Logo */}
                        <div className="flex shrink-0 items-center">
                            {/* Link ke Home Dashboard User */}
                            <Link href={route('home')} className="flex items-center gap-2">
                                <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
                                <span className="font-bold text-xl text-gray-800 dark:text-white hidden sm:block">
                                    Arahin<span className="text-blue-600">.id</span>
                                </span>
                            </Link>
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center sm:ms-6">
                            
                            {/* Theme Toggle Button */}
                            <button 
                                onClick={toggleTheme} 
                                className="mr-3 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5 transition-colors"
                            >
                                {darkMode ? (
                                    // Sun Icon
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"></path></svg>
                                ) : (
                                    // Moon Icon
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                                )}
                            </button>

                            {/* User Dropdown */}
                            <div className="relative ml-3">
                                <div>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                        onClick={() => setShowingUserDropdown(!showingUserDropdown)}
                                    >
                                        {auth.user.avatar ? (
                                            <img src={`/storage/${auth.user.avatar}`} alt="Avatar" className="w-8 h-8 rounded-full object-cover mr-2 border border-gray-200" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-2 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                                                {auth.user.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="hidden sm:block dark:text-gray-400">{auth.user.name}</div>
                                        <svg className="ms-1 hidden sm:block h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                                {showingUserDropdown && (
                                    <div 
                                        className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg origin-top-right bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                                        onClick={() => setShowingUserDropdown(false)} // Close on click
                                    >
                                        <div className="py-1">
                                            {/* Link Profile User (React) */}
                                            <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                Profile
                                            </Link>
                                            <Link href={route('logout')} method="post" as="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
                                                Log Out
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

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

            {/* Mobile Menu (Hanya muncul di layar kecil) */}
            <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link href={route('home')} className="block w-full ps-3 pe-4 py-2 border-l-4 border-indigo-400 text-start text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out">
                        Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}