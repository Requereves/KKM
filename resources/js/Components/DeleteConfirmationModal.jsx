import React, { Fragment } from 'react';

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, title, message, processing }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                
                {/* Backdrop (Overlay Gelap + Blur) */}
                <div 
                    className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" 
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                {/* Trik untuk centering di browser lama */}
                <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

                {/* Modal Panel */}
                <div className="inline-block transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left align-bottom shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            
                            {/* Icon Peringatan (Merah Muda) */}
                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                <span className="material-icons-outlined text-rose-600 dark:text-rose-400 text-2xl">
                                    warning
                                </span>
                            </div>

                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white" id="modal-title">
                                    {title}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Tombol Aksi */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={processing}
                            className="inline-flex w-full justify-center rounded-lg bg-rose-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors items-center gap-2"
                        >
                            {processing ? (
                                <span className="material-icons-outlined animate-spin text-sm">sync</span>
                            ) : (
                                <span className="material-icons-outlined text-sm">delete</span>
                            )}
                            {processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={processing}
                            className="mt-3 inline-flex w-full justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
                        >
                            Batal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}