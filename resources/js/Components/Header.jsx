import React, { useState, useEffect, useRef } from 'react';

const Header = ({ 
  theme, 
  onToggleTheme, 
  lang, 
  onToggleLang, 
  user, 
  onProfileClick,
  pendingVerifications = [], 
  onNotificationClick
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Handle klik di luar dropdown notifikasi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper: Time Ago
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

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 shadow-sm transition-colors sticky top-0">
      
      {/* Mobile Menu Button */}
      <button className="md:hidden text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white">
        <span className="material-icons-outlined">menu</span>
      </button>
      
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        
        {/* 1. Language Toggle */}
        <button 
          onClick={onToggleLang}
          className="h-10 px-3 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
          title={lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
          <span className="material-icons-outlined text-lg">language</span>
          <span className="text-xs font-bold uppercase">{lang}</span>
        </button>

        {/* 2. Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <span className="material-icons-outlined">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* 3. Notifications System */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative"
          >
            <span className="material-icons-outlined">notifications</span>
            {pendingVerifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
            )}
          </button>

          {/* Dropdown Notifikasi */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                <h4 className="font-bold text-slate-800 dark:text-white">{lang === 'id' ? 'Notifikasi' : 'Notifications'}</h4>
                {pendingVerifications.length > 0 && (
                  <button 
                    onClick={() => { setShowNotifications(false); onNotificationClick(); }}
                    className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider hover:underline"
                  >
                    {lang === 'id' ? 'Lihat Semua' : 'View All'}
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {pendingVerifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center gap-2">
                    <span className="material-icons-outlined text-slate-300 text-4xl">notifications_off</span>
                    {lang === 'id' ? 'Tidak ada notifikasi baru' : 'No new notifications'}
                  </div>
                ) : (
                  pendingVerifications.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => { setShowNotifications(false); onNotificationClick(); }}
                      className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer flex gap-3 bg-indigo-50/30 dark:bg-indigo-900/10 transition-colors"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0 bg-indigo-600 shadow-sm shadow-indigo-500/50"></div>
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                          {lang === 'id' 
                            ? <><span className="font-bold">{item.name}</span> mengunggah dokumen <span className="text-indigo-600 dark:text-indigo-400">{item.category}</span></> 
                            : <><span className="font-bold">{item.name}</span> uploaded <span className="text-indigo-600 dark:text-indigo-400">{item.category}</span></>}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                          <span className="material-icons-outlined text-[10px]">schedule</span>
                          {getTimeAgo(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Separator */}
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* 4. User Profile */}
        <div 
          onClick={onProfileClick}
          className="flex items-center gap-3 pl-2 sm:pl-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-xl transition-all group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
        >
          <div className="text-right hidden sm:block leading-tight">
            <p className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {user?.name || 'User'}
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wide">
              {user?.role || 'Admin'}
            </p>
          </div>
          <div className="relative">
            <img 
              alt={user?.name} 
              className="w-9 h-9 rounded-full ring-2 ring-slate-100 dark:ring-slate-800 group-hover:ring-indigo-500 dark:group-hover:ring-indigo-400 transition-all object-cover shadow-sm" 
              // ✅ Menggunakan URL dari backend yang sudah ada timestampnya
              src={user?.avatar} 
              // ✅ Fallback jika gambar gagal load
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random` }}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;