
import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { translations, Language } from '../translations';

interface TrainingFormProps {
  initialData?: Course | null;
  onSubmit: (course: Course) => void;
  onCancel: () => void;
  lang: Language;
}

const TrainingForm: React.FC<TrainingFormProps> = ({ initialData, onSubmit, onCancel, lang }) => {
  const t = translations[lang];
  const [formData, setFormData] = useState<Course>({
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    instructor: '',
    startDate: '',
    endDate: '',
    location: '',
    type: 'Offline',
    category: '',
    description: '',
    status: 'upcoming',
    participantsCount: 0,
    maxParticipants: 50,
    image: `https://picsum.photos/seed/${Math.random()}/400/200`,
    syllabus: []
  });

  const [syllabusInput, setSyllabusInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setSyllabusInput(initialData.syllabus.join('\n'));
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const processedSyllabus = syllabusInput.split('\n').filter(r => r.trim() !== '');
    onSubmit({ ...formData, syllabus: processedSyllabus });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? t.edit_course : t.create_course}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {initialData ? `ID: ${initialData.id}` : 'Fill in the details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.doc_col} (Title)</label>
            <input 
              required
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              placeholder="e.g. Advanced Python Workshop"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.provider}</label>
            <input 
              required
              type="text" 
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.start_date}</label>
            <input 
              required
              type="date" 
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.end_date}</label>
            <input 
              required
              type="date" 
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.location}</label>
            <input 
              type="text" 
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cat_col}</label>
            <input 
              type="text" 
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              placeholder="e.g. Technology"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.course_type}</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            >
              <option value="Offline">Offline</option>
              <option value="Online">Online</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
           <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.student_status}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active/Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.capacity}</label>
             <input 
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
           <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Image URL</label>
             <input 
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.description}</label>
          <textarea 
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.syllabus} (One per line)</label>
          <textarea 
            rows={4}
            value={syllabusInput}
            onChange={(e) => setSyllabusInput(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-mono text-sm"
          />
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
            {t.save_course}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrainingForm;
