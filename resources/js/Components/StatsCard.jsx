import React from 'react';

const StatsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  iconColor, 
  badge, 
  hoverBorder 
}) => {
  
  // 1. Mapping Badge Colors (Menggunakan warna standard Tailwind yang aman)
  const badgeClasses = {
    warning: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
    success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
    info: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  };

  // 2. Helper: Mapping Icon Color Class
  // Menggunakan pemetaan eksplisit agar Tailwind tidak membuang (purge) warnanya
  const getIconColorClass = (color) => {
    const colors = {
      'amber-500': 'text-amber-500',
      'indigo-600': 'text-indigo-600',
      'emerald-500': 'text-emerald-500',
      'purple-500': 'text-purple-500',
    };
    return colors[color] || 'text-slate-500';
  };

  // 3. Helper: Mapping Border Hover Color Class
  const getBorderHoverClass = (color) => {
    const borders = {
      'amber-500': 'hover:border-amber-500/50',
      'indigo-600': 'hover:border-indigo-600/50',
      'emerald-500': 'hover:border-emerald-500/50',
      'purple-500': 'hover:border-purple-500/50',
    };
    return borders[color] || 'hover:border-slate-300';
  };

  return (
    <div className={`bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group transition-all ${getBorderHoverClass(hoverBorder)}`}>
      
      {/* Background Icon (Posisi Absolut dengan Opacity rendah) */}
      <div className="absolute right-0 top-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        <span className={`material-icons-outlined text-6xl ${getIconColorClass(iconColor)}`}>
          {icon}
        </span>
      </div>

      {/* Judul Kategori */}
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
        {title}
      </p>
      
      {/* Nilai Utama & Lencana (Badge) */}
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
          {value}
        </h3>
        
        {badge && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${badgeClasses[badge.type]}`}>
            {badge.type === 'warning' && <span className="material-icons-outlined text-[10px]">priority_high</span>}
            {badge.type === 'success' && <span className="material-icons-outlined text-[10px]">trending_up</span>}
            {badge.type === 'info' && <span className="material-icons-outlined text-[10px]">verified</span>}
            {badge.text}
          </span>
        )}
      </div>

      {/* Deskripsi Stat */}
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
        {description}
      </p>
    </div>
  );
};

export default StatsCard;