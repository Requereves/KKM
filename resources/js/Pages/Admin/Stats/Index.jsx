import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// --- TRANSLATIONS HELPER ---
// Saya sematkan disini agar tidak error saat dicopas
const translations = {
  en: {
    stats_title: "Statistical Reports",
    stats_subtitle: "Analyze job vacancies, applicant demographics, and market trends.",
    stats_total_jobs: "Total Jobs",
    active_jobs: "Active Jobs",
    stats_total_applicants: "Total Applicants",
    stats_avg_applicants: "Avg. Applicants",
    stats_industry_chart: "Labor Demand by Industry",
    stats_jobs: "Jobs",
    stats_type_chart: "Job Type Distribution"
  },
  id: {
    stats_title: "Laporan Statistik",
    stats_subtitle: "Analisis lowongan pekerjaan, demografi pelamar, dan tren pasar.",
    stats_total_jobs: "Total Lowongan",
    active_jobs: "Lowongan Aktif",
    stats_total_applicants: "Total Pelamar",
    stats_avg_applicants: "Rata-rata Pelamar",
    stats_industry_chart: "Permintaan Tenaga Kerja per Industri",
    stats_jobs: "Lowongan",
    stats_type_chart: "Distribusi Tipe Pekerjaan"
  }
};

export default function StatsPage({ auth, jobs = [], lang = 'en' }) {
  // Setup Translations
  const t = translations[lang] || translations['en'];

  // --- Data Processing (Logika Asli) ---

  // 1. Industry Demand (Derived from Job Titles)
  const getIndustry = (title) => {
    const t = title.toLowerCase();
    if (t.includes('developer') || t.includes('software') || t.includes('engineer')) return 'Technology';
    if (t.includes('designer') || t.includes('creative') || t.includes('ui/ux')) return 'Design';
    if (t.includes('data') || t.includes('analyst')) return 'Data Science';
    if (t.includes('marketing') || t.includes('seo') || t.includes('content')) return 'Marketing';
    if (t.includes('finance') || t.includes('accounting')) return 'Finance';
    return 'Other';
  };

  const industryCounts = {};
  jobs.forEach(job => {
    // Only count active or closed jobs, not drafts
    if (job.status !== 'draft') {
      const industry = getIndustry(job.title);
      industryCounts[industry] = (industryCounts[industry] || 0) + 1;
    }
  });

  const industryData = Object.keys(industryCounts).map(key => ({
    name: key,
    value: industryCounts[key]
  })).sort((a, b) => b.value - a.value);

  // 2. Job Type Distribution
  const typeCounts = {};
  jobs.forEach(job => {
     if(job.status !== 'draft') {
         typeCounts[job.type] = (typeCounts[job.type] || 0) + 1;
     }
  });
  
  const typeData = Object.keys(typeCounts).map(key => ({
    name: key,
    value: typeCounts[key]
  }));

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6'];

  // 3. Location Distribution (Logic kept although not rendered in JSX yet)
  const locationCounts = {};
  jobs.forEach(job => {
      if(job.status !== 'draft') {
          let loc = job.location.split(' ')[0].replace(',', '');
          if (loc === 'Jakarta') loc = 'Jakarta'; 
          locationCounts[loc] = (locationCounts[loc] || 0) + 1;
      }
  });
  // const locationData = ... (Not used in return, kept logic for safety)


  // 4. Metrics
  const activeJobsCount = jobs.filter(j => j.status === 'active').length;
  
  // Note: Pastikan data 'jobs' dari Laravel memiliki field 'applicants_count' atau 'applicantsCount'
  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applicantsCount || curr.applicants_count || 0), 0);
  const avgApplicants = activeJobsCount > 0 ? Math.round(totalApplicants / activeJobsCount) : 0;

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t.stats_title} />
      
      <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans">
        
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.stats_title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.stats_subtitle}</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <span className="material-icons-outlined text-2xl">work_outline</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t.stats_total_jobs}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{jobs.length}</h3>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <span className="material-icons-outlined text-2xl">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t.active_jobs}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{activeJobsCount}</h3>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                <span className="material-icons-outlined text-2xl">group</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t.stats_total_applicants}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{totalApplicants}</h3>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 rounded-lg">
                <span className="material-icons-outlined text-2xl">insights</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{t.stats_avg_applicants}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{avgApplicants}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart: Industry Demand */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t.stats_industry_chart}</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={industryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 12 }}
                      label={{ value: t.stats_jobs, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
                  />
                  <RechartsTooltip 
                    cursor={{ fill: '#f1f5f9', opacity: 0.5 }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#4F46E5" 
                    radius={[6, 6, 0, 0]} 
                    barSize={40}
                    animationDuration={1500}
                  >
                    {industryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Secondary Chart: Job Types */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">{t.stats_type_chart}</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {typeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-slate-500 font-medium ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
};