import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { DICTIONARY } from '../../../types'; // Sesuaikan path folder

const UploadCertificate = ({ auth, language = 'id', isEdit = false, existingPortfolio = null }) => {
    const t = DICTIONARY[language] || DICTIONARY['id'];

    // Inisialisasi Form Inertia
    const { data, setData, post, processing, errors } = useForm({
        title: existingPortfolio?.title || '',
        category: existingPortfolio?.category || '',
        description: existingPortfolio?.description || '',
        file: null, // Untuk file baru
        // Laravel Method Spoofing: Jika edit, gunakan PUT via POST agar file upload lancar
        _method: isEdit ? 'PUT' : 'POST',
    });

    const categories = [
        { id: 'sertifikat', label: 'Sertifikat' },
        { id: 'proyek_kuliah', label: 'Proyek Kuliah' },
        { id: 'portofolio_bebas', label: 'Portofolio Bebas' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEdit) {
            // Karena upload file di Laravel tidak mendukung method PUT secara native, 
            // kita gunakan POST dengan spoofing _method yang sudah ada di data.
            post(route('portfolio.update', existingPortfolio.id));
        } else {
            post(route('portfolio.store'));
        }
    };

    return (
        <StudentLayout user={auth.user}>
            <Head title={isEdit ? t.reupload : t.uploadCertificate} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
                <div className="mb-6">
                    <Link 
                        href={route('portfolio.index')} 
                        className="text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 flex items-center gap-1 mb-2 transition-colors"
                    >
                        <span className="material-icons-outlined text-xs">arrow_back</span> {t.myCertificates}
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? t.reupload : t.uploadCertificate}
                    </h1>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t.formTitle} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={e => setData('title', e.target.value)}
                                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.title ? 'border-red-500' : ''}`}
                                placeholder="e.g. Android Development Certificate"
                                required
                            />
                            {errors.title && <div className="text-red-500 text-xs mt-1">{errors.title}</div>}
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t.formCategory} <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.category ? 'border-red-500' : ''}`}
                                required
                            >
                                <option value="" disabled>{t.selectCategory}</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </select>
                            {errors.category && <div className="text-red-500 text-xs mt-1">{errors.category}</div>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t.formDescription} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className={`w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.description ? 'border-red-500' : ''}`}
                                placeholder="Describe your achievement..."
                                required
                            />
                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                        </div>

                        {/* File Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t.formFile} <span className="text-red-500">*</span>
                            </label>
                            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${errors.file ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} hover:bg-gray-50 dark:hover:bg-gray-900/50`}>
                                <div className="space-y-1 text-center">
                                    <span className="material-icons-outlined text-4xl text-gray-400">cloud_upload</span>
                                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input 
                                                id="file-upload" 
                                                type="file" 
                                                className="sr-only" 
                                                onChange={e => setData('file', e.target.files[0])} 
                                                accept=".pdf,.jpg,.jpeg,.png" 
                                                required={!isEdit} 
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        PDF, JPG, PNG up to 5MB
                                    </p>
                                    {/* Menampilkan nama file yang dipilih atau file lama */}
                                    {data.file ? (
                                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2 font-medium">
                                            Selected: {data.file.name}
                                        </p>
                                    ) : isEdit && existingPortfolio?.file_path && (
                                        <p className="text-sm text-gray-500 mt-2 italic">
                                            Current: {existingPortfolio.file_path.split('/').pop()}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {errors.file && <div className="text-red-500 text-xs mt-1">{errors.file}</div>}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                            <Link 
                                href={route('portfolio.index')}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                {t.formCancel}
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md shadow-indigo-600/20 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : (isEdit ? t.formUpdate : t.formSubmit)}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </StudentLayout>
    );
};

export default UploadCertificate;