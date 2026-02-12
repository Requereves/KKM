import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';
import { DICTIONARY } from '../../types'; // Pastikan file resources/js/types.js sudah dibuat

const Dashboard = ({ 
    auth, 
    userName, 
    progressPercentage, 
    totalPortfolios, 
    approvedPortfolios,
    calendarDays, 
    currentMonth,
    certificates, 
    upcomingActivities,
    chartData, 
    skillsData,
    recommendedCourses,
    userInterest,
    language = 'en' // Default ke 'en' jika tidak dikirim dari middleware
}) => {
  const t = DICTIONARY[language];

  // Helper untuk format string dengan argumen {0}, {1}, dst
  const format = (str, ...args) => {
    if (!str) return '';
    return str.replace(/{(\d+)}/g, (match, number) => {
      return typeof args[number] !== 'undefined' ? String(args[number]) : match;
    });
  };

  return (
    <StudentLayout user={auth.user}>
      <Head title="Dashboard Mahasiswa" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        
        {/* Banner Selamat Datang */}
        <section className="bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 mb-8 border border-blue-100 dark:border-slate-700 shadow-sm relative overflow-hidden transition-colors">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              {t.welcome} {userName}!
              <span className="text-2xl animate-pulse">👋</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl">
               {/* Menggunakan data dinamis dari props controller */}
               {format(t.welcomeSub, approvedPortfolios, totalPortfolios, progressPercentage)}
            </p>
          </div>
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-100 dark:bg-blue-900 rounded-full opacity-50 blur-3xl"></div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Baris Chart/Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Chart Statistik Portfolio (Data dari chartData controller) */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.stats}</h3>
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{t.last4Months}</span>
                </div>
                <div className="h-40 relative flex items-end justify-between px-2 gap-2">
                  <div className="absolute inset-x-0 bottom-0 border-b border-gray-200 dark:border-gray-600 h-full flex flex-col justify-between text-[10px] text-gray-400 dark:text-gray-500 py-1">
                    <span>Max</span>
                    <span>0</span>
                  </div>
                  <div className="w-full h-full flex items-end justify-between z-10 pl-6 pb-1">
                    {chartData.map((data, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2 w-full group">
                        <div 
                          className="w-2 bg-blue-500 rounded-t-full transition-all duration-500 group-hover:bg-blue-400" 
                          style={{ height: `${(data.count / (totalPortfolios || 1)) * 100}%`, minHeight: '4px' }}
                        ></div>
                        <span className="text-[10px] text-gray-500">{data.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {format(t.totalPortfolio, totalPortfolios)}
                </div>
              </div>

              {/* Skill Progress (Data dari skillsData controller) */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.skillProgress}</h3>
                  <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded">
                    {skillsData.current} / {skillsData.total} Skills
                  </span>
                </div>
                <div className="h-40 relative flex items-center justify-center">
                    <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-700" />
                            <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                strokeDasharray={314}
                                strokeDashoffset={314 - (314 * (skillsData.current / skillsData.total))}
                                className="text-blue-600 transition-all duration-1000" 
                                strokeLinecap="round"
                            />
                        </svg>
                        <span className="absolute text-xl font-bold text-gray-900 dark:text-white">
                            {Math.round((skillsData.current / skillsData.total) * 100)}%
                        </span>
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400 font-medium">{t.skillMastered}</div>
              </div>
            </div>

            {/* Recommendations (Data dari recommendedCourses controller) */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {t.recommendations} <span className="text-orange-500 text-xl material-icons-outlined">local_fire_department</span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t.basedOnInterest} <span className="text-blue-600 font-medium">{userInterest || 'Umum'}</span>
                  </p>
                </div>
                <Link className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1" href={route('courses.index')}>
                  {t.seeAll} <span className="material-icons-outlined text-sm">arrow_forward</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCourses.map((course) => (
                  <div key={course.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col h-full">
                    <div className="h-32 relative bg-gray-800">
                      <span className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] px-2 py-0.5 rounded-full z-10">{course.category}</span>
                      <img 
                        src={course.thumbnail || '/images/default-course.jpg'} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-75 transition-opacity" 
                        alt={course.title}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">by {course.instructor}</p>
                      <div className="mt-auto">
                        <Link 
                          href={route('courses.show', course.id)}
                          className="w-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          {t.startLearning} <span className="material-icons-outlined text-[14px]">arrow_right_alt</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Portfolio (Data dari certificates controller) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.recentPortfolio}</h3>
                <Link className="text-sm font-medium text-blue-600 hover:text-blue-700" href={route('portfolio.index')}>{t.seeAll}</Link>
              </div>
              
              {certificates.length > 0 ? (
                  <div className="space-y-4">
                    {certificates.map(item => (
                      <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-100 dark:border-gray-700">
                          <div className={`h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 font-bold`}>
                              {item.initials}
                          </div>
                          <div className="flex-grow">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{item.message}</h4>
                              <p className="text-[10px] text-gray-500">{item.name} • {item.time}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${
                              item.status === 'approved' ? 'bg-green-100 text-green-700' : 
                              item.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                          }`}>
                              {item.status}
                          </span>
                      </div>
                    ))}
                  </div>
              ) : (
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                      <span className="material-icons-outlined text-4xl text-gray-300 dark:text-gray-600 mb-3">image_not_supported</span>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">{t.noPortfolio}</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{t.startPortfolio}</p>
                  </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Kalender Dinamis (Data dari calendarDays controller) */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.calendar}</h3>
                <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded font-medium">{currentMonth}</span>
              </div>
              <div className="grid grid-cols-7 text-center text-[10px] mb-2 text-gray-400 dark:text-gray-500 font-medium">
                <div>MO</div><div>TU</div><div>WE</div><div>TH</div><div>FR</div><div>SA</div><div>SU</div>
              </div>
              <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
                {calendarDays.map((day, idx) => (
                   <div key={idx} className={`relative w-8 h-8 flex items-center justify-center mx-auto rounded-full cursor-pointer
                        ${day.isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                        ${!day.date ? 'opacity-0 pointer-events-none' : ''}
                   `}>
                        {day.date}
                        {day.hasActivity && !day.isToday && (
                            <span className="absolute bottom-1 w-1 h-1 bg-green-500 rounded-full"></span>
                        )}
                   </div>
                ))}
              </div>
            </div>

            {/* Pending Review Status */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center transition-colors">
              <div className="flex justify-start w-full mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.pendingReview}</h3>
              </div>
              
              {upcomingActivities.length > 0 ? (
                  <div className="w-full space-y-3 text-left">
                      {upcomingActivities.map((act, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                               <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded flex items-center justify-center font-bold text-xs shrink-0">
                                  {act.day}
                              </div>
                              <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{act.title}</p>
                                  <p className="text-[10px] text-gray-500">{act.date}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center mb-4">
                        <span className="material-icons-outlined text-green-500 text-3xl">check_circle</span>
                    </div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">{t.allSafe}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.noPending}</p>
                  </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </StudentLayout>
  );
};

export default Dashboard;