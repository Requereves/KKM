import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnnouncementPreview from './AnnouncementPreview';

// Dictionary Bahasa (Sesuai kode temanmu)
const t = {
  edit_announcement: "Edit Announcement",
  create_announcement: "Create Announcement",
  doc_col: "Document Title (Title)",
  cat_col: "Category",
  target_audience: "Target Audience",
  publish_date: "Publish Date",
  student_status: "Status",
  content: "Content",
  cancel: "Cancel",
  save_announcement: "Save Announcement",
  preview: "Preview"
};

export default function AnnouncementForm({ auth, mode = 'create', initialData = {} }) {
  
  // 1. Setup Form Inertia
  const { data, setData, post, processing, errors } = useForm({
    _method: mode === 'edit' ? 'put' : undefined, // Trick untuk upload file di method PUT
    title: initialData.title || '',
    content: initialData.content || '',
    category: initialData.category || 'News',
    status: initialData.status || 'draft',
    targetAudience: initialData.targetAudience || 'All',
    publishDate: initialData.publishDate || new Date().toISOString().split('T')[0],
    image: null, 
  });

  const [imagePreview, setImagePreview] = useState(initialData.image || null);
  const [showPreview, setShowPreview] = useState(false);

  // Handle upload gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'create') {
      // ✅ PERBAIKAN: Gunakan 'admin.cms.store'
      post(route('admin.cms.store'), { forceFormData: true });
    } else {
      // ✅ PERBAIKAN: Gunakan 'admin.cms.update'
      post(route('admin.cms.update', initialData.id), { forceFormData: true });
    }
  };

  const previewData = { ...data, image: imagePreview, author: auth.user.name };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
        
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-6">
          <Link 
            // ✅ PERBAIKAN: Gunakan 'admin.cms.index'
            href={route('admin.cms.index')} 
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === 'edit' ? t.edit_announcement : t.create_announcement}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {mode === 'edit' ? `ID: ${initialData.id}` : 'Fill in the details below'}
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title (Full Width) */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.doc_col}</label>
              <input 
                required
                type="text" 
                value={data.title}
                onChange={e => setData('title', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                placeholder="e.g. End of Semester Exam Schedule"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.cat_col}</label>
              <select
                value={data.category}
                onChange={e => setData('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="News">News</option>
                <option value="Event">Event</option>
                <option value="Academic">Academic</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.target_audience}</label>
              <select
                value={data.targetAudience}
                onChange={e => setData('targetAudience', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="All">All</option>
                <option value="Students">Students Only</option>
                <option value="Lecturers">Lecturers Only</option>
              </select>
            </div>

            {/* Publish Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.publish_date}</label>
              <input 
                required
                type="date" 
                value={data.publishDate}
                onChange={e => setData('publishDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.student_status}</label>
              <select
                value={data.status}
                onChange={e => setData('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            {/* Image Upload */}
            <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cover Image</label>
               <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-10 w-16 object-cover rounded-md border border-slate-200 dark:border-slate-700" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 dark:file:bg-slate-800 dark:file:text-slate-300 transition-all cursor-pointer"
                  />
               </div>
               {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

          </div>

          {/* Content (Textarea) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.content}</label>
            <textarea 
              rows={12}
              value={data.content}
              onChange={e => setData('content', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-sans text-base leading-relaxed"
              placeholder="Write your announcement content here..."
            />
            <p className="text-[10px] text-slate-400 text-right">Supports basic line breaks.</p>
            {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800 gap-3">
            <Link 
              // ✅ PERBAIKAN: Gunakan 'admin.cms.index'
              href={route('admin.cms.index')}
              className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all"
            >
              {t.cancel}
            </Link>
            <button 
              type="submit"
              disabled={processing}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              {processing ? 'Saving...' : t.save_announcement}
            </button>
          </div>
        </form>
      </div>

      <AnnouncementPreview 
        announcement={previewData} 
        isOpen={showPreview} 
        onClose={() => setShowPreview(false)} 
      />

    </AuthenticatedLayout>
  );
};