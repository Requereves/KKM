
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: string;
  iconColor: string;
  badge?: {
    text: string;
    type: 'warning' | 'success' | 'info';
  };
  hoverBorder: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, value, description, icon, iconColor, badge, hoverBorder 
}) => {
  const badgeClasses = {
    warning: 'text-amber-600 dark:text-warning bg-amber-50 dark:bg-warning/10',
    success: 'text-emerald-600 dark:text-secondary bg-emerald-50 dark:bg-secondary/10',
    info: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10',
  };

  return (
    <div className={`bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group hover:border-${hoverBorder}/50 transition-all`}>
      <div className="absolute right-0 top-0 p-4 opacity-5 dark:opacity-10 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity">
        <span className={`material-icons-outlined text-6xl text-${iconColor}`}>{icon}</span>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {badge && (
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded flex items-center gap-1 ${badgeClasses[badge.type]}`}>
            {badge.type === 'warning' && <span className="material-icons-outlined text-[10px]">priority_high</span>}
            {badge.type === 'success' && <span className="material-icons-outlined text-[10px]">trending_up</span>}
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{description}</p>
    </div>
  );
};

export default StatsCard;
