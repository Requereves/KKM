
import React, { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StatsCard from './components/StatsCard';
import VerificationTable from './components/VerificationTable';
import ChartsSection from './components/ChartsSection';
import VerificationPage from './components/VerificationPage';
import ProfilePage from './components/ProfilePage';
import StudentsPage from './components/StudentsPage';
import JobsPage from './components/JobsPage';
import StatsPage from './components/StatsPage';
import TrainingPage from './components/TrainingPage';
import { INITIAL_VERIFICATIONS, INITIAL_STUDENTS, INITIAL_JOBS } from './constants';
import { StudentVerification, Student, Job } from './types';
import { translations, Language } from './translations';

// Define User Profile Type locally for App usage
interface UserProfile {
  name: string;
  email: string;
  username: string;
  avatar: string;
  role: string;
}

const App: React.FC = () => {
  const [verifications, setVerifications] = useState<StudentVerification[]>(INITIAL_VERIFICATIONS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [lang, setLang] = useState<Language>('id');
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Specific state to handle navigation to a specific verification detail
  const [selectedVerificationId, setSelectedVerificationId] = useState<string | null>(null);

  // User State
  const [user, setUser] = useState<UserProfile>({
    name: 'Dhitan Hakim',
    role: 'Administrator',
    email: 'dhitanhakim@gmail.com',
    username: 'dhitan',
    avatar: 'https://picsum.photos/seed/dhitan/100/100'
  });

  // Load preferences on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    const savedLang = localStorage.getItem('lang') as Language | null;
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

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
  }, [lang]);

  const handleApprove = useCallback((id: string, feedback: string = '') => {
    setVerifications(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'approved', adminFeedback: feedback, verifiedAt: new Date().toISOString() } : v
    ));
  }, []);

  const handleReject = useCallback((id: string, feedback: string = '') => {
    setVerifications(prev => prev.map(v => 
      v.id === id ? { ...v, status: 'rejected', adminFeedback: feedback, verifiedAt: new Date().toISOString() } : v
    ));
  }, []);

  const handleViewVerificationDetail = useCallback((id: string) => {
    setSelectedVerificationId(id);
    setCurrentView('verification');
  }, []);

  // Reset selected ID when view changes if it's not verification
  useEffect(() => {
    if (currentView !== 'verification') {
      setSelectedVerificationId(null);
    }
  }, [currentView]);

  const handleUpdateUser = useCallback((updatedUser: UserProfile) => {
    setUser(updatedUser);
  }, []);

  const t = translations[lang];
  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const pendingVerifications = verifications.filter(v => v.status === 'pending');

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans transition-colors">
      <Sidebar 
        lang={lang} 
        currentView={currentView} 
        onSetView={setCurrentView} 
        pendingCount={pendingCount}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header 
          theme={theme} 
          onToggleTheme={toggleTheme} 
          lang={lang} 
          onToggleLang={toggleLang}
          user={user}
          onProfileClick={() => setCurrentView('profile')}
          pendingVerifications={pendingVerifications}
          onNotificationClick={() => setCurrentView('verification')}
        />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {currentView === 'dashboard' && (
              <>
                {/* Welcome Message */}
                <div className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t.welcome} {user.name.split(' ')[0]}! 👋</h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {t.pending_alert.replace('{count}', pendingCount.toString())}
                  </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatsCard 
                    title={t.need_verification}
                    value={`${pendingCount} ${t.files}`}
                    description={t.immediate_action}
                    icon="hourglass_empty"
                    iconColor="amber-500"
                    badge={pendingCount > 0 ? { text: t.urgent, type: 'warning' } : undefined}
                    hoverBorder="amber-500"
                  />
                  <StatsCard 
                    title={t.total_students}
                    value="1,240"
                    description={t.new_this_month}
                    icon="school"
                    iconColor="indigo-600"
                    badge={{ text: '+12', type: 'success' }}
                    hoverBorder="indigo-600"
                  />
                  <StatsCard 
                    title={t.active_jobs}
                    value={`${jobs.filter(j => j.status === 'active').length} ${t.jobs}`}
                    description={t.open_apps}
                    icon="work"
                    iconColor="emerald-500"
                    hoverBorder="emerald-500"
                  />
                  <StatsCard 
                    title={t.partners}
                    value="24"
                    description={t.active_collab}
                    icon="handshake"
                    iconColor="purple-500"
                    badge={{ text: t.verified, type: 'info' }}
                    hoverBorder="purple-500"
                  />
                </div>

                {/* Table and Quick Actions Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <VerificationTable 
                      items={verifications.filter(v => v.status === 'pending').slice(0, 5)}
                      onApprove={(id) => handleApprove(id, 'OK')}
                      onReject={(id) => handleReject(id, 'Tidak sesuai')}
                      onView={handleViewVerificationDetail}
                      lang={lang}
                    />
                    <div className="mt-4 text-center">
                      <button 
                        onClick={() => setCurrentView('verification')}
                        className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center gap-1 w-full"
                      >
                        Buka Manajemen Verifikasi Lengkap <span className="material-icons-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-full transition-colors">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t.quick_actions}</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setCurrentView('jobs')}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/30 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-0.5 group"
                      >
                        <div className="bg-white/20 p-2 rounded-lg">
                          <span className="material-icons-outlined text-xl">work</span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm">{t.post_job}</p>
                          <p className="text-xs text-indigo-100">{t.job_desc}</p>
                        </div>
                        <span className="material-icons-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                      </button>

                      <button 
                        onClick={() => setCurrentView('courses')}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 transition-all group"
                      >
                        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 p-2 rounded-lg group-hover:bg-amber-500/20">
                          <span className="material-icons-outlined text-xl">cast_for_education</span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.training_info}</p>
                          <p className="text-xs text-slate-500">{t.training_desc}</p>
                        </div>
                        <span className="material-icons-outlined ml-auto opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
                      </button>

                      <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500 hover:bg-pink-500/5 dark:hover:bg-pink-500/10 transition-all group">
                        <div className="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-500 p-2 rounded-lg group-hover:bg-pink-500/20">
                          <span className="material-icons-outlined text-xl">rocket_launch</span>
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{t.open_project}</p>
                          <p className="text-xs text-slate-500">{t.project_desc}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                <ChartsSection lang={lang} />
              </>
            )}

            {currentView === 'verification' && (
              <VerificationPage 
                items={verifications}
                onApprove={handleApprove}
                onReject={handleReject}
                lang={lang}
                initialSelectedId={selectedVerificationId}
              />
            )}

            {currentView === 'profile' && (
              <ProfilePage
                user={user}
                onUpdateUser={handleUpdateUser}
                lang={lang}
              />
            )}

            {currentView === 'students' && (
              <StudentsPage 
                students={students}
                lang={lang}
              />
            )}

            {currentView === 'jobs' && (
              <JobsPage 
                jobs={jobs}
                lang={lang}
              />
            )}

            {currentView === 'stats' && (
              <StatsPage 
                jobs={jobs}
                lang={lang}
              />
            )}

            {currentView === 'courses' && (
              <TrainingPage 
                lang={lang}
              />
            )}

            {currentView !== 'dashboard' && currentView !== 'verification' && currentView !== 'profile' && currentView !== 'students' && currentView !== 'jobs' && currentView !== 'stats' && currentView !== 'courses' && (
              <div className="py-20 text-center space-y-4">
                <span className="material-icons-outlined text-6xl text-slate-200 dark:text-slate-800">construction</span>
                <h2 className="text-xl font-bold dark:text-white">Halaman "{currentView}" sedang dalam pengembangan</h2>
                <button onClick={() => setCurrentView('dashboard')} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Kembali ke Dashboard</button>
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
};

export default App;
