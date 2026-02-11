import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { translations } from '@/translations';

const JobForm = ({ initialData, onSubmit, onCancel, lang: propLang }) => {
  // 1. Ambil Locale & Global Errors dari Inertia
  const { props } = usePage();
  const { errors } = props; // Validasi server-side otomatis masuk sini
  const lang = propLang || props.locale || 'id';
  const t = translations[lang];

  // --- HELPER FUNCTIONS ---

  // Convert Array ["A", "B"] -> String "A\nB" untuk Textarea
  const formatRequirementsToString = (reqs) => {
    if (Array.isArray(reqs)) return reqs.join('\n');
    return reqs || '';
  };

  // Helper Tanggal Aman (YYYY-MM-DD)
  // Menangani null, undefined, atau string tanggal
  const formatDateForInput = (dateString) => {
    if (!dateString || dateString === '-') return '';
    
    // Jika format sudah YYYY-MM-DD (dari DB tipe date), kembalikan langsung
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) return dateString;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    // Konversi ke YYYY-MM-DD tanpa pergeseran timezone
    return date.toISOString().split('T')[0];
  };

  // 2. Setup Form State dengan useForm
  const { data, setData, processing } = useForm({
    id: initialData?.id || '',
    title: initialData?.title || '',
    company: initialData?.company || '',
    location: initialData?.location || '',
    type: initialData?.type || 'Full-time',
    salary: initialData?.salary ? String(initialData.salary).replace(/[^0-9]/g, '') : '', // Hanya angka
    description: initialData?.description || '',
    
    // Requirement di-load sebagai string (jika edit) atau kosong (jika create)
    requirements: formatRequirementsToString(initialData?.requirements),
    
    status: initialData?.status ? initialData.status.toLowerCase() : 'draft', // Pastikan lowercase
    
    // Tanggal Expires (Deadline) - Sesuai nama kolom DB/Controller 'deadline'
    deadline: initialData?.deadline || initialData?.expiresAt 
        ? formatDateForInput(initialData?.deadline || initialData?.expiresAt) 
        : '',
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Kirim data ke Parent untuk diproses
    onSubmit(data);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <button 
          type="button"
          onClick={onCancel} 
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {initialData ? t.edit_job : t.create_job}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {initialData ? `Editing Job ID: ${initialData.id}` : 'Fill in the details below'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 space-y-6">
        
        {/* Row 1: Title & Company */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.doc_col || 'Job Title'}</label>
            <input 
              required
              type="text" 
              name="title"
              value={data.title}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.title ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              placeholder="e.g. Frontend Developer"
            />
            {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.company_name}</label>
            <input 
              required
              type="text" 
              name="company"
              value={data.company}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.company ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              placeholder="e.g. TechCorp"
            />
            {errors.company && <p className="text-xs text-rose-500">{errors.company}</p>}
          </div>
        </div>

        {/* Row 2: Location & Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.location}</label>
            <input 
              required
              type="text" 
              name="location"
              value={data.location}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.location ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
              placeholder="e.g. Jakarta Selatan (Hybrid)"
            />
            {errors.location && <p className="text-xs text-rose-500">{errors.location}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.salary} (Numbers Only)</label>
            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">Rp</span>
                <input 
                  type="number" 
                  name="salary"
                  value={data.salary}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.salary ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                  placeholder="5000000"
                />
            </div>
            {errors.salary && <p className="text-xs text-rose-500">{errors.salary}</p>}
          </div>
        </div>

        {/* Row 3: Type & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.job_type}</label>
            <select
              name="type"
              value={data.type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
            {errors.type && <p className="text-xs text-rose-500">{errors.type}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.job_status}</label>
            <select
              name="status"
              value={data.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && <p className="text-xs text-rose-500">{errors.status}</p>}
          </div>
        </div>

        {/* Row 4: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.posted_on} (Auto)</label>
                <input 
                  type="text" 
                  disabled
                  value={new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 cursor-not-allowed"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.expires_on}</label>
                <input 
                  type="date" 
                  name="deadline" // Wajib match dengan controller ($request->deadline)
                  value={data.deadline}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.deadline ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
                />
                {errors.deadline && <p className="text-xs text-rose-500">{errors.deadline}</p>}
            </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.description}</label>
          <textarea 
            name="description"
            rows={4}
            value={data.description}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white ${errors.description ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
            placeholder="Job responsibilities and details..."
          />
          {errors.description && <p className="text-xs text-rose-500">{errors.description}</p>}
        </div>

        {/* Requirements */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.requirements} (One per line)</label>
          <p className="text-[10px] text-slate-400">* Press Enter to add new requirement</p>
          <textarea 
            rows={4}
            name="requirements"
            value={data.requirements}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-mono text-sm ${errors.requirements ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-800'}`}
            placeholder="Bachelor degree in CS&#10;Min 2 years experience..."
          />
          {errors.requirements && <p className="text-xs text-rose-500">{errors.requirements}</p>}
        </div>

        {/* Footer Buttons */}
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
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {processing && <span className="material-icons-outlined animate-spin text-sm">sync</span>}
            {t.save_job}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;