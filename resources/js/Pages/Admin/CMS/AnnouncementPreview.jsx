import React from 'react';

// Dictionary Bahasa Lokal (agar tidak error import)
const translations = {
  en: {
    preview_mode: "Preview Mode",
  }
};

export default function AnnouncementPreview({ announcement, isOpen, onClose, lang = 'en' }) {
  if (!isOpen || !announcement) return null;
  
  const t = translations[lang] || translations.en;

  // Handler jika user menekan tombol ESC
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl h-[85vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
        
        {/* Preview Header */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-indigo-600">
            <span className="material-icons-outlined text-sm">visibility</span>
            <span className="text-xs font-bold uppercase tracking-wider">{t.preview_mode}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="max-w-2xl mx-auto bg-white min-h-full shadow-sm">
            
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
               <div className="px-8 pt-12 pb-4 bg-gradient-to-br from-slate-50 to-white">
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold uppercase tracking-wider mb-4 inline-block">
                    {announcement.category}
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                    {announcement.title || "Untitled Announcement"}
                  </h1>
               </div>
            )}

            {/* Meta & Body */}
            <div className="px-8 py-8">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-slate-500 mb-8 pb-8 border-b border-slate-100">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                      <span className="material-icons-outlined text-xs">person</span>
                   </div>
                   <span className="text-slate-900">{announcement.author || 'Admin'}</span>
                 </div>
                 <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                 <div className="flex items-center gap-1">
                   <span className="material-icons-outlined text-sm">calendar_today</span>
                   <span>{announcement.publishDate}</span>
                 </div>
                 <span className="hidden sm:inline w-1 h-1 rounded-full bg-slate-300"></span>
                 <div className="flex items-center gap-1">
                   <span className="material-icons-outlined text-sm">group</span>
                   <span>{announcement.targetAudience}</span>
                 </div>
              </div>

              {/* Content Body */}
              <div className="prose max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                {announcement.content ? (
                  announcement.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-base sm:text-lg">{paragraph}</p>
                  ))
                ) : (
                  <span className="italic text-slate-400">No content provided...</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}