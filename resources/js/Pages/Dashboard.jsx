import React, { useState } from 'react';
import StudentLayout from '../Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// 1. Registrasi Komponen Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ 
    auth,
    userName,
    approvedPortfolios,
    totalPortfolios,
    progressPercentage,
    chartData,
    skillsData,
    userInterest,
    recommendedCourses,
    certificates,
    currentMonth,
    calendarDays,
    upcomingActivities
}) {
    // --- STATE MANAGEMENT ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);

    // --- CHART CONFIGURATION ---
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    const colors = {
        text: isDarkMode ? '#9ca3af' : '#4b5563',
        grid: isDarkMode ? '#374151' : '#e5e7eb',
        indigo: { line: '#6366f1', fill: isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)' },
        blue: { line: '#3b82f6', fill: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)' }
    };

    const commonOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 1, color: colors.text, font: { size: 10 } },
                grid: { color: colors.grid, drawBorder: false }
            },
            x: {
                ticks: { color: colors.text, font: { size: 10 } },
                grid: { display: false }
            }
        },
        elements: {
            line: { tension: 0.4 },
            point: { radius: 3, hitRadius: 10, hoverRadius: 5 }
        }
    };

    // Data Chart 1: Portfolio
    const portfolioChartData = {
        labels: chartData.map(d => d.label),
        datasets: [{
            label: 'Pengajuan',
            data: chartData.map(d => d.count),
            borderColor: colors.indigo.line,
            backgroundColor: colors.indigo.fill,
            fill: true,
            pointBackgroundColor: colors.indigo.line,
            pointBorderColor: '#fff',
        }]
    };

    // Data Chart 2: Skills
    const skillsChartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [{
            label: 'Skill Dikuasai',
            data: skillsData.progression,
            borderColor: colors.blue.line,
            backgroundColor: colors.blue.fill,
            fill: true,
            pointBackgroundColor: colors.blue.line,
            pointBorderColor: '#fff',
        }]
    };

    // --- HANDLERS ---
    const openPortfolioModal = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setIsModalOpen(true);
    };

    const closePortfolioModal = () => {
        setIsModalOpen(false);
        setSelectedPortfolio(null);
    };

    return (
        <StudentLayout>
            <Head title="Dashboard" />

            <div className="space-y-6">
                
                {/* Welcome Card */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="p-6 text-gray-900 dark:text-gray-100">
                        <h3 className="text-2xl font-bold mb-2">Welcome back, {userName}! 👋</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Kamu memiliki <span className="font-semibold text-green-600 dark:text-green-400">{approvedPortfolios}</span> portofolio disetujui dari total <span className="font-semibold">{totalPortfolios}</span> pengajuan (<span className="font-semibold">{progressPercentage}%</span> approval rate).
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            Terus bangun portofolio dan tingkatkan skill kamu!
                        </p>
                    </div>
                </div>

                {/* Stats Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Chart 1 */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Statistik Pengajuan</h4>
                            <span className="text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                4 Bulan Terakhir
                            </span>
                        </div>
                        <div className="relative h-64 w-full">
                            <Line options={commonOptions} data={portfolioChartData} />
                        </div>
                        <div className="mt-4 text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Total: <span className="font-bold text-indigo-600 dark:text-indigo-400">{totalPortfolios}</span> Portofolio
                            </p>
                        </div>
                    </div>

                    {/* Chart 2 */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Progres Skill</h4>
                            <span className="text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
                                Current: {skillsData.current}
                            </span>
                        </div>
                        <div className="relative h-64 w-full">
                            <Line options={commonOptions} data={skillsChartData} />
                        </div>
                        <div className="mt-4 text-center border-t border-gray-100 dark:border-gray-700 pt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                <span className="font-bold text-blue-600 dark:text-blue-400">{skillsData.current}</span> Skill Dikuasai
                            </p>
                        </div>
                    </div>
                </div>

                {/* ========================================================= */}
                {/* SECTION REKOMENDASI COURSE (UPDATED) */}
                {/* ========================================================= */}
                <div>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Rekomendasi Untukmu 🎯</h3>
                            
                            {/* Hanya tampilkan subtitle jika user sudah punya interest */}
                            {userInterest && (
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Berdasarkan minat: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{userInterest}</span>
                                </p>
                            )}
                        </div>
                        
                        {/* Tombol Lihat Semua hanya muncul jika ada data */}
                        {recommendedCourses.length > 0 && (
                            <Link href={route('courses.index')} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 flex items-center gap-1 transition-colors">
                                Lihat Semua
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </Link>
                        )}
                    </div>

                    {recommendedCourses.length > 0 ? (
                        // 🟢 JIKA ADA COURSE (TAMPILKAN CARD)
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedCourses.map((course, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group flex flex-col h-full overflow-hidden">
                                    <div className="relative h-40 overflow-hidden">
                                        <img 
                                            src={course.thumbnail ? `/storage/${course.thumbnail}` : 'https://placehold.co/600x400/png?text=Course+Image'} 
                                            alt={course.title} 
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
                                        />
                                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-indigo-600 shadow-sm border border-indigo-100">
                                            {course.category}
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="text-md font-bold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {course.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">by {course.instructor}</p>
                                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <a href="#" className="block w-full py-2 px-4 bg-gray-50 dark:bg-gray-700 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-gray-700 dark:text-gray-200 hover:text-white text-center rounded-lg font-semibold text-xs transition-all duration-300">
                                                Mulai Belajar →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // 🔴 JIKA KOSONG (TAMPILKAN EMPTY STATE / CTA)
                        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl p-8 text-center animate-in fade-in zoom-in duration-300">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white dark:bg-gray-800 mb-4 shadow-sm">
                                <span className="material-icons-outlined text-3xl text-indigo-500">school</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                Belum ada rekomendasi, nih!
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6 text-sm">
                                Kami butuh tahu apa yang ingin kamu pelajari agar bisa memberikan rekomendasi course terbaik untukmu.
                            </p>
                            <Link 
                                href={route('profile.edit')} 
                                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/30 transition-all gap-2 text-sm"
                            >
                                <span className="material-icons-outlined text-base">edit_note</span>
                                Atur Minat Belajar
                            </Link>
                        </div>
                    )}
                </div>

                {/* Bottom Section: Portfolio List & Calendar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Portfolio List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Portofolio Terbaru</h4>
                                    <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Lihat Semua</a>
                                </div>

                                <div className="space-y-4">
                                    {certificates.length > 0 ? (
                                        certificates.map((cert) => (
                                            <div 
                                                key={cert.id} 
                                                onClick={() => openPortfolioModal(cert)}
                                                className="flex items-start justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-600 group"
                                            >
                                                <div className="flex items-start space-x-4 pointer-events-none">
                                                    <div className="flex-shrink-0 mt-1">
                                                        <div className={`w-10 h-10 rounded-full bg-${cert.color || 'gray'}-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-white dark:ring-gray-800`}>
                                                            {cert.initials}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                                            <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                                {cert.message}
                                                            </h5>
                                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide 
                                                                ${cert.status === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : ''}
                                                                ${cert.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' : ''}
                                                                ${cert.status === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : ''}
                                                            `}>
                                                                {cert.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                            {cert.description ? (cert.description.length > 80 ? cert.description.substring(0, 80) + '...' : cert.description) : 'No description available'}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                                            <span className="material-icons-outlined text-[10px]">category</span> 
                                                            {cert.name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{cert.time}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 flex flex-col items-center">
                                            <span className="material-icons-outlined text-4xl text-gray-300 mb-2">folder_off</span>
                                            <p className="text-gray-500 dark:text-gray-400">Belum ada portofolio.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar & Pending Review */}
                    <div className="space-y-6">
                        
                        {/* Calendar */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Kalender</h4>
                                    <span className="text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded">
                                        {currentMonth}
                                    </span>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                                        <div key={day} className="text-xs font-bold text-gray-400 uppercase tracking-wider py-2">{day}</div>
                                    ))}
                                </div>
                                
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {calendarDays.map((day, idx) => (
                                        <div key={idx} className="aspect-square flex items-center justify-center p-0.5">
                                            {day.date && (
                                                <div className={`w-full h-full rounded-lg flex items-center justify-center text-xs transition-all relative group
                                                    ${day.isToday ? 'bg-indigo-600 text-white font-bold shadow-md' : ''}
                                                    ${day.hasActivity && !day.isToday ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold border border-green-200 dark:border-green-800' : ''}
                                                    ${!day.hasActivity && !day.isToday ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
                                                `}>
                                                    {day.date}
                                                    {day.hasActivity && (
                                                        <span className={`absolute bottom-1 w-1 h-1 rounded-full ${day.isToday ? 'bg-white' : 'bg-green-500'}`}></span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pending Review */}
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">Pending Review</h4>
                                    {upcomingActivities.length > 0 && (
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900 text-xs font-bold text-yellow-800 dark:text-yellow-200">
                                            {upcomingActivities.length}
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    {upcomingActivities.length > 0 ? (
                                        upcomingActivities.map((activity, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
                                                <div className="flex-shrink-0 text-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1.5 min-w-[3rem]">
                                                    <span className="block text-xs text-gray-500 uppercase">{activity.date.substring(0, 3)}</span>
                                                    <span className="block text-lg font-bold text-gray-800 dark:text-gray-200">{activity.day}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        {activity.title}
                                                    </h5>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-100 dark:border-yellow-800/50">
                                                            Menunggu
                                                        </span>
                                                        <span className="text-xs text-gray-500 truncate">{activity.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-6">
                                            <span className="material-icons-outlined text-green-500 text-3xl mb-1">task_alt</span>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">Semua aman!</p>
                                            <p className="text-xs text-gray-400 dark:text-gray-500">Tidak ada review tertunda</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- PORTFOLIO MODAL --- */}
            {isModalOpen && selectedPortfolio && (
                <div className="relative z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity opacity-100" onClick={closePortfolioModal}></div>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-gray-200 dark:border-gray-700">
                                
                                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:px-6 flex justify-between items-center border-b border-gray-100 dark:border-gray-700">
                                    <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                                        {selectedPortfolio.message}
                                    </h3>
                                    <button type="button" onClick={closePortfolioModal} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                        <span className="material-icons-outlined">close</span>
                                    </button>
                                </div>

                                <div className="px-4 py-5 sm:p-6">
                                    <div className="space-y-4">
                                        <div>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset 
                                                ${selectedPortfolio.status === 'approved' ? 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-400' : ''}
                                                ${selectedPortfolio.status === 'rejected' ? 'bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-900/30 dark:text-red-400' : ''}
                                                ${selectedPortfolio.status === 'pending' || !['approved','rejected'].includes(selectedPortfolio.status) ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-300' : ''}
                                            `}>
                                                {selectedPortfolio.status ? selectedPortfolio.status.toUpperCase() : 'UNKNOWN'}
                                            </span>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Kategori</label>
                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPortfolio.name}</p>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Deskripsi</label>
                                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 text-sm text-gray-600 dark:text-gray-300 max-h-32 overflow-y-auto">
                                                {selectedPortfolio.description || 'Tidak ada deskripsi.'}
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-900/30 rounded-lg p-3">
                                            <label className="block text-xs font-bold text-yellow-700 dark:text-yellow-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <span className="material-icons-outlined text-xs">comment</span> Feedback Admin
                                            </label>
                                            <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                                                {selectedPortfolio.admin_feedback || 'No feedback.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-100 dark:border-gray-700">
                                    <a href={`/portfolio/${selectedPortfolio.id}`} className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto transition-colors items-center gap-2">
                                        <span className="material-icons-outlined text-sm">visibility</span> Lihat Detail
                                    </a>
                                    <button type="button" onClick={closePortfolioModal} className="mt-3 inline-flex w-full justify-center rounded-lg bg-white dark:bg-gray-700 px-3 py-2 text-sm font-semibold text-gray-900 dark:text-gray-200 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto transition-colors">
                                        Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </StudentLayout>
    );
}