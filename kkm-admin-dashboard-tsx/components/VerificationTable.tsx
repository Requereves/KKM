
import React, { useState } from 'react';
import { StudentVerification } from '../types';
import { translations, Language } from '../translations';

interface VerificationTableProps {
  items: StudentVerification[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (id: string) => void;
  lang: Language;
}

const VerificationTable: React.FC<VerificationTableProps> = ({ items, onApprove, onReject, onView, lang }) => {
  const t = translations[lang];
  const [confirmingAction, setConfirmingAction] = useState<{
    type: 'approve' | 'reject';
    id: string;
  } | null>(null);

  const executeAction = () => {
    if (!confirmingAction) return;
    if (confirmingAction.type === 'approve') onApprove(confirmingAction.id);
    else onReject(confirmingAction.id);
    setConfirmingAction(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden transition-colors">
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t.recent_requests}</h3>
        <a className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium cursor-pointer">{t.view_all}</a>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 uppercase tracking-wider">
              <th className="px-5 py-3">{t.student_col}</th>
              <th className="px-5 py-3">{t.doc_col}</th>
              <th className="px-5 py-3">{t.cat_col}</th>
              <th className="px-5 py-3 text-right">{t.action_col}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-4 font-medium text-slate-900 dark:text-white">{item.name}</td>
                <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{item.documentTitle}</td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium ${
                    item.category.toLowerCase() === 'sertifikat' 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  }`}>
                    {item.category}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onView(item.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      title="View Details"
                    >
                      <span className="material-icons-outlined text-lg">visibility</span>
                    </button>
                    <button 
                      onClick={() => setConfirmingAction({ type: 'approve', id: item.id })}
                      className="p-1.5 rounded bg-emerald-100 dark:bg-green-900/30 text-emerald-600 dark:text-green-400 hover:bg-emerald-200 dark:hover:bg-green-900/50 transition-colors"
                      title="Approve"
                    >
                      <span className="material-icons-outlined text-lg">check</span>
                    </button>
                    <button 
                      onClick={() => setConfirmingAction({ type: 'reject', id: item.id })}
                      className="p-1.5 rounded bg-rose-100 dark:bg-red-900/30 text-rose-600 dark:text-red-400 hover:bg-rose-200 dark:hover:bg-red-900/50 transition-colors"
                      title="Reject"
                    >
                      <span className="material-icons-outlined text-lg">close</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-slate-500 italic">{t.no_pending}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmingAction && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md animate-in zoom-in-95 duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              confirmingAction.type === 'approve' 
                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-500' 
                : 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500'
            }`}>
              <span className="material-icons-outlined text-4xl">
                {confirmingAction.type === 'approve' ? 'verified' : 'error'}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t.confirm_title}</h3>
            <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1 mb-6 font-medium">
              {t.confirm_subtitle}
            </p>

            <div className="flex w-full gap-3">
              <button 
                onClick={() => setConfirmingAction(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl transition-all"
              >
                {t.cancel}
              </button>
              <button 
                onClick={executeAction}
                className={`flex-1 py-2.5 text-white font-bold rounded-xl shadow-lg transition-all ${
                  confirmingAction.type === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                }`}
              >
                {confirmingAction.type === 'approve' ? t.confirm_approve : t.confirm_reject}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationTable;
