{{-- Kita gunakan layout 'landing' yang baru saja dibuat, BUKAN 'app' --}}
@extends('layouts.landing')

@section('content')
    <header class="pt-40 pb-20 hero-gradient">
        <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-600 text-sm font-bold mb-6">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                    </span>
                    Platform Validasi Kompetensi No. 1 di Indonesia
                </div>
                <h1 class="text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                    Satu Platform, <br><span class="text-blue-600">Ribuan Kompetensi</span> Terintegrasi.
                </h1>
                <p class="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                    Website KKM hadir sebagai "Rak Raksasa" digital yang menjembatani talenta mahasiswa dengan kebutuhan riil industri melalui validasi data yang presisi.
                </p>
                <div class="flex items-center gap-4">
                    <a href="#solusi" class="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition flex items-center gap-2">
                        Mulai Jelajahi <i class="fa-solid fa-arrow-right"></i>
                    </a>
                    
                </div>
                <div class="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500">
                    <div class="flex -space-x-2">
                        <img class="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User1&background=random" alt="User">
                        <img class="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User2&background=random" alt="User">
                        <img class="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User3&background=random" alt="User">
                    </div>
                    <span>Bergabung dengan 1,000+ Mahasiswa Telkom University</span>
                </div>
            </div>
            <div class="relative">
                <div class="bg-blue-600/5 rounded-3xl p-4 border border-blue-100">
                    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                        <div class="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <div class="flex gap-1.5">
                                <div class="w-3 h-3 rounded-full bg-red-400"></div>
                                <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div class="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div class="text-xs font-bold text-slate-400">DASHBOARD MAHASISWA</div>
                        </div>
                        <div class="p-8">
                            <div class="w-full h-64 bg-slate-100 rounded-xl mb-6 flex items-center justify-center border-2 border-dashed border-slate-200">
                                <i class="fa-solid fa-id-card text-6xl text-slate-300"></i>
                                <span class="ml-4 text-slate-400 font-bold italic">Preview Kartu KKM</span>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="h-12 bg-blue-50 rounded-lg"></div>
                                <div class="h-12 bg-slate-50 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                    <div class="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl">
                        <i class="fa-solid fa-qrcode"></i>
                    </div>
                    <div>
                        <div class="text-xs text-slate-500 font-bold uppercase">QR Terverifikasi</div>
                        <div class="font-extrabold text-slate-800">HRD Verified</div>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <section id="solusi" class="py-24 bg-white">
        <div class="max-w-7xl mx-auto px-6">
            <div class="text-center max-w-2xl mx-auto mb-16">
                <h2 class="text-blue-600 font-bold tracking-widest uppercase text-sm mb-4">Nilai Utama</h2>
                <h3 class="text-4xl font-extrabold text-slate-900 mb-6">Membangun Karir dengan Strategi IVES</h3>
                <p class="text-slate-600">Empat pilar utama yang menjadikan Website KKM lebih dari sekadar platform pencari kerja biasa.</p>
            </div>
            
            <div class="grid md:grid-cols-4 gap-8">
                <div class="card-shelf bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div class="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-blue-100">I</div>
                    <h4 class="text-xl font-bold mb-3">Integrasi</h4>
                    <p class="text-slate-500 text-sm leading-relaxed">Seluruh kebutuhan pengembangan diri dikelola dalam satu rak digital terpadu.</p>
                </div>
                <div class="card-shelf bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div class="w-14 h-14 bg-indigo-600 text-white rounded-xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-indigo-100">V</div>
                    <h4 class="text-xl font-bold mb-3">Validasi</h4>
                    <p class="text-slate-500 text-sm leading-relaxed">Data kompetensi diverifikasi langsung melalui sistem uji standar industri.</p>
                </div>
                <div class="card-shelf bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div class="w-14 h-14 bg-amber-500 text-white rounded-xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-amber-100">E</div>
                    <h4 class="text-xl font-bold mb-3">Efisiensi</h4>
                    <p class="text-slate-500 text-sm leading-relaxed">HRD dapat memindai profil kandidat secara instan melalui teknologi QR Code.</p>
                </div>
                <div class="card-shelf bg-slate-50 p-8 rounded-3xl border border-slate-100">
                    <div class="w-14 h-14 bg-emerald-500 text-white rounded-xl flex items-center justify-center text-2xl font-black mb-6 shadow-lg shadow-emerald-100">S</div>
                    <h4 class="text-xl font-bold mb-3">Sinergi</h4>
                    <p class="text-slate-500 text-sm leading-relaxed">Menghubungkan talenta lulusan dengan kebutuhan spesifik perusahaan secara cerdas.</p>
                </div>
            </div>
        </div>
    </section>

    <section id="fitur" class="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="grid md:grid-cols-2 gap-16 items-center">
                <div class="order-2 md:order-1">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-white/10 h-40 rounded-2xl flex items-center justify-center flex-col gap-2 border border-white/20">
                            <i class="fa-solid fa-graduation-cap text-3xl"></i>
                            <span class="text-sm font-bold uppercase tracking-wider">Mahasiswa</span>
                        </div>
                        <div class="bg-blue-600 h-40 rounded-2xl flex items-center justify-center flex-col gap-2 border border-blue-400">
                            <i class="fa-solid fa-qrcode text-3xl"></i>
                            <span class="text-sm font-bold uppercase tracking-wider">Kartu KKM</span>
                        </div>
                        <div class="bg-white/10 h-40 rounded-2xl flex items-center justify-center flex-col gap-2 border border-white/20">
                            <i class="fa-solid fa-briefcase text-3xl"></i>
                            <span class="text-sm font-bold uppercase tracking-wider">Industri</span>
                        </div>
                        <div class="bg-white/10 h-40 rounded-2xl flex items-center justify-center flex-col gap-2 border border-white/20">
                            <i class="fa-solid fa-chart-simple text-3xl"></i>
                            <span class="text-sm font-bold uppercase tracking-wider">Analytics</span>
                        </div>
                    </div>
                </div>
                <div class="order-1 md:order-2">
                    <h2 class="text-4xl font-extrabold mb-6 leading-tight">Konsep "Rak Raksasa" <br>Untuk Karier Anda.</h2>
                    <p class="text-slate-400 text-lg mb-8">
                        Bayangkan sebuah sistem yang menata seluruh sertifikat, riwayat magang, dan hasil uji kompetensi Anda ke dalam satu rak digital yang terorganisir rapi dan siap dipetik oleh perusahaan terbaik.
                    </p>
                    <ul class="space-y-4 mb-8">
                        <li class="flex gap-3">
                            <i class="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                            <span>Akses instan bagi HRD perusahaan</span>
                        </li>
                        <li class="flex gap-3">
                            <i class="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                            <span>Dashboard pengembangan diri personal</span>
                        </li>
                        <li class="flex gap-3">
                            <i class="fa-solid fa-circle-check text-blue-500 mt-1"></i>
                            <span>Verifikasi oleh Psikolog & Profesional</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-1/2"></div>
    </section>
@endsection