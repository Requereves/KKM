import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnnouncementPreview from './AnnouncementPreview';
import { translations } from '@/translations'; // Menggunakan translations dari file global jika ada

export default function CMSPage(props) {
  // 1. Ambil data props dengan aman (default empty array)
  const { auth, announcements = [] } = props;
  const { locale } = usePage().props;
  const lang = locale || 'id'; // Default language

  // Dictionary Bahasa Manual (Fallback jika translations.js belum lengkap)
  const t = {
    cms_title: "Announcements (CMS)",
    cms_subtitle: "Manage news, announcements, and information for students.",
    add_announcement: "Create Announcement",
    search_announcements: "Search title...",
    filter_all: "All",
    filter_published: "Published", 
    filter_draft: "Draft", 
    filter_archived: "Archived",
    confirm_title: "Are you sure?",
    delete_announcement_confirm: "This will permanently delete this announcement.",
    cancel: "Cancel",
    confirm_delete: "Delete"
  };

  // State Lokal
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  // State untuk Modal
  const [previewItem, setPreviewItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Logic Filtering (Client Side)
  const filteredItems = announcements.filter(item => {
    const matchesFilter = filter === 'all' || item.status.toLowerCase() === filter;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Handle Delete ke Server Laravel
  const handleDelete = () => {
    if (confirmDeleteId) {
      // ✅ PERBAIKAN: Gunakan route 'admin.cms.destroy'
      router.delete(route('admin.cms.destroy', confirmDeleteId), {
        onSuccess: () => setConfirmDeleteId(null),
        preserveScroll: true
      });
    }
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="CMS Announcements" />
      
      {/* Container dengan animasi fade-in */}
      <div className="p-6 space-y-6 animate-in fade-in duration-500 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.cms_title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{t.cms_subtitle}</p>
          </div>
          <Link 
            // ✅ PERBAIKAN: Gunakan route 'admin.cms.create'
            href={route('admin.cms.create')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
          >
            <span className="material-icons-outlined text-lg">add</span>
            {t.add_announcement}
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder={t.search_announcements}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shrink-0 overflow-x-auto">
            {['all', 'published', 'draft', 'archived'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              >
                {f === 'all' ? t.filter_all : f === 'published' ? t.filter_published : f === 'archived' ? t.filter_archived : t.filter_draft}
              </button>
            ))}
          </div>
        </div>

        {/* Announcements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden h-full"
            >
              {/* Image Area */}
              <div 
                className="h-40 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden relative cursor-pointer"
                onClick={() => setPreviewItem(item)}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="material-icons-outlined text-4xl">image</span>
                   </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase shadow-sm backdrop-blur-sm ${
                    item.status.toLowerCase() === 'published' ? 'bg-emerald-500/90 text-white' :
                    item.status.toLowerCase() === 'draft' ? 'bg-amber-500/90 text-white' :
                    'bg-slate-500/90 text-white'
                  }`}>
                    {item.status}
                  </span>
                </div>
                
                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-slate-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">visibility</span> Preview
                    </span>
                </div>
              </div>
            
              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {item.category}
                   </span>
                   <span className="text-[10px] text-slate-400">
                      {item.publishDate || item.date}
                   </span>
                </div>
                
                <h3 
                  onClick={() => setPreviewItem(item)}
                  className="text-lg font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer"
                >
                  {item.title}
                </h3>
                
                {/* Summary / Content Preview */}
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3">
                  {item.summary || (item.content ? item.content.replace(/<[^>]+>/g, '') : '')}
                </p>

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="material-icons-outlined text-sm">person</span>
                      {item.author}
                  </div>
                  <div className="flex gap-2">
                      <Link 
                        // ✅ PERBAIKAN: Gunakan route 'admin.cms.edit'
                        href={route('admin.cms.edit', item.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        <span className="material-icons-outlined text-lg">edit</span>
                      </Link>
                      <button 
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                      >
                        <span className="material-icons-outlined text-lg">delete</span>
                      </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <span className="material-icons-outlined text-6xl text-slate-200 dark:text-slate-800">feed</span>
            <p className="text-slate-500 italic">No announcements found.</p>
          </div>
        )}

        {/* Confirmation Modal for Delete */}
        {confirmDeleteId && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in zoom-in-95 duration-150">
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500">
                <span className="material-icons-outlined text-4xl">delete</span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.confirm_title}</h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 mb-6 font-medium">
                {t.delete_announcement_confirm}
              </p>

              <div className="flex w-full gap-3">
                <button 
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all"
                >
                  {t.cancel}
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
                >
                  {t.confirm_delete}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal for List Item */}
        {previewItem && (
            <AnnouncementPreview 
              announcement={previewItem} 
              isOpen={!!previewItem} 
              onClose={() => setPreviewItem(null)} 
            />
        )}

      </div>
    </AuthenticatedLayout>
  );
}