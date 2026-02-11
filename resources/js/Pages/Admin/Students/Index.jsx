import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { translations } from '@/translations';

export default function StudentsPage({ auth, students, filters }) {
  // 1. Setup Locale & Translations
  const { locale } = usePage().props;
  const lang = locale || 'id';
  const t = translations[lang];

  // 2. State Management
  const [search, setSearch] = useState(filters?.search || '');
  const [majorFilter, setMajorFilter] = useState(filters?.major || 'all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Ref untuk mencegah request berulang saat pertama load
  const isFirstRender = useRef(true);

  // 3. Extract unique majors for filter dropdown
  // Catatan: Idealnya daftar jurusan dikirim dari backend agar lengkap (tidak hanya dari page ini)
  const majors = students.data 
    ? Array.from(new Set(students.data.map(s => s.major))) 
    : [];

  // 4. Server-Side Filtering & Searching Logic (Debounce)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      router.get(
        route('admin.students.index'),
        { search: search, major: majorFilter }, // Kirim parameter ke backend
        { 
          preserveState: true, 
          preserveScroll: true, 
          replace: true 
        }
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [search, majorFilter]);

  // 5. Handle Export CSV
  const handleExport = () => {
    // Validasi: Pastikan ada data untuk diexport
    if (!students.data || students.data.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ['Name', 'NIM', 'Major', 'Year', 'Email', 'Phone', 'Status', 'Skills'];
    const csvContent = [
      headers.join(','),
      ...students.data.map(s => [
        `"${(s.fullName || '').replace(/"/g, '""')}"`,
        `"${s.nim || ''}"`,
        `"${s.major || ''}"`,
        `"${s.yearOfEntry || ''}"`,
        `"${s.email || ''}"`,
        `"${s.phone || ''}"`,
        `"${s.status || ''}"`,
        `"${(s.skills || []).join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `students_export_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title={t.students || "Students Data"} />

      <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.students}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {t.total_students}: {students.total}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExport}
              className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <span className="material-icons-outlined text-lg">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder={t.search_student_placeholder || "Search..."} 
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div>
            <select 
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
              value={majorFilter}
              onChange={(e) => setMajorFilter(e.target.value)}
            >
              <option value="all">Semua Jurusan / All Majors</option>
              {majors.map(major => (
                <option key={major} value={major}>{major}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
                  <th className="px-6 py-4">{t.student_col}</th>
                  <th className="px-6 py-4">{t.major} / {t.year_entry}</th>
                  <th className="px-6 py-4">{t.phone}</th>
                  <th className="px-6 py-4">{t.skills}</th>
                  <th className="px-6 py-4 text-center">{t.student_status}</th>
                  <th className="px-6 py-4 text-right">{t.action_col}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {/* Check if data exists */}
                {students.data && students.data.length > 0 ? (
                  students.data.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.avatar} 
                            alt={student.fullName} 
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800" 
                            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${student.fullName}&background=random` }}
                          />
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{student.fullName}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{student.nim}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-slate-700 dark:text-slate-300 font-medium">{student.major}</span>
                          <span className="text-[10px] text-slate-500">{student.yearOfEntry}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                        {student.phone}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {student.skills && student.skills.slice(0, 2).map((skill, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                              {skill}
                            </span>
                          ))}
                          {student.skills && student.skills.length > 2 && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500">
                              +{student.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          student.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500' 
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedStudent(student)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <span className="material-icons-outlined text-lg">visibility</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-16 text-center">
                      <span className="material-icons-outlined text-5xl text-slate-200 dark:text-slate-800 mb-2">school</span>
                      <p className="text-slate-500 text-sm">Tidak ada data mahasiswa ditemukan.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION CONTROLS (NEW) --- */}
          {students.links && students.links.length > 3 && (
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Showing <span className="font-semibold text-slate-900 dark:text-white">{students.from}</span> to <span className="font-semibold text-slate-900 dark:text-white">{students.to}</span> of <span className="font-semibold text-slate-900 dark:text-white">{students.total}</span> entries
              </span>
              <div className="flex gap-1">
                {students.links.map((link, key) => (
                  <Link
                    key={key}
                    href={link.url || '#'}
                    preserveState
                    preserveScroll
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                      link.active 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : link.url 
                          ? 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700' 
                          : 'text-slate-400 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedStudent(null)}></div>
          
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300 ring-1 ring-slate-900/5 relative z-10">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50 dark:bg-slate-900/50">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedStudent.avatar} 
                  alt={selectedStudent.fullName} 
                  className="w-16 h-16 rounded-full border-2 border-white dark:border-slate-700 shadow-md object-cover"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${selectedStudent.fullName}&background=random` }}
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">{selectedStudent.fullName}</h2>
                  <div className="flex flex-col mt-1 gap-1">
                    <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide">
                      NIM: {selectedStudent.nim}
                    </p>
                    <span className={`self-start px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      selectedStudent.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500' 
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {selectedStudent.status}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">badge</span>
                      {t.general_info}
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.major}</label>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedStudent.major}</p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.email_address}</label>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{selectedStudent.email}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.phone}</label>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedStudent.phone}</p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                          <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">{t.year_entry}</label>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{selectedStudent.yearOfEntry}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">psychology</span>
                      {t.skills}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStudent.skills && selectedStudent.skills.map((skill, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="material-icons-outlined text-sm">info</span>
                      System Info
                    </h3>
                    <div className="space-y-3 bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700/50">
                        <span className="text-xs text-slate-500">Registered</span>
                        <span className="text-xs font-mono font-medium dark:text-slate-300">
                          {selectedStudent.createdAt ? selectedStudent.createdAt.split(' ')[0] : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">Last Update</span>
                        <span className="text-xs font-mono font-medium dark:text-slate-300">
                          {selectedStudent.updatedAt ? selectedStudent.updatedAt.split(' ')[0] : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
};