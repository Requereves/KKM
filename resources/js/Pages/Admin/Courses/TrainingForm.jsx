import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react'; // 👈 TAMBAHKAN 'router'

// Dictionary Bahasa
const translations = {
  en: {
    edit_course: "Edit Training",
    create_course: "Create New Training",
    doc_col: "Title",
    provider: "Instructor / Provider",
    start_date: "Start Date",
    end_date: "End Date",
    location: "Location",
    cat_col: "Category",
    course_type: "Type",
    student_status: "Status",
    capacity: "Capacity",
    description: "Description",
    syllabus: "Syllabus",
    cancel: "Cancel",
    save_course: "Save Training",
  }
};

export default function TrainingForm({ lang = 'en', mode = 'create', initialData = {}, onCancel }) {
  const t = translations[lang];

  // 1. Setup Form Inertia
  const { data, setData, post, processing, errors } = useForm({
    title: initialData.title || '',
    instructor: initialData.instructor || '',
    startDate: initialData.startDate || '',
    endDate: initialData.endDate || '',
    location: initialData.location || '',
    type: initialData.type || 'Offline',
    category: initialData.category || '',
    description: initialData.description || '',
    status: initialData.status || 'upcoming',
    maxParticipants: initialData.maxParticipants || 50,
    thumbnail: null, // File upload
    syllabus: initialData.syllabus ? initialData.syllabus.join('\n') : '',
  });

  // Preview gambar
  const [imagePreview, setImagePreview] = useState(initialData.image || null);

  // Handle perubahan input gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('thumbnail', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Submit ke Laravel
  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      // MODE CREATE: Standar POST
      post(route('admin.courses.store'), {
        onSuccess: () => onCancel(),
      });
    } else {
      // 👇 PERBAIKAN UTAMA DI SINI (MODE EDIT)
      // Kita gunakan router.post manual agar bisa menyisipkan _method: 'put'
      // Ini wajib untuk upload file pada route PUT di Laravel
      router.post(route('admin.courses.update', initialData.id), {
        _method: 'put', // Spoofing method
        ...data,        // Spread semua data form
      }, {
        onSuccess: () => onCancel(),
      });
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          type="button" 
          onClick={onCancel} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === 'edit' ? t.edit_course : t.create_course}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'edit' ? `Editing ID: ${initialData.id}` : 'Fill in the details below'}
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.doc_col}</label>
            <input 
              type="text" 
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              placeholder="e.g. Advanced Python Workshop"
            />
            {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
          </div>

          {/* Instructor */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.provider}</label>
            <input 
              type="text" 
              value={data.instructor}
              onChange={e => setData('instructor', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
            {errors.instructor && <p className="text-red-500 text-xs">{errors.instructor}</p>}
          </div>

          {/* Dates */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.start_date}</label>
            <input 
              type="date" 
              value={data.startDate}
              onChange={e => setData('startDate', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.end_date}</label>
            <input 
              type="date" 
              value={data.endDate}
              onChange={e => setData('endDate', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.location}</label>
            <input 
              type="text" 
              value={data.location}
              onChange={e => setData('location', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cat_col}</label>
            <input 
              type="text" 
              value={data.category}
              onChange={e => setData('category', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              placeholder="e.g. Technology"
            />
            {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
          </div>

          {/* Type & Status */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.course_type}</label>
            <select
              value={data.type}
              onChange={e => setData('type', e.target.value)}
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
              value={data.status}
              onChange={e => setData('status', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            >
              <option value="upcoming">Upcoming</option>
              <option value="active">Active/Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.capacity}</label>
             <input 
              type="number"
              value={data.maxParticipants}
              onChange={e => setData('maxParticipants', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            />
          </div>

          {/* Image Upload (Updated from URL to File) */}
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Thumbnail Image</label>
             <div className="flex items-center gap-4">
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-slate-200" />
                )}
                <input 
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
             </div>
             {errors.thumbnail && <p className="text-red-500 text-xs">{errors.thumbnail}</p>}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.description}</label>
          <textarea 
            rows={4}
            value={data.description}
            onChange={e => setData('description', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
          />
        </div>

        {/* Syllabus */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.syllabus} (One per line)</label>
          <textarea 
            rows={4}
            value={data.syllabus}
            onChange={e => setData('syllabus', e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-mono text-sm"
          />
        </div>

        {/* Footer Actions */}
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
            disabled={processing}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {processing ? 'Saving...' : t.save_course}
          </button>
        </div>

      </form>
    </div>
  );
};