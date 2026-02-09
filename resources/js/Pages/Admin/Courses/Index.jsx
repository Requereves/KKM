import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import TrainingForm from './TrainingForm'; // Kita akan buat dummy komponen ini di langkah 3

// Translation Dictionary (Dari kode kamu)
const translations = {
  en: {
    courses_title: "Training & Workshops",
    courses_subtitle: "Manage student competency improvement programs.",
    add_course: "Add Training",
    search_courses: "Search training, instructor...",
    filter_all: "All",
    filter_active: "Active",
    filter_upcoming: "Upcoming",
    filter_completed: "Completed",
    edit_course: "Edit Training",
    enrolled: "Enrolled",
    confirm_title: "Are you sure?",
    delete_course_confirm: "This action cannot be undone. This will permanently delete the training data.",
    cancel: "Cancel",
    confirm_delete: "Delete",
  }
};

export default function TrainingPage({ auth, courses, lang = 'en' }) {
  const t = translations[lang];

  // State UI
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Filter Logic (Client Side Filtering untuk data yang sudah di-load)
  const filteredCourses = courses.filter(course => {
    const matchesFilter = filter === 'all' || course.status === filter;
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Delete via Inertia
  const handleDeleteCourse = () => {
    if (confirmDeleteId) {
      router.delete(route('admin.courses.destroy', confirmDeleteId), {
        onSuccess: () => setConfirmDeleteId(null),
      });
    }
  };

  // --- Render Conditional Views ---

  // Jika view 'create', tampilkan Form
  if (view === 'create') {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-6">
                <TrainingForm 
                    lang={lang} 
                    mode="create"
                    onCancel={() => setView('list')} 
                />
            </div>
        </AuthenticatedLayout>
    );
  }

  // Jika view 'edit', tampilkan Form dengan data
  if (view === 'edit' && selectedCourse) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="p-6">
                <TrainingForm 
                    lang={lang} 
                    mode="edit"
                    initialData={selectedCourse} 
                    onCancel={() => { setView('list'); setSelectedCourse(null); }} 
                />
            </div>
        </AuthenticatedLayout>
    );
  }

  // Default View: List
  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Training & Workshops" />
      
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 font-sans animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.courses_title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{t.courses_subtitle}</p>
          </div>
          <button
            onClick={() => setView('create')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <span className="material-icons-outlined text-lg">add</span>
            {t.add_course}
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder={t.search_courses}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm text-slate-700 dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shrink-0 overflow-x-auto">
            {['all', 'upcoming', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {f === 'all' ? t.filter_all : f === 'active' ? t.filter_active : f === 'upcoming' ? t.filter_upcoming : t.filter_completed}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const percent = Math.round((course.participantsCount / course.maxParticipants) * 100);
            return (
              <div
                key={course.id}
                className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden h-full"
              >
                {/* Image & Type Badge */}
                <div className="h-40 w-full bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white shadow-sm backdrop-blur-sm">
                      {course.type}
                    </span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm backdrop-blur-sm ${
                      course.status === 'active' ? 'bg-emerald-500/90 text-white' :
                      course.status === 'upcoming' ? 'bg-indigo-500/90 text-white' :
                      'bg-slate-500/90 text-white'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    {course.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-auto space-y-3">
                    {/* Instructor & Date */}
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="material-icons-outlined text-sm text-slate-400">school</span>
                      <span className="truncate">{course.instructor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <span className="material-icons-outlined text-sm text-slate-400">event</span>
                      <span>{course.startDate} - {course.endDate}</span>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-slate-500 dark:text-slate-400">{t.enrolled}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{course.participantsCount}/{course.maxParticipants}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percent >= 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(percent, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2">
                  <button
                    onClick={() => { setSelectedCourse(course); setView('edit'); }}
                    className="flex-1 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {t.edit_course}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(course.id)}
                    className="w-10 flex items-center justify-center rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                  >
                    <span className="material-icons-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <span className="material-icons-outlined text-6xl text-slate-200 dark:text-slate-700">event_busy</span>
            <p className="text-slate-500 italic">No training courses found.</p>
          </div>
        )}

        {/* Confirmation Modal for Delete */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in zoom-in-95 duration-150">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500">
                <span className="material-icons-outlined text-4xl">delete</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.confirm_title}</h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 mb-6 font-medium">
                {t.delete_course_confirm}
              </p>

              <div className="flex w-full gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleDeleteCourse}
                  className="flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                >
                  {t.confirm_delete}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AuthenticatedLayout>
  );
};