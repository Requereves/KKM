import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { translations } from '@/translations';

const Sidebar = ({ lang = 'id', currentView, onSetView }) => {
  const t = translations[lang];
  const { url } = usePage(); // Mendapatkan URL saat ini untuk highlight menu aktif

  // Definisi Menu & Mapping ke Route Laravel
  const menuItems = [
    { 
      id: 'dashboard', 
      label: t.dashboard, 
      icon: 'dashboard', 
      routeName: 'admin.dashboard' 
    },
    { 
      id: 'verification', 
      label: t.verification, 
      icon: 'verified', 
      routeName: 'admin.verification.index',
    },
    { 
      id: 'students', 
      label: t.students, 
      icon: 'people', 
      routeName: 'admin.students.index' 
    },
    { 
      id: 'jobs', 
      label: t.jobs, 
      icon: 'work_outline', 
      routeName: 'admin.jobs.index' 
    },
    { 
      id: 'training', 
      label: t.training || 'Training', 
      icon: 'model_training', 
      routeName: 'admin.training.index' 
    }, 
    { 
      id: 'cms', 
      label: t.cms || 'Announcement (CMS)', 
      icon: 'campaign', 
      routeName: 'admin.cms.index' 
    },
    { 
      id: 'stats', 
      label: t.stats || 'Statistical Reports', 
      icon: 'analytics', 
      routeName: 'admin.stats.index' 
    },
    { 
      id: 'users', 
      label: t.manage_admins || 'Manage Admins', 
      icon: 'admin_panel_settings', 
      routeName: 'admin.users.index' 
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 hidden md:flex flex-col h-screen transition-colors fixed left-0 top-0 z-50 shadow-sm">
      
      {/* Header Sidebar (Logo & Branding Arahin.id) */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
        <Link 
          href={route().has('admin.dashboard') ? route('admin.dashboard') : '#'}
          className="flex items-center gap-3 group w-full"
          onClick={() => onSetView && onSetView('dashboard')}
        >
          {/* Logo Image */}
          <img 
            src="/images/logo.png" 
            alt="Arahin.id" 
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => { e.target.style.display = 'none'; }} // Fallback jika gambar tidak ada
          />
          
          {/* Text Branding: Arahin (Dark) + .id (Blue) */}
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Arahin<span className="text-blue-600">.id</span>
          </span>
        </Link>
      </div>
      
      {/* Navigasi Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          // Cek apakah route tersedia di Laravel
          const href = route().has(item.routeName) ? route(item.routeName) : '#';
          
          // Logika Active State: URL browser dimulai dengan admin/[id] atau exact match dashboard
          const isActive = url.startsWith(`/admin/${item.id}`) || (item.id === 'dashboard' && url === '/admin/dashboard');

          return (
            <Link
              key={item.id}
              href={href}
              onClick={() => onSetView && onSetView(item.id)}
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
              
              {/* Active Indicator (Optional Dot) */}
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
  );
};

export default Sidebar;