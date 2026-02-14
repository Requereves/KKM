import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { translations } from '@/translations';

const Sidebar = ({ 
  lang = 'id', 
  currentView, 
  onSetView, 
  isOpen, // ✅ Props untuk status buka/tutup (Mobile)
  onClose // ✅ Props untuk fungsi tutup (Mobile)
}) => {
  const t = translations[lang];
  
  // 1. Ambil data URL dan User dari props Inertia
  const { url, props } = usePage(); 
  const userRole = props.auth.user.role; // Ambil role: 'admin' atau 'psychologist'

  // 2. Definisi Menu Lengkap
  const allMenuItems = [
    { 
      id: 'dashboard', 
      label: t.dashboard, 
      icon: 'dashboard', 
      routeName: 'admin.dashboard',
      roles: ['admin'] 
    },
    { 
      id: 'verification', 
      label: t.verification, 
      icon: 'verified', 
      routeName: 'admin.verification.index',
      roles: ['admin']
    },
    { 
      id: 'students', 
      label: t.students, 
      icon: 'people', 
      routeName: 'admin.students.index',
      roles: ['admin']
    },
    { 
      id: 'jobs', 
      label: t.jobs, 
      icon: 'work_outline', 
      routeName: 'admin.jobs.index',
      roles: ['admin']
    },
    { 
      id: 'courses', 
      label: t.training || 'Training', 
      icon: 'model_training', 
      routeName: 'admin.courses.index',
      roles: ['admin']
    }, 
    { 
      id: 'consultations', 
      label: t.consultation || 'Consultation (Psikolog)', 
      icon: 'support_agent', 
      routeName: 'admin.consultations.index',
      roles: ['admin', 'psychologist'] 
    },
    { 
      id: 'cms', 
      label: t.cms || 'Announcement (CMS)', 
      icon: 'campaign', 
      routeName: 'admin.cms.index',
      roles: ['admin']
    },
    { 
      id: 'stats', 
      label: t.stats || 'Statistical Reports', 
      icon: 'analytics', 
      routeName: 'admin.stats.index',
      roles: ['admin']
    },
    { 
      id: 'users', 
      label: t.manage_admins || 'Manage Admins', 
      icon: 'admin_panel_settings', 
      routeName: 'admin.users.index',
      roles: ['admin']
    },
  ];

  // 3. Filter menu berdasarkan role user
  const menuItems = allMenuItems.filter(item => item.roles.includes(userRole));

  // Tentukan Link Logo
  const logoHref = userRole === 'admin' 
    ? (route().has('admin.dashboard') ? route('admin.dashboard') : '#') 
    : (route().has('admin.consultations.index') ? route('admin.consultations.index') : '#');

  return (
    <>
      {/* ✅ BACKDROP: Layar gelap di belakang sidebar saat mode mobile */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
      ></div>

      {/* ✅ SIDEBAR CONTAINER: PERBAIKAN LAYOUT */}
      {/* - Kami MENGHAPUS 'md:static' dan 'md:inset-auto'.
          - Sekarang Sidebar kembali menjadi 'fixed' (melayang) di desktop.
          - Ini akan cocok dengan margin 'md:ml-64' yang ada di layout/dashboard Anda.
      */}
      <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 h-screen flex flex-col flex-shrink-0
          bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 
          transform transition-transform duration-300 ease-in-out shadow-sm
          md:translate-x-0 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
      
        {/* Header Sidebar (Logo & Branding) */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800 justify-between">
          <Link 
            href={logoHref}
            className="flex items-center gap-3 group"
            onClick={() => onSetView && onSetView(userRole === 'admin' ? 'dashboard' : 'consultations')}
          >
            <img 
              src="/images/logo.png" 
              alt="Arahin.id" 
              className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Arahin<span className="text-blue-600">.id</span>
            </span>
          </Link>

          {/* ✅ TOMBOL CLOSE (Hanya tampil di Mobile) */}
          <button 
            onClick={onClose} 
            className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors focus:outline-none"
          >
            <span className="material-icons-outlined text-2xl">close</span>
          </button>
        </div>
        
        {/* Navigasi Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const href = route().has(item.routeName) ? route(item.routeName) : '#';
            const isActive = url.startsWith(`/admin/${item.id}`) || (item.id === 'dashboard' && url === '/admin/dashboard');

            return (
              <Link
                key={item.id}
                href={href}
                onClick={() => {
                    if (onSetView) onSetView(item.id);
                    // ✅ Tutup sidebar otomatis saat menu diklik (UX Mobile)
                    if (onClose) onClose(); 
                }}
                className={`group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={`material-icons-outlined text-[22px] transition-colors ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'
                }`}>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
                
                {/* Active Indicator */}
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Sidebar (Logout) */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <Link 
            href={route('logout')} 
            method="post" 
            as="button" 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all shadow-sm hover:shadow border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <span className="material-icons-outlined text-[20px]">logout</span>
            {t.logout}
          </Link>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;