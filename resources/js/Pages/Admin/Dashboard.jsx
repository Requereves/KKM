import React, { useState, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';

// --- Imports Komponen ---
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';
import StatsCard from '@/Components/StatsCard';
import VerificationTable from '@/Components/VerificationTable';

// --- Recharts Imports (Library Chart) ---
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// --- Imports Data & Translations ---
import { translations } from '@/translations';
import { 
  INITIAL_VERIFICATIONS, 
  SKILL_GAP_DATA 
} from '@/constants'; 

// Warna-warna cantik untuk Pie Chart
const PIE_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Dashboard(props) {
  const { 
    auth, 
    stats, 
    recentVerifications, 
    chartData,      // Data Bar Chart (Gap Analysis)
    competencyData  // Data Pie Chart (Top Competencies)
  } = props;

  const { locale } = usePage().props;

  // --- LOGIC DATA PREPARATION ---
  
  // A. Verifikasi
  const hasServerData = recentVerifications && recentVerifications.length > 0;
  const displayVerifications = hasServerData ? recentVerifications : INITIAL_VERIFICATIONS;
  
  // B. Statistik
  const displayTotalStudents = stats?.total_students ?? 1240; 
  const displayActiveJobs = stats?.active_jobs ?? 2;
  const displayPartners = stats?.industry_partners ?? 24;
  
  // C. Bar Chart Data (Transform)
  const displaySkillData = (chartData && chartData.labels && chartData.labels.length > 0)
    ? chartData.labels.map((label, index) => ({
        name: label,
        studentSkill: chartData.studentSkills[index],
        industryDemand: chartData.industryDemand[index],
    }))
    : SKILL_GAP_DATA;

  // D. Pie Chart Data (Validation)
  const displayCompetencyData = (competencyData && competencyData.length > 0) 
    ? competencyData 
    : [
        { name: 'No Data', value: 100 }
      ]; 

  // --- State Management ---
  const [verifications, setVerifications] = useState(displayVerifications);
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState(locale || 'id'); 
  
  // ✅ STATE BARU: Untuk Mengontrol Sidebar di Mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const user = auth.user;
  const t = translations[lang];
  const localPendingItems = verifications.filter(v => v.status === 'pending' || !v.status); 
  const localPendingCount = localPendingItems.length > 0 ? localPendingItems.length : (stats?.pending_verifications ?? 0);

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
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    if (recentVerifications) setVerifications(recentVerifications);
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

  // ✅ Handler untuk Buka/Tutup Sidebar
  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const handleApprove = useCallback((id) => {
    if (confirm(t.confirm_approve || 'Setujui verifikasi ini?')) {
      setVerifications(prev => prev.filter(v => v.id !== id)); 
      router.patch(route('admin.verification.update', id), { status: 'approved', feedback: 'Disetujui Admin' }, { preserveScroll: true });
    }
  }, [t]);

  const handleReject = useCallback((id) => {
    const reason = prompt('Masukkan alasan penolakan:', 'Dokumen tidak sesuai');
    if (reason) {
      setVerifications(prev => prev.filter(v => v.id !== id));
      router.patch(route('admin.verification.update', id), { status: 'rejected', feedback: reason }, { preserveScroll: true });
    }
  }, []);

  const handleViewVerificationDetail = useCallback((id) => {
    if (route().has('admin.verification.index')) {
        router.visit(route('admin.verification.index', { selectedId: id }));
    }
  }, []);

  const navigateTo = (routeName) => {
      if (route().has(routeName)) {
          router.visit(route(routeName));
      } else {
          setCurrentView(routeName.split('.')[1]); 
      }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans transition-colors">
      <Head title={`Admin ${t.dashboard}`} />

      {/* ✅ KIRIM PROPS ke Sidebar agar bisa buka/tutup */}
      <Sidebar 
        lang={lang} 
        currentView={currentView} 
        onSetView={setCurrentView} 
        pendingCount={localPendingCount} 
        isOpen={isSidebarOpen}                // State status sidebar
        onClose={() => setIsSidebarOpen(false)} // Fungsi tutup sidebar
      />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        
        {/* ✅ KIRIM PROPS ke Header agar tombol burger berfungsi */}
        <Header
          theme={theme} onToggleTheme={toggleTheme} lang={lang} onToggleLang={toggleLang}
          user={user} onProfileClick={() => router.get(route('admin.profile.edit'))}
          pendingVerifications={localPendingItems} onNotificationClick={() => router.get(route('admin.verification.index'))}
          onToggleSidebar={toggleSidebar} // Fungsi buka/tutup
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">

            {currentView === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Welcome Message */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.welcome} {user.name.split(' ')[0]}! 👋</h1>
                  <p className="text-slate-600 dark:text-slate-400">{t.pending_alert.replace('{count}', localPendingCount.toString())}</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard title={t.need_verification} value={`${localPendingCount} ${t.files}`} description={t.immediate_action} icon="hourglass_empty" iconColor="amber-500" badge={localPendingCount > 0 ? { text: t.urgent, type: 'warning' } : undefined} hoverBorder="amber-500" />
                  <StatsCard title={t.total_students} value={displayTotalStudents.toLocaleString()} description={t.new_this_month} icon="school" iconColor="indigo-600" badge={{ text: `+${stats?.new_students_month || 0}`, type: 'success' }} hoverBorder="indigo-600" />
                  <StatsCard title={t.active_jobs} value={`${displayActiveJobs} ${t.jobs}`} description={t.open_apps} icon="work" iconColor="emerald-500" hoverBorder="emerald-500" />
                  <StatsCard title={t.partners} value={displayPartners.toString()} description={t.active_collab} icon="handshake" iconColor="purple-500" badge={{ text: t.verified, type: 'info' }} hoverBorder="purple-500" />
                </div>

                {/* Tables & Quick Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 h-full">
                    <VerificationTable items={localPendingItems.slice(0, 5)} onApprove={handleApprove} onReject={handleReject} onView={handleViewVerificationDetail} onViewAll={() => router.get(route('admin.verification.index'))} lang={lang} />
                  </div>
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-full">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t.quick_actions}</h3>
                    <div className="space-y-3">
                      <button onClick={() => navigateTo('admin.jobs.index')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:shadow-indigo-500/40 transition-all group">
                        <div className="bg-white/20 p-2 rounded-lg"><span className="material-icons-outlined text-xl">work</span></div>
                        <div className="text-left"><p className="font-semibold text-sm">{t.post_job}</p><p className="text-xs text-indigo-100">{t.job_desc}</p></div>
                        <span className="material-icons-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                      </button>
                      <button onClick={() => navigateTo('admin.courses.index')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border hover:border-amber-500 hover:bg-amber-500/5 transition-all group">
                        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-2 rounded-lg"><span className="material-icons-outlined text-xl">cast_for_education</span></div>
                        <div className="text-left"><p className="font-semibold text-sm text-slate-900 dark:text-white">{t.training_info}</p><p className="text-xs text-slate-500">{t.training_desc}</p></div>
                      </button>
                      <button onClick={() => navigateTo('admin.cms.index')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border hover:border-pink-500 hover:bg-pink-500/5 transition-all group">
                        <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-500 p-2 rounded-lg"><span className="material-icons-outlined text-xl">rocket_launch</span></div>
                        <div className="text-left"><p className="font-semibold text-sm text-slate-900 dark:text-white">{t.open_project}</p><p className="text-xs text-slate-500">{t.project_desc}</p></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* ✅ DUAL CHARTS SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    
                    {/* 1. PIE CHART: Top 5 Student Competencies */}
                    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Top 5 Student Competencies</h3>
                        <div className="h-[300px] w-full flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={displayCompetencyData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60} // Donut style
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {displayCompetencyData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend 
                                        layout="vertical" 
                                        verticalAlign="middle" 
                                        align="right"
                                        wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* 2. BAR CHART: Skill Gap Analysis */}
                    <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg">
                        <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-6">Skill Gap Analysis</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={displaySkillData}
                                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    barGap={8}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} opacity={0.2} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip 
                                        cursor={{ fill: '#374151', opacity: 0.1 }}
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
                                    <Bar name="STUDENT SKILL" dataKey="studentSkill" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={12} />
                                    <Bar name="INDUSTRY DEMAND" dataKey="industryDemand" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

              </div>
            )}

            {currentView !== 'dashboard' && (
              <div className="py-20 text-center space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Halaman "{currentView}"</h2>
                <button onClick={() => setCurrentView('dashboard')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg">Kembali</button>
              </div>
            )}

            <footer className="text-center text-[10px] text-slate-500 dark:text-slate-600 py-8 border-t border-slate-200 dark:border-slate-900">
              {t.footer.replace('{heart}', '♥')}
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}