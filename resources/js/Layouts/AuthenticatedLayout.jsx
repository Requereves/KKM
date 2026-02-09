import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ user, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { url } = usePage();

    // Menu Sidebar (Sesuai Screenshot Temanmu)
    const menus = [
        { label: 'Dashboard', route: 'admin.dashboard', icon: 'dashboard' },
        { label: 'Verification', route: 'verification.index', icon: 'verified_user' }, // Badge merah nanti bisa ditambah logikanya
        { label: 'Students Data', route: 'students.index', icon: 'people' },
        { label: 'Job Vacancy', route: 'jobs.index', icon: 'work' },
        { label: 'Training', route: 'admin.courses.index', icon: 'school' }, // Halaman yang sedang kita kerjakan
        { label: 'Announcement (CMS)', route: 'cms.index', icon: 'campaign' },
        { label: 'Statistical Reports', route: 'stats.index', icon: 'analytics' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-slate-800">
            {/* --- SIDEBAR --- */}
            <aside 
                className={`bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:relative lg:translate-x-0 flex flex-col`}
            >
                {/* Logo Area */}
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 font-bold text-xl text-gray-800">
                        <span className="material-icons-outlined text-indigo-600">school</span>
                        KKM APP
                    </div>
                </div>

                {/* Menu Items */}
                <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {menus.map((menu, index) => {
                        // Cek apakah route valid sebelum dipanggil
                        const routeUrl = route().has(menu.route) ? route(menu.route) : '#';
                        const isActive = url.startsWith('/admin/' + menu.route.split('.')[1]);

                        return (
                            <Link
                                key={index}
                                href={routeUrl} 
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                                    isActive 
                                    ? 'bg-indigo-50 text-indigo-600' 
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="material-icons-outlined text-[20px]">{menu.icon}</span>
                                {menu.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-100">
                    <Link 
                        href={route('logout')} 
                        method="post" 
                        as="button"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl w-full transition-colors"
                    >
                        <span className="material-icons-outlined">logout</span>
                        Logout
                    </Link>
                </div>
            </aside>

            {/* --- MAIN CONTENT WRAPPER --- */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                
                {/* TOP HEADER */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 lg:px-8 shadow-sm z-40">
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    >
                        <span className="material-icons-outlined">menu</span>
                    </button>
                    
                    {/* Kanan Header (User Profile) */}
                    <div className="flex items-center gap-4 ml-auto">
                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full relative">
                            <span className="material-icons-outlined">notifications</span>
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        
                        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-gray-900">{user?.name || 'Dhitan Hakim'}</div>
                                <div className="text-xs text-gray-500">Administrator</div>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                                <img 
                                    src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=random`} 
                                    alt="Profile" 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <main className="flex-1 overflow-auto bg-gray-50">
                    {children}
                </main>
            </div>

            {/* Overlay untuk Mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}