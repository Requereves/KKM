import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

const Header = ({ 
  theme, 
  onToggleTheme, 
  lang, 
  onToggleLang, 
}) => {
  // 1. AMBIL DATA DARI GLOBAL STATE (Inertia)
  const { props } = usePage();
  const currentUser = props.auth.user;
  
  // Ambil notifikasi dari shared props (Middleware)
  // Default ke array kosong jika belum ada data
  const notifications = currentUser?.notifications || [];
  const unreadCount = currentUser?.unread_count || 0;

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  // Handle klik di luar dropdown untuk menutup menu
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

  // --- LOGIC NOTIFIKASI ---
  
  // Tandai satu notifikasi sudah dibaca
  const handleMarkAsRead = (id) => {
    router.patch(route('notifications.read', id), {}, {
        preserveScroll: true,
        onSuccess: () => {
            // Optional: Bisa tambah logic feedback visual di sini
        }
    });
  };

  // Tandai SEMUA sudah dibaca
  const handleMarkAllRead = () => {
    router.patch(route('notifications.readAll'), {}, {
        preserveScroll: true,
        onSuccess: () => setShowNotifications(false) // Tutup dropdown setelah mark all
    });
  };

  // Logic Avatar
  const avatarSrc = currentUser?.avatar_url 
    ? currentUser.avatar_url 
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.name || 'User')}&background=random&color=fff`;

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 z-20 shadow-sm transition-colors sticky top-0">
      
      {/* Mobile Menu Button */}
      <button className="md:hidden text-slate-600 dark:text-slate-400 p-2">
        <span className="material-icons-outlined text-2xl">menu</span>
      </button>
      
      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        
        {/* Language Toggle */}
        <button onClick={onToggleLang} className="hidden sm:flex h-10 px-3 items-center gap-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all">
          <span className="material-icons-outlined text-lg">language</span>
          <span className="text-xs font-bold uppercase">{lang}</span>
        </button>

        {/* Theme Toggle */}
        <button onClick={onToggleTheme} className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
          <span className="material-icons-outlined text-xl">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
        </button>

        {/* --- SISTEM NOTIFIKASI --- */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all relative"
          >
            <span className="material-icons-outlined text-xl">notifications</span>
            
            {/* Badge Merah Berdenyut (Hanya muncul jika ada unread) */}
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900">
                 <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>
              </span>
            )}
          </button>
          
          {/* Dropdown Notifikasi */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
               
               {/* Header Dropdown */}
               <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifikasi</h3>
                  {unreadCount > 0 && (
                    <button 
                        onClick={handleMarkAllRead} 
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors uppercase tracking-wider"
                    >
                        Tandai semua dibaca
                    </button>
                  )}
               </div>

               {/* List Notifikasi (Scrollable) */}
               <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => !item.read_at && handleMarkAsRead(item.id)}
                            className={`relative px-4 py-3 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 cursor-pointer ${!item.read_at ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                        >
                            {/* Icon Notifikasi */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.data.color || 'bg-slate-100 text-slate-500'}`}>
                                <span className="material-icons-outlined text-lg">{item.data.icon || 'notifications'}</span>
                            </div>

                            {/* Konten Text */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className={`text-sm truncate pr-2 ${!item.read_at ? 'font-bold text-slate-800 dark:text-white' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                                        {item.data.title || 'Notifikasi Baru'}
                                    </h4>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap ml-1">{item.created_at_human}</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                    {item.data.message}
                                </p>
                            </div>
                            
                            {/* Titik Biru (Unread Indicator) */}
                            {!item.read_at && (
                                <div className="flex flex-col justify-center pl-1">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-sm"></div>
                                </div>
                            )}
                        </div>
                    ))
                  ) : (
                    // Empty State (Kosong)
                    <div className="py-12 px-6 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-3">
                            <span className="material-icons-outlined text-3xl text-slate-300 dark:text-slate-600">notifications_off</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Belum ada notifikasi</p>
                        <p className="text-slate-400 text-xs mt-1">Kami akan memberi tahu Anda jika ada update penting.</p>
                    </div>
                  )}
               </div>

               {/* Footer Dropdown */}
               <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-center">
                 <Link 
                    href={route('notifications.index')} 
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors block w-full py-1"
                 >
                    Lihat Semua Notifikasi
                 </Link>
               </div>
            </div>
          )}
        </div>
        
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

        {/* 4. User Profile System */}
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

          {/* Dropdown Menu Profile */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
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