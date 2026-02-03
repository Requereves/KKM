
import React, { useState, useEffect } from 'react';
import { Announcement } from '../types';
import { translations, Language } from '../translations';
import AnnouncementPreview from './AnnouncementPreview';

interface AnnouncementFormProps {
  initialData?: Announcement | null;
  onSubmit: (data: Announcement) => void;
  onCancel: () => void;
  lang: Language;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ initialData, onSubmit, onCancel, lang }) => {
  const t = translations[lang];
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<Announcement>({
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    content: '',
    category: 'News',
    status: 'draft',
    targetAudience: 'All',
    author: 'Admin',
    publishDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    image: `https://picsum.photos/seed/${Math.random()}/400/200`
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
            <span className="material-icons-outlined">arrow_back</span>
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? t.edit_announcement : t.create_announcement}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {initialData ? `ID: ${initialData.id}` : 'Fill in the details below'}
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <span className="material-icons-outlined text-sm">visibility</span>
            <span className="hidden sm:inline">{t.preview}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.doc_col} (Title)</label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="e.g. End of Semester Exam Schedule"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cat_col}</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="News">News</option>
                <option value="Event">Event</option>
                <option value="Academic">Academic</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.target_audience}</label>
              <select
                name="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="All">All</option>
                <option value="Students">Students Only</option>
                <option value="Lecturers">Lecturers Only</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.publish_date}</label>
              <input 
                required
                type="date" 
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.student_status}</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
             <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Image URL</label>
               <input 
                type="text"
                name="image"
                value={formData.image || ''}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.content}</label>
            <textarea 
              name="content"
              rows={12}
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-sans text-base leading-relaxed"
              placeholder="Write your announcement content here..."
            />
            <p className="text-[10px] text-slate-400 text-right">Supports basic line breaks.</p>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
            >
              {t.cancel}
            </button>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
            >
              {t.save_announcement}
            </button>
          </div>
        </form>
      </div>

      <AnnouncementPreview 
        announcement={formData} 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)}
        lang={lang}
      />
    </>
  );
};

export default AnnouncementForm;
