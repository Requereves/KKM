import React, { useEffect } from 'react';

// Dictionary Bahasa Lokal (Pengganti import translations)
const translations = {
  en: {
    preview_mode: "Preview Mode",
  },
  id: {
    preview_mode: "Mode Pratinjau",
  }
};

const AnnouncementPreview = ({ announcement, isOpen, onClose, lang = 'en' }) => {
  if (!isOpen || !announcement) return null;
  
  const t = translations[lang] || translations.en;

  // Handler jika user menekan tombol ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Helper untuk parse HTML dari React Quill agar aman
  // Karena temanmu pakai split('\n'), tapi kita pakai Quill (HTML), kita butuh ini
  const renderContent = () => {
    if (!announcement.content) {
        return <span className="italic text-slate-400">No content provided...</span>;
    }
    
    // Jika content adalah HTML string (dari Quill)
    return (
        <div 
            dangerouslySetInnerHTML={{ __html: announcement.content }} 
            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed font-serif sm:font-sans
            [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4
            [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3
            [&>p]:mb-4 [&>p]:text-base [&>p]:sm:text-lg
            [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
            [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4"
        />
    );
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        
        {/* Preview Header (Admin Context) */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span className="material-icons-outlined text-sm">visibility</span>
            <span className="text-xs font-bold uppercase tracking-wider">{t.preview_mode}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content (Student View) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-black/20">
          <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 min-h-full shadow-sm">
            
            {/* Hero Image Logic */}
            {announcement.image ? (
              <div className="w-full h-64 sm:h-80 relative">
                <img 
                  // Support URL string (dari DB) atau Blob URL (preview upload baru)
                  src={announcement.image} 
                  alt={announcement.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm mb-3 inline-block">
                    {announcement.category}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight shadow-sm drop-shadow-md">
                    {announcement.title || "Untitled Announcement"}
                  </h1>
                </div>
              </div>
            ) : (
               <div className="px-8 pt-12 pb-4 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-900/50">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                    {announcement.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                    {announcement.title || "Untitled Announcement"}
                  </h1>
               </div>
            )}

            {/* Meta & Body */}
            <div className="px-8 py-8">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                      <span className="material-icons-outlined text-xs">person</span>
                   </div>
                   <span className="text-slate-900 dark:text-slate-200">{announcement.author || 'Admin'}</span>
                 </div>
                 <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                 <div className="flex items-center gap-1">
                   <span className="material-icons-outlined text-sm">calendar_today</span>
                   <span>{announcement.publishDate}</span>
                 </div>
                 <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                 <div className="flex items-center gap-1">
                   <span className="material-icons-outlined text-sm">group</span>
                   {/* Fallback jika targetAudience belum ada di form state */}
                   <span>{announcement.targetAudience || 'All'}</span>
                 </div>
              </div>

              {/* Content Body - Rendered from Quill HTML */}
              {renderContent()}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementPreview;