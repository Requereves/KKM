import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StudentLayout from '../../../Layouts/StudentLayout';
import { DICTIONARY } from '../../../types'; // Sesuaikan path jika berbeda


const CourseDetail = ({ auth, course, language = 'en' }) => {
  const t = DICTIONARY[language];
  
  // State untuk accordion modul
  const [openModule, setOpenModule] = useState(1);

  if (!course) {
    return (
        <StudentLayout user={auth.user}>
            <div className="p-8 text-center dark:text-white">Course not found.</div>
        </StudentLayout>
    );
  }

  const toggleModule = (id) => {
    setOpenModule(openModule === id ? null : id);
  };

  return (
    <StudentLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{course.title}</h2>}
    >
        <Head title={course.title} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Breadcrumb */}
            <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href={route('home')} className="hover:text-indigo-600 transition-colors">{t.home}</Link>
                <span className="material-icons-outlined text-xs">chevron_right</span>
                <Link href={route('courses.index')} className="hover:text-indigo-600 transition-colors">Courses</Link>
                <span className="material-icons-outlined text-xs">chevron_right</span>
                <span className="text-gray-900 dark:text-white font-medium truncate">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content (Kiri) */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative group">
                        {/* Thumbnail as Placeholder */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center opacity-40" 
                            style={{ backgroundImage: `url('${course.thumbnail}')` }} 
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <button className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform hover:bg-white/30 text-white shadow-xl">
                                <span className="material-icons-outlined text-4xl">play_arrow</span>
                            </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    <span className="material-icons-outlined cursor-pointer">play_arrow</span>
                                    <div className="bg-gray-600 h-1 rounded-full w-32 md:w-64">
                                        <div className="bg-indigo-500 h-1 w-1/3 rounded-full"></div>
                                    </div>
                                    <span className="text-[10px] md:text-xs">12:30 / 45:00</span>
                                </div>
                                <div className="flex gap-4">
                                    <span className="material-icons-outlined cursor-pointer hover:text-indigo-400">volume_up</span>
                                    <span className="material-icons-outlined cursor-pointer hover:text-indigo-400">fullscreen</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Header Info */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                                <span className="material-icons-outlined text-base text-indigo-500">person</span> {course.instructor}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-icons-outlined text-base text-indigo-500">category</span> {course.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="material-icons-outlined text-base text-yellow-500">star</span> 4.8 (120 reviews)
                            </span>
                        </div>
                    </div>

                    {/* Deskripsi */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{t.aboutCourse}</h2>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                            {course.description}
                        </p>
                    </div>
                </div>

                {/* Sidebar Content (Kanan) */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col h-[600px]">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">{t.courseContent}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {course.modules ? course.modules.length : 0} Modules • {course.lessons_count || 0} Lessons
                            </p>
                        </div>
                        
                        <div className="overflow-y-auto flex-grow p-2 space-y-2 custom-scrollbar">
                            {course.modules && course.modules.map((module) => (
                                <div key={module.id} className="border border-gray-100 dark:border-gray-700 rounded-lg overflow-hidden">
                                    <button 
                                        onClick={() => toggleModule(module.id)}
                                        className="w-full flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
                                    >
                                        <div className="text-left">
                                            <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{module.title}</h4>
                                            <p className="text-[10px] text-gray-500">
                                                {module.lessons ? module.lessons.length : 0} lessons • {module.duration || '00:00'}
                                            </p>
                                        </div>
                                        <span className={`material-icons-outlined text-gray-400 transition-transform ${openModule === module.id ? 'rotate-180' : ''}`}>expand_more</span>
                                    </button>
                                    
                                    {openModule === module.id && (
                                        <div className="bg-white dark:bg-slate-800 divide-y divide-gray-50 dark:divide-gray-700">
                                            {module.lessons && module.lessons.map((lesson) => (
                                                <div key={lesson.id} className="p-3 pl-4 flex items-center gap-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer group transition-colors">
                                                    <div className={`p-1 rounded ${lesson.is_active ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                                        <span className="material-icons-outlined text-sm">
                                                            {lesson.type === 'video' ? 'play_arrow' : 'article'}
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow">
                                                        <p className={`text-sm ${lesson.is_active ? 'font-medium text-indigo-600' : 'text-gray-700 dark:text-gray-300'}`}>
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-[10px] text-gray-400">{lesson.duration}</p>
                                                    </div>
                                                    {lesson.is_active && <span className="material-icons-outlined text-xs text-indigo-600">equalizer</span>}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">{t.instructor}</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {course.instructor ? course.instructor.charAt(0) : 'I'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">{course.instructor}</p>
                                <p className="text-xs text-gray-500">Instructor & Subject Matter Expert</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </StudentLayout>
  );
};

export default CourseDetail;