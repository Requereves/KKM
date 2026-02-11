// export interface Course {
//   id: string;
//   title: string;
//   instructor: string;
//   thumbnail: string;
//   category: string;
//   modules: CourseModule[];
//   description: string;
// }

// export interface CourseModule {
//   id: number;
//   title: string;
//   duration: string;
//   isCompleted: boolean;
//   lessons: Lesson[];
// }

// export interface Lesson {
//   id: number;
//   title: string;
//   duration: string;
//   type: 'video' | 'quiz' | 'reading';
// }

// export interface Portfolio {
//   id: number;
//   student_id: number;
//   title: string;
//   description: string;
//   file_path: string;
//   category: string;
//   status: 'pending' | 'approved' | 'declined';
//   admin_feedback?: string;
//   created_at: string;
// }

// export type Language = 'id' | 'en';

export const DICTIONARY = {
  id: {
    home: "Beranda",
    courses: "Kursus",
    competence: "Kompetensi",
    psychologist: "Psikolog",
    welcome: "Selamat datang kembali,",
    welcomeSub: "Kamu memiliki {0} portofolio disetujui dari total {1} pengajuan ({2}% approval rate). Terus bangun portofolio dan tingkatkan skill kamu!",
    stats: "Statistik Pengajuan",
    last4Months: "4 Bulan Terakhir",
    totalPortfolio: "Total: {0} Portofolio",
    skillProgress: "Progres Skill",
    current: "Saat ini: 0",
    skillMastered: "0 Skill Dikuasai",
    recommendations: "Rekomendasi Untukmu",
    basedOnInterest: "Berdasarkan minat:",
    seeAll: "Lihat Semua",
    startLearning: "Mulai Belajar",
    recentPortfolio: "Portofolio Terbaru",
    noPortfolio: "Belum ada portofolio.",
    startPortfolio: "Mulai buat portofolio pertamamu sekarang.",
    calendar: "Kalender",
    pendingReview: "Menunggu Review",
    allSafe: "Semua aman!",
    noPending: "Tidak ada review tertunda",
    footer: "© 2026 Arahin.id Project. Hak cipta dilindungi.",
    terms: "Syarat & Ketentuan",
    privacy: "Kebijakan Privasi",
    backToDash: "Kembali ke Dashboard",
    courseContent: "Konten Kursus",
    aboutCourse: "Tentang Kursus",
    instructor: "Instruktur",
    underConstruction: "Halaman Sedang Dalam Perbaikan",
    underConstructionDesc: "Fitur ini akan segera hadir. Silakan cek kembali nanti.",
    myCertificates: "Sertifikat Saya",
    uploadCertificate: "Unggah Sertifikat",
    status: "Status",
    actions: "Aksi",
    feedback: "Masukan Admin",
    view: "Lihat",
    delete: "Hapus",
    reupload: "Unggah Ulang",
    approved: "Disetujui",
    pending: "Menunggu",
    declined: "Ditolak",
    confirmDelete: "Apakah Anda yakin ingin menghapus sertifikat ini?",
    cantDeleteApproved: "Sertifikat yang sudah disetujui tidak dapat dihapus.",
    courseCatalog: "Katalog Kursus",
    filterByCategory: "Filter Kategori",
    allCategories: "Semua Kategori",
    formTitle: "Judul Portofolio",
    formCategory: "Kategori",
    formDescription: "Deskripsi",
    formFile: "File Sertifikat (PDF/JPG)",
    formCancel: "Batal",
    formSubmit: "Simpan Portfolio",
    formUpdate: "Update Portfolio",
    selectCategory: "Pilih Kategori",
    filePlaceholder: "Tidak ada file yang dipilih",
    successUpload: "Portofolio berhasil diunggah!",
    successDelete: "Portofolio berhasil dihapus."
  },
  en: {
    home: "Dashboard",
    courses: "Courses",
    competence: "Competence",
    psychologist: "Psychologist",
    welcome: "Welcome back,",
    welcomeSub: "You have {0} approved portfolios out of {1} submissions ({2}% approval rate). Keep building your portfolio and improving your skills!",
    stats: "Submission Stats",
    last4Months: "Last 4 Months",
    totalPortfolio: "Total: {0} Portfolios",
    skillProgress: "Skill Progress",
    current: "Current: 0",
    skillMastered: "0 Skills Mastered",
    recommendations: "Recommended For You",
    basedOnInterest: "Based on interest:",
    seeAll: "See All",
    startLearning: "Start Learning",
    recentPortfolio: "Recent Portfolios",
    noPortfolio: "No portfolios yet.",
    startPortfolio: "Start creating your first portfolio now.",
    calendar: "Calendar",
    pendingReview: "Pending Review",
    allSafe: "All good!",
    noPending: "No pending reviews",
    footer: "© 2026 Arahin.id Project. All rights reserved.",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    backToDash: "Back to Dashboard",
    courseContent: "Course Content",
    aboutCourse: "About Course",
    instructor: "Instructor",
    underConstruction: "Page Under Construction",
    underConstructionDesc: "This feature is coming soon. Please check back later.",
    myCertificates: "My Certificates",
    uploadCertificate: "Upload Certificate",
    status: "Status",
    actions: "Actions",
    feedback: "Admin Feedback",
    view: "View",
    delete: "Delete",
    reupload: "Re-upload",
    approved: "Approved",
    pending: "Pending",
    declined: "Declined",
    confirmDelete: "Are you sure you want to delete this certificate?",
    cantDeleteApproved: "Approved certificates cannot be deleted.",
    courseCatalog: "Course Catalog",
    filterByCategory: "Filter Category",
    allCategories: "All Categories",
    formTitle: "Portfolio Title",
    formCategory: "Category",
    formDescription: "Description",
    formFile: "Certificate File (PDF/JPG)",
    formCancel: "Cancel",
    formSubmit: "Save Portfolio",
    formUpdate: "Update Portfolio",
    selectCategory: "Select Category",
    filePlaceholder: "No file selected",
    successUpload: "Portfolio uploaded successfully!",
    successDelete: "Portfolio deleted successfully."
  }
};