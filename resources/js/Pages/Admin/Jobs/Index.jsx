import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { translations } from '@/translations';
import JobForm from './JobForm'; 
import JobApplicants from './JobApplicants';

export default function JobsPage({ auth, jobs, filters }) {
  const { locale } = usePage().props;
  const lang = locale || 'id';
  const t = translations[lang];

  const [filter, setFilter] = useState(filters?.status || 'all');
  const [search, setSearch] = useState(filters?.search || '');
  const isFirstRender = useRef(true);

  const [view, setView] = useState('list');
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailsModalJob, setDetailsModalJob] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
    }
    const timer = setTimeout(() => {
      router.get(
        route('admin.jobs.index'),
        { search: search, status: filter },
        { preserveState: true, preserveScroll: true, replace: true }
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [search, filter]);

  // Handlers
  const handleSaveJob = (jobData) => {
    if (view === 'create') {
      router.post(route('admin.jobs.store'), jobData, {
        onSuccess: () => setView('list'),
        preserveScroll: true
      });
    } else {
      router.put(route('admin.jobs.update', jobData.id), jobData, {
        onSuccess: () => { setView('list'); setSelectedJob(null); },
        preserveScroll: true
      });
    }
  };

  const handleDeleteJob = () => {
    if (confirmDeleteId) {
      router.delete(route('admin.jobs.destroy', confirmDeleteId), {
        onSuccess: () => { setConfirmDeleteId(null); setDetailsModalJob(null); },
        preserveScroll: true
      });
    }
  };

  const handleCloseJob = (jobId) => {
    router.put(route('admin.jobs.update', jobId), { status: 'closed' }, {
      onSuccess: () => {
        if (detailsModalJob && detailsModalJob.id === jobId) {
          setDetailsModalJob({ ...detailsModalJob, status: 'closed' });
        }
      },
      preserveScroll: true
    });
  };

  // Render Conditionals
  if (view === 'create') {
    return (
      <AuthenticatedLayout user={auth.user}>
         <Head title={t.add_job} />
         <div className="p-6">
            <JobForm lang={lang} onSubmit={handleSaveJob} onCancel={() => setView('list')} />
         </div>
      </AuthenticatedLayout>
    );
  }

  if (view === 'edit' && selectedJob) {
    return (
      <AuthenticatedLayout user={auth.user}>
         <Head title={t.edit_job} />
         <div className="p-6">
            <JobForm lang={lang} initialData={selectedJob} onSubmit={handleSaveJob} onCancel={() => { setView('list'); setSelectedJob(null); }} />
         </div>
      </AuthenticatedLayout>
    );
  }

  if (view === 'applicants' && selectedJob) {
    return (
      <AuthenticatedLayout user={auth.user}>
         <Head title={`${t.view_applicants} - ${selectedJob.title}`} />
         <div className="p-6">
            <JobApplicants lang={lang} job={selectedJob} onBack={() => { setView('list'); setSelectedJob(null); }} />
         </div>
      </AuthenticatedLayout>
    );
  }

  // MAIN VIEW
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t.jobs_title || "Job Vacancies"} />

      <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.jobs_title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.jobs_subtitle}</p>
          </div>
          <button 
            onClick={() => setView('create')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <span className="material-icons-outlined text-lg">add</span> {t.add_job}
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder={t.search_jobs}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shrink-0 overflow-x-auto">
            {['all', 'active', 'closed', 'draft'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {f === 'all' ? t.filter_all : f === 'active' ? t.filter_active : f === 'closed' ? t.filter_closed : t.filter_draft}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {jobs.data && jobs.data.length > 0 ? (
            jobs.data.map(job => (
            <div 
              key={job.id}
              onClick={() => setDetailsModalJob(job)}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
            >
              <div className="p-5 flex items-start gap-4">
                
                {/* --- PERUBAHAN DISINI: GANTI IMG DENGAN DIV INISIAL --- */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${job.color_bg || 'bg-indigo-100'} ${job.color_text || 'text-indigo-600'}`}>
                    {job.initials}
                </div>
                {/* --------------------------------------------------- */}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{job.company}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {job.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      job.status === 'ACTIVE' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500' 
                        : job.status === 'CLOSED'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-500'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-5 pb-5 flex-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="material-icons-outlined text-sm">location_on</span>
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="material-icons-outlined text-sm">payments</span>
                  {job.salary}
                </div>
              </div>

              <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 rounded-b-xl flex justify-between items-center">
                <div className="flex -space-x-2">
                    {[...Array(Math.min(3, Math.ceil((job.applicantsCount || 0)/5)))].map((_, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                          <span className="material-icons-outlined text-[12px]">person</span>
                      </div>
                    ))}
                    {(job.applicantsCount || 0) > 0 && (
                      <span className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 text-[8px] font-bold text-indigo-600 dark:text-indigo-300 flex items-center justify-center border-2 border-white dark:border-slate-800">
                        {job.applicantsCount}
                      </span>
                    )}
                    {(job.applicantsCount || 0) === 0 && (
                      <span className="text-[10px] text-slate-400 italic">No applicants</span>
                    )}
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {t.expires_on}: {job.deadline}
                </span>
              </div>
            </div>
          ))
          ) : (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center space-y-3">
                <span className="material-icons-outlined text-6xl text-slate-200 dark:text-slate-800">work_off</span>
                <p className="text-slate-500 italic">No jobs found.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {jobs.links && jobs.links.length > 3 && (
            <div className="flex justify-center mt-6">
                <div className="flex gap-1">
                {jobs.links.map((link, key) => (
                    <Link
                    key={key}
                    href={link.url || '#'}
                    preserveState
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        link.active 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : link.url 
                            ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700' 
                            : 'text-slate-300 cursor-not-allowed'
                    }`}
                    />
                ))}
                </div>
            </div>
        )}

        {/* Modal Detail */}
        {detailsModalJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                  {/* --- MODAL JUGA PAKAI INISIAL --- */}
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-md ${detailsModalJob.color_bg || 'bg-indigo-100'} ${detailsModalJob.color_text || 'text-indigo-600'}`}>
                    {detailsModalJob.initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{detailsModalJob.title}</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">{detailsModalJob.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">{detailsModalJob.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        detailsModalJob.status === 'ACTIVE' 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500' 
                          : detailsModalJob.status === 'CLOSED'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-500'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500'
                      }`}>
                        {detailsModalJob.status}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setDetailsModalJob(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                  <span className="material-icons-outlined">close</span>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.description}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{detailsModalJob.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">{t.requirements}</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {Array.isArray(detailsModalJob.requirements) && detailsModalJob.requirements.map((req, i) => (
                            <li key={i} className="text-sm text-slate-600 dark:text-slate-300">{req}</li>
                          ))}
                        </ul>
                      </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-3">
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">{t.salary}</label>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{detailsModalJob.salary}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">{t.location}</label>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{detailsModalJob.location}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">{t.posted_on}</label>
                          <p className="text-sm font-mono text-slate-900 dark:text-white">{detailsModalJob.postedAt}</p>
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 uppercase font-bold block">{t.expires_on}</label>
                          <p className="text-sm font-mono text-slate-900 dark:text-white">{detailsModalJob.deadline}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                       <button onClick={() => { setSelectedJob(detailsModalJob); setView('applicants'); setDetailsModalJob(null); }} className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg transition-all">
                        {t.view_applicants} ({(detailsModalJob.applicantsCount || 0)})
                      </button>
                      <div className="flex gap-2">
                          <button onClick={() => { setSelectedJob(detailsModalJob); setView('edit'); setDetailsModalJob(null); }} className="flex-1 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors">
                            {t.edit_job}
                          </button>
                          {detailsModalJob.status === 'DRAFT' ? (
                             <button onClick={() => setConfirmDeleteId(detailsModalJob.id)} className="flex-1 py-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium transition-colors">
                               {t.delete_job}
                             </button>
                          ) : detailsModalJob.status !== 'CLOSED' && (
                           <button onClick={() => handleCloseJob(detailsModalJob.id)} className="flex-1 py-2 bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-lg text-sm font-medium transition-colors">
                             {t.close_job}
                           </button>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in zoom-in-95 duration-150">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500">
                <span className="material-icons-outlined text-4xl">delete</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.confirm_title}</h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 mb-6 font-medium">{t.delete_confirm_msg}</p>
              <div className="flex w-full gap-3">
                <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all">{t.cancel}</button>
                <button onClick={handleDeleteJob} className="flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all bg-rose-600 hover:bg-rose-700 shadow-rose-600/20">{t.confirm_delete}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthenticatedLayout>
  );
};