import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react'; 

const Header = ({ 
  theme, 
  onToggleTheme, 
  lang, 
  onToggleLang, 
  pendingVerifications = [], 
  onNotificationClick
}) => {
  // 1. AMBIL DATA DARI GLOBAL STATE
  const { props } = usePage();
  const currentUser = props.auth.user; 

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  // ✅ PERBAIKAN UTAMA DI SINI:
  // Kita pakai 'avatar_url' (sesuai output console), bukan 'avatar'
  const avatarSrc = currentUser?.avatar_url 
    ? currentUser.avatar_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random&color=fff`;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 shadow-sm transition-colors sticky top-0">
      
      <button className="md:hidden text-slate-600 dark:text-slate-400 p-2">
        <span className="material-icons-outlined text-2xl">menu</span>
      </button>
      
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        
        <button onClick={onToggleLang} className="h-10 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
          <span className="material-icons-outlined text-lg">language</span>
          <span className="text-xs font-bold uppercase">{lang}</span>
        </button>

        <button onClick={onToggleTheme} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
          <span className="material-icons-outlined text-xl">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <div className="relative" ref={notificationRef}>
          <button onClick={() => setShowNotifications(!showNotifications)} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative">
            <span className="material-icons-outlined text-xl">notifications</span>
            {pendingVerifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
               <div className="p-4 text-center text-sm text-slate-500">Notifikasi</div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* User Profile System */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-2 sm:pl-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-xl transition-all group"
          >
            <div className="text-right hidden sm:block leading-tight">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 transition-colors truncate max-w-[120px]">
                {currentUser?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                {currentUser?.role || 'Admin'}
              </p>
            </div>
            
            <div className="relative">
              <img 
                src={avatarSrc} 
                alt={currentUser?.name} 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm" 
                onError={(e) => { 
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random&color=fff`;
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm"></span>
            </div>
          </div>

          {/* Dropdown Menu */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
               <div className="block sm:hidden px-4 py-3 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
               </div>

               <div className="py-1">
                  <Link href={route('profile.edit')} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <span className="material-icons-outlined text-[20px]">manage_accounts</span>
                    Pengaturan Profil
                  </Link>
               </div>

               <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

               <div className="py-1">
                  <Link href={route('logout')} method="post" as="button" className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors text-left">
                    <span className="material-icons-outlined text-[20px]">logout</span>
                    Keluar
                  </Link>
               </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;