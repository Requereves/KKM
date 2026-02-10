import React, { useState, useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AnnouncementPreview from './AnnouncementPreview';

const t = {
  edit_announcement: "Edit Announcement",
  create_announcement: "Create Announcement",
  doc_col: "Title",
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
  // Kita masukkan '_method' langsung ke sini agar lebih stabil saat Edit
  const { data, setData, post, processing, errors } = useForm({
    _method: mode === 'edit' ? 'put' : undefined, // Trick agar Laravel baca ini sebagai PUT
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

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'create') {
      post(route('cms.store'), {
        forceFormData: true,
      });
    } else {
      // Mode Edit: Kita kirim POST tapi data sudah mengandung '_method': 'put'
      post(route('cms.update', initialData.id), {
        forceFormData: true, // Wajib true untuk upload file
      });
    }
  };

  // Data Preview
  const previewData = {
    ...data,
    image: imagePreview,
    author: auth.user.name
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <div className="p-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href={route('cms.index')} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'edit' ? t.edit_announcement : t.create_announcement}
            </h2>
            <p className="text-sm text-slate-500">
              {mode === 'edit' ? `ID: ${initialData.id}` : 'Fill in the details below'}
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all flex items-center gap-2"
          >
            <span className="material-icons-outlined text-sm">visibility</span>
            <span className="hidden sm:inline">{t.preview}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          
          {/* Debug Error Message (Jika ada error global) */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
              <p className="font-bold">Please check the form for errors:</p>
              <ul className="list-disc list-inside">
                {Object.keys(errors).map(key => (
                  <li key={key}>{errors[key]}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Title */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.doc_col} (Title)</label>
              <input 
                type="text" 
                value={data.title}
                onChange={e => setData('title', e.target.value)}
                className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${errors.title ? 'border-red-500' : 'border-slate-200'}`}
                placeholder="e.g. End of Semester Exam Schedule"
              />
              {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.cat_col}</label>
              <select
                value={data.category}
                onChange={e => setData('category', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="News">News</option>
                <option value="Event">Event</option>
                <option value="Academic">Academic</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.target_audience}</label>
              <select
                value={data.targetAudience}
                onChange={e => setData('targetAudience', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="All">All</option>
                <option value="Students">Students Only</option>
                <option value="Lecturers">Lecturers Only</option>
              </select>
            </div>

            {/* Publish Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.publish_date}</label>
              <input 
                type="date" 
                value={data.publishDate}
                onChange={e => setData('publishDate', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              {errors.publishDate && <p className="text-red-500 text-xs">{errors.publishDate}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.student_status}</label>
              <select
                value={data.status}
                onChange={e => setData('status', e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            
            {/* Image Upload */}
             <div className="space-y-2 md:col-span-2">
               <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cover Image</label>
               <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="h-20 w-32 object-cover rounded-lg border border-slate-200" />
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                  />
               </div>
               {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.content}</label>
            <textarea 
              rows={8}
              value={data.content}
              onChange={e => setData('content', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-sans text-base leading-relaxed"
              placeholder="Write your announcement content here..."
            />
            {errors.content && <p className="text-red-500 text-xs">{errors.content}</p>}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 gap-3">
            <Link 
              href={route('cms.index')}
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
            >
              {t.cancel}
            </Link>
            
            {/* BUTTON SAVE */}
            <button 
              type="submit"
              disabled={processing} // Disabled saat loading
              className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all ${
                processing 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
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