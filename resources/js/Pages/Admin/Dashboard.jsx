import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';

// --- Imports Komponen ---
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import StatsCard from '@/Components/StatsCard';
import VerificationTable from '@/Components/VerificationTable';
import ChartsSection from '@/Components/ChartsSection';

// --- Imports Data & Translations ---
import { translations } from '@/translations';
import { 
  INITIAL_VERIFICATIONS, 
  COMPETENCY_CHART_DATA, 
  SKILL_GAP_DATA         
} from '@/constants'; 

export default function Dashboard(props) {
  // 1. Destructuring Props dari Controller (Data Backend)
  const { 
    auth, 
    stats, // Data statistik real-time dari controller
    recentVerifications // Data tabel verifikasi dari controller
  } = props;

  const { locale } = usePage().props;

  // --- LOGIC PERBAIKAN DATA (FALLBACK SYSTEM) ---
  
  // A. Verifikasi Data: Gunakan data server jika ada, jika tidak gunakan dummy (untuk demo awal)
  const hasServerData = recentVerifications && recentVerifications.length > 0;
  const displayVerifications = hasServerData ? recentVerifications : INITIAL_VERIFICATIONS;
  
  // B. Statistik Data: Ambil dari props 'stats'
  const displayPendingCount = stats?.pending_verifications ?? 0;
  const displayTotalStudents = stats?.total_students ?? 1240; // Fallback ke dummy jika 0
  const displayActiveJobs = stats?.active_jobs ?? 2;
  const displayPartners = stats?.industry_partners ?? 24;
  
  // C. Charts Data: Karena belum ada di controller, pakai dummy constants
  const displayCompetencyData = COMPETENCY_CHART_DATA; 
  const displaySkillData = SKILL_GAP_DATA; 

  // 2. State Management
  const [verifications, setVerifications] = useState(displayVerifications);
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState(locale || 'id'); 

  const user = auth.user;
  const t = translations[lang];

  // Hitung ulang pending count lokal
  const localPendingItems = verifications.filter(v => v.status === 'pending' || !v.status); 
  const localPendingCount = localPendingItems.length > 0 ? localPendingItems.length : displayPendingCount;

  // --- Effects ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('light'); 
    }

    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  useEffect(() => {
    if (recentVerifications) {
        setVerifications(recentVerifications);
    }
  }, [recentVerifications]);


  // --- Handlers ---
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  }, [theme]);

  const toggleLang = useCallback(() => {
    const newLang = lang === 'id' ? 'en' : 'id';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    router.reload({ only: ['locale'] });
  }, [lang]);

  const handleApprove = useCallback((id) => {
    if (confirm(t.confirm_approve || 'Setujui verifikasi ini?')) {
      setVerifications(prev => prev.filter(v => v.id !== id)); 
      
      router.patch(route('admin.verification.update', id), { 
        status: 'approved', feedback: 'Disetujui Admin' 
      }, { 
        preserveScroll: true,
        onSuccess: () => console.log('Approved successfully')
      });
    }
  }, [t]);

  const handleReject = useCallback((id) => {
    const reason = prompt('Masukkan alasan penolakan:', 'Dokumen tidak sesuai');
    if (reason) {
      setVerifications(prev => prev.filter(v => v.id !== id));

      router.patch(route('admin.verification.update', id), { 
        status: 'rejected', feedback: reason 
      }, { 
        preserveScroll: true,
        onSuccess: () => console.log('Rejected successfully')
      });
    }
  }, []);

  // --- NAVIGASI KE PAGE VERIFICATION (SHOW / INDEX WITH SELECTION) ---
  const handleViewVerificationDetail = useCallback((id) => {
    // Navigasi ke halaman verification index dengan query param selectedId
    // Ini akan men-trigger useEffect di VerificationPage temanmu untuk membuka detail item tsb
    if (route().has('admin.verification.index')) {
        router.visit(route('admin.verification.index', { selectedId: id }));
    } else {
        console.error("Route 'admin.verification.index' not defined!");
    }
  }, []);

  const navigateTo = (routeName) => {
      if (route().has(routeName)) {
          router.visit(route(routeName));
      } else {
          console.warn(`Route ${routeName} not found`);
          setCurrentView(routeName.split('.')[1]); 
      }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans transition-colors">
      <Head title={`Admin ${t.dashboard}`} />

      <Sidebar
        lang={lang}
        currentView={currentView}
        onSetView={setCurrentView}
        pendingCount={localPendingCount}
      />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onToggleLang={toggleLang}
          user={user}
          onProfileClick={() => router.get(route('admin.profile.edit'))}
          pendingVerifications={localPendingItems}
          onNotificationClick={() => router.get(route('admin.verification.index'))}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* --- VIEW: DASHBOARD --- */}
            {currentView === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Welcome Message */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {t.welcome} {user.name.split(' ')[0]}! 👋
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t.pending_alert.replace('{count}', localPendingCount.toString())}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title={t.need_verification} value={`${localPendingCount} ${t.files}`} description={t.immediate_action} icon="hourglass_empty" iconColor="amber-500" badge={localPendingCount > 0 ? { text: t.urgent, type: 'warning' } : undefined} hoverBorder="amber-500" />
                  <StatsCard title={t.total_students} value={displayTotalStudents.toLocaleString()} description={t.new_this_month} icon="school" iconColor="indigo-600" badge={{ text: `+${stats?.new_students_month || 12}`, type: 'success' }} hoverBorder="indigo-600" />
                  <StatsCard title={t.active_jobs} value={`${displayActiveJobs} ${t.jobs}`} description={t.open_apps} icon="work" iconColor="emerald-500" hoverBorder="emerald-500" />
                  <StatsCard title={t.partners} value={displayPartners.toString()} description={t.active_collab} icon="handshake" iconColor="purple-500" badge={{ text: t.verified, type: 'info' }} hoverBorder="purple-500" />
                </div>

                {/* Table and Quick Actions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-full">
                    {/* ✅ TABEL VERIFIKASI */}
                    <VerificationTable
                      items={localPendingItems.slice(0, 5)}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      // 👇 Saat icon mata diklik, fungsi handleViewVerificationDetail dipanggil
                      // Ini akan redirect ke VerificationPage dengan parameter ID
                      onView={handleViewVerificationDetail} 
                      // 👇 Saat link footer diklik, ke halaman index verifikasi
                      onViewAll={() => router.get(route('admin.verification.index'))}
                      lang={lang}
                    />
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-full transition-colors">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t.quick_actions}</h3>
                    <div className="space-y-3">
                      <button onClick={() => navigateTo('admin.jobs.index')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 group">
                        <div className="bg-white/20 p-2 rounded-lg"><span className="material-icons-outlined text-xl">work</span></div>
                        <div className="text-left"><p className="font-semibold text-sm">{t.post_job}</p><p className="text-xs text-indigo-100">{t.job_desc}</p></div>
                        <span className="material-icons-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                      </button>

                      <button onClick={() => navigateTo('admin.courses.index')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-all group">
                        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-2 rounded-lg group-hover:bg-amber-500/20"><span className="material-icons-outlined text-xl">cast_for_education</span></div>
                        <div className="text-left"><p className="font-semibold text-sm text-slate-900 dark:text-white">{t.training_info}</p><p className="text-xs text-slate-500">{t.training_desc}</p></div>
                      </button>

                      <button onClick={() => navigateTo('admin.cms.index')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-all group">
                        <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-500 p-2 rounded-lg group-hover:bg-pink-500/20"><span className="material-icons-outlined text-xl">rocket_launch</span></div>
                        <div className="text-left"><p className="font-semibold text-sm text-slate-900 dark:text-white">{t.open_project}</p><p className="text-xs text-slate-500">{t.project_desc}</p></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* CHART SECTION */}
                <ChartsSection 
                  lang={lang} 
                  competencyData={displayCompetencyData} 
                  skillData={displaySkillData} 
                />
              </div>
            )}

            {/* --- VIEW: UNDER CONSTRUCTION --- */}
            {currentView !== 'dashboard' && (
              <div className="py-20 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
                  <span className="material-icons-outlined text-8xl text-slate-300 dark:text-slate-700 relative z-10">construction</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Halaman "{currentView.charAt(0).toUpperCase() + currentView.slice(1)}"
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400">
                    Fitur ini sedang dalam tahap pengembangan akhir.
                  </p>
                </div>
                <button 
                  onClick={() => setCurrentView('dashboard')} 
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                >
                  Kembali ke Dashboard
                </button>
              </div>
            )}

            <footer className="text-center text-[10px] text-slate-500 dark:text-slate-600 py-8 border-t border-slate-200 dark:border-slate-900 transition-colors">
              {t.footer.replace('{heart}', '♥')}
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}