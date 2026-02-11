import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { translations } from '@/translations'; // Pastikan path ini benar

export default function VerificationPage({ auth, items = [], initialSelectedId }) {
  const { locale } = usePage().props;
  const lang = locale || 'id';
  const t = translations[lang];

  // --- STATE MANAGEMENT ---
  const [filter, setFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');
  
  // State for Decision Panel (Approve/Reject)
  const [decision, setDecision] = useState(null); // 'approve' | 'reject' | null

  // --- EFFECTS ---
  useEffect(() => {
    // Auto-select item jika ada ID di props (misal dari notifikasi)
    if (initialSelectedId && items.length > 0) {
      const item = items.find(i => i.id.toString() === initialSelectedId.toString());
      if (item) setSelectedItem(item);
    }
  }, [initialSelectedId, items]);

  // --- LOGIC FILTERING (Client Side) ---
  const filteredItems = items.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.documentTitle.toLowerCase().includes(search.toLowerCase()) ||
      item.nim.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // --- HANDLERS ---
  const handleBack = () => {
    setSelectedItem(null);
    setDecision(null);
    setFeedback('');
  };

  const handleSubmitDecision = () => {
    if (!selectedItem || !decision) return;
    
    // Validasi Feedback jika Reject
    if (decision === 'reject' && !feedback.trim()) {
        alert("Please provide a reason for rejection.");
        return;
    }

    const payload = {
        status: decision === 'approve' ? 'approved' : 'rejected',
        feedback: decision === 'approve' ? (feedback || 'Approved') : feedback
    };

    // Kirim Request ke Laravel via Inertia
    // Pastikan route 'admin.verification.update' ada di web.php
    router.put(route('admin.verification.update', selectedItem.id), payload, {
        onSuccess: () => {
            handleBack(); // Kembali ke list setelah sukses
        },
        preserveScroll: true
    });
  };

  // ------------------- RENDER DETAIL VIEW (Full Page) -------------------
  if (selectedItem) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <Head title={`Verify: ${selectedItem.name}`} />
        
        <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6 animate-in fade-in duration-300 p-6">
          {/* LEFT COLUMN: PDF Viewer Mock */}
          <div className="lg:w-2/3 h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            <div className="bg-slate-900 p-3 flex items-center justify-between border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <button onClick={handleBack} className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                     <span className="material-icons-outlined">arrow_back</span>
                     Back
                  </button>
                  <span className="text-slate-300 text-sm font-medium truncate max-w-[200px]">
                    {selectedItem.filePath.split('/').pop()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="material-icons-outlined text-sm cursor-pointer hover:text-white">zoom_out</span>
                  <span className="text-xs">100%</span>
                  <span className="material-icons-outlined text-sm cursor-pointer hover:text-white">zoom_in</span>
                </div>
            </div>
            
            {/* PDF Canvas Area */}
            <div className="flex-1 bg-slate-500/50 flex items-center justify-center p-8 overflow-y-auto relative">
               <div className="bg-white w-full max-w-[600px] h-full min-h-[800px] shadow-lg p-12 text-slate-800 flex flex-col gap-6 relative">
                  {/* Simulated PDF Content */}
                  <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                      <h1 className="text-2xl font-serif font-bold">CERTIFICATE OF COMPLETION</h1>
                      <div className="w-12 h-12 bg-indigo-900 rounded-full opacity-50"></div>
                  </div>
                  <div className="text-center py-12 space-y-4">
                      <p className="font-serif italic text-slate-600">This is to certify that</p>
                      <h2 className="text-3xl font-bold text-indigo-900">{selectedItem.name}</h2>
                      <p className="font-serif italic text-slate-600">Has successfully completed the course</p>
                      <h3 className="text-xl font-bold">{selectedItem.documentTitle}</h3>
                  </div>
                  <div className="mt-auto flex justify-between pt-12">
                      <div className="text-center">
                         <div className="w-32 border-b border-slate-400 mb-2"></div>
                         <p className="text-xs uppercase font-bold">Instructor</p>
                      </div>
                      <div className="text-center">
                         <div className="w-32 border-b border-slate-400 mb-2"></div>
                         <p className="text-xs uppercase font-bold">Date</p>
                      </div>
                  </div>
                  {/* Watermark Mock */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                      <span className="text-9xl font-bold -rotate-45">PREVIEW</span>
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Decision Panel */}
          <div className="lg:w-1/3 h-full flex flex-col gap-6 overflow-y-auto">
             {/* Info Card */}
             <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                   <span className="material-icons-outlined text-indigo-500">info</span>
                   Information
                </h2>
                <div className="space-y-4">
                   <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Student Name</label>
                      <p className="text-sm font-semibold dark:text-white">{selectedItem.name}</p>
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">NIM</label>
                      <p className="font-mono text-sm dark:text-slate-300">{selectedItem.nim}</p>
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Category</label>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                         {selectedItem.category}
                      </span>
                   </div>
                   <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Description</label>
                      <p className="text-sm italic text-slate-500 mt-1">"{selectedItem.description}"</p>
                   </div>
                </div>
             </div>

             {/* Decision Card */}
             <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                   <span className="material-icons-outlined text-indigo-500">gavel</span>
                   Verification Decision
                </h2>
                
                <div className="space-y-4 flex-1">
                   <p className="text-xs text-slate-500">Select an outcome for this verification request.</p>
                   
                   {/* Approve Card */}
                   <div 
                      onClick={() => setDecision('approve')}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${
                         decision === 'approve' 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                      }`}
                   >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                         decision === 'approve' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                      }`}>
                         {decision === 'approve' && <span className="material-icons-outlined text-white text-xs">check</span>}
                      </div>
                      <div>
                         <h3 className={`font-bold text-sm ${decision === 'approve' ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'}`}>Approve Request</h3>
                         <p className="text-xs text-slate-500 mt-0.5">The document is valid and meets all requirements.</p>
                      </div>
                   </div>

                   {/* Reject Card */}
                   <div 
                      onClick={() => setDecision('reject')}
                      className={`cursor-pointer border-2 rounded-xl p-4 flex items-start gap-3 transition-all ${
                         decision === 'reject' 
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800'
                      }`}
                   >
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 ${
                         decision === 'reject' ? 'border-rose-500 bg-rose-500' : 'border-slate-300'
                      }`}>
                         {decision === 'reject' && <span className="material-icons-outlined text-white text-xs">close</span>}
                      </div>
                      <div>
                         <h3 className={`font-bold text-sm ${decision === 'reject' ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>Reject Request</h3>
                         <p className="text-xs text-slate-500 mt-0.5">The document is invalid, unreadable, or incorrect.</p>
                      </div>
                   </div>

                   {/* Conditional Reason Textarea */}
                   {decision === 'reject' && (
                      <div className="animate-in fade-in slide-in-from-top-2">
                         <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">Reason for Rejection <span className="text-rose-500">*</span></label>
                         <textarea 
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Please explain why this document is being rejected..."
                            className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-rose-500 outline-none dark:text-white"
                            rows={3}
                         />
                      </div>
                   )}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                   {decision && (
                      <div className="mb-4 flex items-center gap-2 text-amber-600 dark:text-amber-500 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg">
                         <span className="material-icons-outlined text-sm">warning</span>
                         Warning: This action cannot be undone.
                      </div>
                   )}
                   <button 
                      disabled={!decision || (decision === 'reject' && !feedback)}
                      onClick={handleSubmitDecision}
                      className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                         !decision 
                            ? 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed text-slate-500' 
                            : decision === 'approve' 
                               ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' 
                               : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20'
                      }`}
                   >
                      {decision === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }

  // ------------------- RENDER LIST VIEW -------------------
  return (
    <AuthenticatedLayout user={auth.user}>
        <Head title="Verification Center" />

        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t.verification || "Verification Center"}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola dan verifikasi berkas kompetensi mahasiswa.</p>
                </div>
                {/* Filter Tabs */}
                <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
                    {['all', 'pending', 'approved', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                        filter === f 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                    >
                        {f === 'all' ? 'Semua' : f}
                    </button>
                    ))}
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input 
                    type="text" 
                    placeholder="Cari Mahasiswa, NIM, atau Judul Berkas..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm dark:text-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Table List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
                                <th className="px-6 py-4">Mahasiswa</th>
                                <th className="px-6 py-4">Berkas Portfolio</th>
                                <th className="px-6 py-4">Kategori</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                            {filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 dark:text-white">{item.name}</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{item.nim}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">{item.documentTitle}</span>
                                            <span className="text-[10px] text-slate-400 italic truncate max-w-[200px]">{item.filePath}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold uppercase">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                            item.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-500' :
                                            item.status === 'approved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-500' :
                                            'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-500'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedItem(item)}
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold text-xs flex items-center justify-end gap-1 ml-auto"
                                        >
                                            <span className="material-icons-outlined text-sm">visibility</span> Detail
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Empty State */}
                    {filteredItems.length === 0 && (
                        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                            <span className="material-icons-outlined text-6xl text-slate-200 dark:text-slate-800">folder_off</span>
                            <p className="text-slate-500 italic">Data berkas tidak ditemukan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
  );
};