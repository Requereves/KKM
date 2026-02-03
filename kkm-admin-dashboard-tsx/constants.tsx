
import { CompetencyData, SkillGapData, StudentVerification, Student, Job, JobApplication, Course, Announcement } from './types';

export const INITIAL_VERIFICATIONS: StudentVerification[] = [
  { 
    id: '1', 
    studentId: '1',
    name: 'Dhitan Hakim', 
    nim: 'TEMP-1',
    documentTitle: 'Future Entrepreneur Summit - Webinar', 
    description: 'Webinar tentang kewirausahaan masa depan.',
    filePath: 'portfolios/Fqcic7iFBshCblKeMBjAofl15hE9geo4TDdrb9Pi.pdf',
    category: 'sertifikat', 
    status: 'pending',
    createdAt: '2026-01-30 13:13:21'
  },
  { 
    id: '2', 
    studentId: '2',
    name: 'Budi Santoso', 
    nim: 'NIM-002',
    documentTitle: 'AWS Cloud Practitioner Certificate', 
    description: 'Sertifikasi kompetensi cloud computing dasar.',
    filePath: 'portfolios/aws-cert-budi.pdf',
    category: 'sertifikat', 
    status: 'pending',
    createdAt: '2026-01-31 09:45:00'
  },
  { 
    id: '3', 
    studentId: '3',
    name: 'Siti Aminah', 
    nim: 'NIM-003',
    documentTitle: 'React.js Portfolio Project', 
    description: 'Aplikasi web real-time menggunakan React.',
    filePath: 'portfolios/react-project-siti.zip',
    category: 'proyek', 
    status: 'pending',
    createdAt: '2026-01-31 10:20:00'
  },
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    userId: '1',
    nim: 'TEMP-1',
    fullName: 'Dhitan Hakim',
    email: 'dhitanhakim@gmail.com',
    major: 'Teknik Informatika',
    phone: '+62 812-3456-7890',
    yearOfEntry: '2022',
    createdAt: '2026-01-30 11:52:24',
    updatedAt: '2026-01-31 13:07:36',
    avatar: 'https://picsum.photos/seed/dhitan/100/100',
    skills: ['PHP', 'Laravel', 'React', 'MySQL'],
    status: 'active'
  },
  {
    id: '2',
    userId: '2',
    nim: '42119001',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@student.kkm.ac.id',
    major: 'Sistem Informasi',
    phone: '+62 813-9988-7766',
    yearOfEntry: '2021',
    createdAt: '2025-08-15 09:00:00',
    updatedAt: '2026-01-20 10:30:00',
    avatar: 'https://picsum.photos/seed/budi/100/100',
    skills: ['AWS', 'Python', 'Data Analysis'],
    status: 'active'
  },
  {
    id: '3',
    userId: '3',
    nim: '42119005',
    fullName: 'Siti Aminah',
    email: 'siti.aminah@student.kkm.ac.id',
    major: 'Teknik Komputer',
    phone: '+62 856-1122-3344',
    yearOfEntry: '2023',
    createdAt: '2025-09-01 08:30:00',
    updatedAt: '2026-01-25 14:15:00',
    avatar: 'https://picsum.photos/seed/siti/100/100',
    skills: ['Networking', 'Cisco', 'Linux', 'Cybersecurity'],
    status: 'active'
  },
  {
    id: '4',
    userId: '4',
    nim: '42119008',
    fullName: 'Rizky Pratama',
    email: 'rizky.p@student.kkm.ac.id',
    major: 'Desain Komunikasi Visual',
    phone: '+62 811-2233-4455',
    yearOfEntry: '2022',
    createdAt: '2025-08-20 10:00:00',
    updatedAt: '2025-12-10 11:00:00',
    avatar: 'https://picsum.photos/seed/rizky/100/100',
    skills: ['Figma', 'Adobe Illustrator', 'UI/UX'],
    status: 'inactive'
  },
  {
    id: '5',
    userId: '5',
    nim: '42119012',
    fullName: 'Dewi Lestari',
    email: 'dewi.lestari@student.kkm.ac.id',
    major: 'Teknik Informatika',
    phone: '+62 819-8765-4321',
    yearOfEntry: '2023',
    createdAt: '2025-09-10 13:20:00',
    updatedAt: '2026-01-05 09:45:00',
    avatar: 'https://picsum.photos/seed/dewi/100/100',
    skills: ['Java', 'Spring Boot', 'Flutter', 'Mobile Dev'],
    status: 'active'
  },
  // 15 More Students
  { id: '6', userId: '6', nim: '42119020', fullName: 'Eko Prasetyo', email: 'eko.p@student.kkm.ac.id', major: 'Teknik Mesin', phone: '081234567806', yearOfEntry: '2022', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/eko/100/100', skills: ['AutoCAD', 'SolidWorks'], status: 'active' },
  { id: '7', userId: '7', nim: '42119021', fullName: 'Fina Andini', email: 'fina.a@student.kkm.ac.id', major: 'Akuntansi', phone: '081234567807', yearOfEntry: '2021', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/fina/100/100', skills: ['MYOB', 'Excel Expert', 'Taxation'], status: 'active' },
  { id: '8', userId: '8', nim: '42119022', fullName: 'Gilang Ramadhan', email: 'gilang.r@student.kkm.ac.id', major: 'Teknik Informatika', phone: '081234567808', yearOfEntry: '2023', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/gilang/100/100', skills: ['Cybersecurity', 'Python', 'Ethical Hacking'], status: 'active' },
  { id: '9', userId: '9', nim: '42119023', fullName: 'Haniifah Yulia', email: 'haniifah.y@student.kkm.ac.id', major: 'Sastra Inggris', phone: '081234567809', yearOfEntry: '2022', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/haniifah/100/100', skills: ['Translation', 'Public Speaking', 'Copywriting'], status: 'active' },
  { id: '10', userId: '10', nim: '42119024', fullName: 'Ikhsan Kamil', email: 'ikhsan.k@student.kkm.ac.id', major: 'Manajemen', phone: '081234567810', yearOfEntry: '2021', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/ikhsan/100/100', skills: ['Project Management', 'Leadership', 'Marketing'], status: 'inactive' },
  { id: '11', userId: '11', nim: '42119025', fullName: 'Jessica Milla', email: 'jessica.m@student.kkm.ac.id', major: 'Ilmu Komunikasi', phone: '081234567811', yearOfEntry: '2023', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/jessica/100/100', skills: ['Broadcasting', 'Journalism', 'Social Media'], status: 'active' },
  { id: '12', userId: '12', nim: '42119026', fullName: 'Kevin Sanjaya', email: 'kevin.s@student.kkm.ac.id', major: 'Teknik Sipil', phone: '081234567812', yearOfEntry: '2022', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/kevin/100/100', skills: ['SAP2000', 'Civil 3D', 'Construction Mgmt'], status: 'active' },
  { id: '13', userId: '13', nim: '42119027', fullName: 'Larasati Putri', email: 'larasati.p@student.kkm.ac.id', major: 'Psikologi', phone: '081234567813', yearOfEntry: '2021', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/larasati/100/100', skills: ['HR Management', 'Recruitment', 'Counseling'], status: 'active' },
  { id: '14', userId: '14', nim: '42119028', fullName: 'Muhammad Farhan', email: 'm.farhan@student.kkm.ac.id', major: 'Hukum', phone: '081234567814', yearOfEntry: '2023', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/farhan/100/100', skills: ['Legal Drafting', 'Contract Law', 'Negotiation'], status: 'active' },
  { id: '15', userId: '15', nim: '42119029', fullName: 'Nadia Safitri', email: 'nadia.s@student.kkm.ac.id', major: 'Teknik Informatika', phone: '081234567815', yearOfEntry: '2022', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/nadia/100/100', skills: ['Machine Learning', 'Data Mining', 'Python'], status: 'active' },
  { id: '16', userId: '16', nim: '42119030', fullName: 'Oscar Lawalata', email: 'oscar.l@student.kkm.ac.id', major: 'Desain Interior', phone: '081234567816', yearOfEntry: '2021', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/oscar/100/100', skills: ['SketchUp', '3ds Max', 'Interior Styling'], status: 'inactive' },
  { id: '17', userId: '17', nim: '42119031', fullName: 'Pratiwi Indah', email: 'pratiwi.i@student.kkm.ac.id', major: 'Farmasi', phone: '081234567817', yearOfEntry: '2023', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/pratiwi/100/100', skills: ['Clinical Pharmacy', 'Drug Analysis'], status: 'active' },
  { id: '18', userId: '18', nim: '42119032', fullName: 'Qiano Alif', email: 'qiano.a@student.kkm.ac.id', major: 'Teknik Elektro', phone: '081234567818', yearOfEntry: '2022', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/qiano/100/100', skills: ['Arduino', 'PLC', 'Circuit Design'], status: 'active' },
  { id: '19', userId: '19', nim: '42119033', fullName: 'Rina Nose', email: 'rina.n@student.kkm.ac.id', major: 'Seni Pertunjukan', phone: '081234567819', yearOfEntry: '2021', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/rina/100/100', skills: ['Acting', 'Vocal', 'Directing'], status: 'active' },
  { id: '20', userId: '20', nim: '42119034', fullName: 'Satria Baja', email: 'satria.b@student.kkm.ac.id', major: 'Teknik Industri', phone: '081234567820', yearOfEntry: '2023', createdAt: '2025-08-01', updatedAt: '2025-08-01', avatar: 'https://picsum.photos/seed/satria/100/100', skills: ['Supply Chain', 'Quality Control', 'Six Sigma'], status: 'active' },
];

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Indonesia',
    location: 'Jakarta Selatan (Hybrid)',
    type: 'Internship',
    salary: 'IDR 2.500.000 - 4.000.000',
    description: 'Kami mencari mahasiswa tingkat akhir yang bersemangat dalam pengembangan web frontend menggunakan React.js dan Tailwind CSS. Anda akan bekerja langsung dengan tim engineering kami.',
    requirements: ['Menguasai HTML, CSS, JavaScript', 'Familiar dengan React.js', 'Memahami Git', 'Mahasiswa tingkat akhir'],
    status: 'active',
    postedAt: '2026-01-20',
    expiresAt: '2026-02-28',
    applicantsCount: 3, // Updated count
    logo: 'https://ui-avatars.com/api/?name=TC&background=4F46E5&color=fff&bold=true'
  },
  {
    id: '2',
    title: 'Junior Data Analyst',
    company: 'DataWiz Solutions',
    location: 'Bandung (Remote)',
    type: 'Full-time',
    salary: 'IDR 6.000.000 - 8.000.000',
    description: 'Menganalisis data bisnis untuk memberikan wawasan strategis. Dibuka untuk fresh graduate dengan kemampuan analitis yang kuat.',
    requirements: ['S1 Matematika/Statistika/Informatika', 'Menguasai Python/R', 'Kemampuan SQL yang kuat', 'Komunikatif'],
    status: 'active',
    postedAt: '2026-01-25',
    expiresAt: '2026-03-01',
    applicantsCount: 2,
    logo: 'https://ui-avatars.com/api/?name=DW&background=10B981&color=fff&bold=true'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    company: 'CreativeMinds Agency',
    location: 'Yogyakarta',
    type: 'Contract',
    salary: 'Negotiable',
    description: 'Mencari desainer berbakat untuk proyek aplikasi mobile e-commerce selama 6 bulan.',
    requirements: ['Portofolio desain yang kuat', 'Menguasai Figma', 'Pemahaman tentang User Centered Design', 'Bisa bekerja dalam tim'],
    status: 'closed',
    postedAt: '2025-12-10',
    expiresAt: '2026-01-10',
    applicantsCount: 1,
    logo: 'https://ui-avatars.com/api/?name=CM&background=F59E0B&color=fff&bold=true'
  },
  {
    id: '4',
    title: 'Backend Developer (Golang)',
    company: 'Fintech Secure',
    location: 'Jakarta Pusat',
    type: 'Full-time',
    salary: 'IDR 10.000.000 - 15.000.000',
    description: 'Bergabung dengan tim backend kami untuk membangun sistem pembayaran yang aman dan skalabel.',
    requirements: ['Pengalaman dengan Go/Java', 'Paham Microservices', 'Familiar dengan Docker/Kubernetes', 'Database PostgreSQL'],
    status: 'draft',
    postedAt: '2026-02-01',
    expiresAt: '2026-03-15',
    applicantsCount: 0,
    logo: 'https://ui-avatars.com/api/?name=FS&background=EC4899&color=fff&bold=true'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  { id: '1', jobId: '1', studentId: '1', appliedAt: '2026-01-21', status: 'reviewed', coverLetter: 'I am very interested in this position.' },
  { id: '2', jobId: '1', studentId: '5', appliedAt: '2026-01-22', status: 'pending' },
  { id: '3', jobId: '1', studentId: '8', appliedAt: '2026-01-23', status: 'pending' },
  { id: '4', jobId: '2', studentId: '2', appliedAt: '2026-01-26', status: 'interview' },
  { id: '5', jobId: '2', studentId: '10', appliedAt: '2026-01-27', status: 'pending' },
  { id: '6', jobId: '3', studentId: '4', appliedAt: '2025-12-15', status: 'rejected' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: '1',
    title: 'Python for Data Science Bootcamp',
    instructor: 'DataCamp ID',
    startDate: '2026-03-01',
    endDate: '2026-03-05',
    location: 'Zoom Meeting',
    type: 'Online',
    category: 'Data Science',
    description: 'Intensive 5-day bootcamp covering Python basics, Pandas, NumPy, and Matplotlib. Perfect for beginners wanting to enter the data field.',
    status: 'upcoming',
    participantsCount: 45,
    maxParticipants: 100,
    image: 'https://picsum.photos/seed/python/400/200',
    syllabus: ['Python Basics', 'Data Analysis with Pandas', 'Visualization', 'Final Project']
  },
  {
    id: '2',
    title: 'Professional Soft Skills Workshop',
    instructor: 'HR Professionals Assoc.',
    startDate: '2026-02-15',
    endDate: '2026-02-15',
    location: 'Aula Utama Kampus',
    type: 'Offline',
    category: 'Soft Skills',
    description: 'Learn communication, leadership, and teamwork skills essential for the modern workplace.',
    status: 'active',
    participantsCount: 180,
    maxParticipants: 200,
    image: 'https://picsum.photos/seed/softskills/400/200',
    syllabus: ['Effective Communication', 'Leadership 101', 'Conflict Resolution']
  },
  {
    id: '3',
    title: 'Fullstack Web Development with Laravel',
    instructor: 'Codepolitan',
    startDate: '2025-12-01',
    endDate: '2026-01-30',
    location: 'Hybrid (Lab 3 & Zoom)',
    type: 'Hybrid',
    category: 'Web Development',
    description: 'Comprehensive course building a real e-commerce application using Laravel and React.',
    status: 'completed',
    participantsCount: 30,
    maxParticipants: 30,
    image: 'https://picsum.photos/seed/laravel/400/200',
    syllabus: ['PHP & OOP', 'Laravel MVC', 'React Frontend', 'Deployment']
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'System Maintenance Scheduled',
    content: 'The portal will be undergoing scheduled maintenance this weekend on Saturday from 22:00 to 02:00. Please save your work.',
    category: 'Maintenance',
    status: 'published',
    targetAudience: 'All',
    author: 'IT Department',
    publishDate: '2026-02-01',
    createdAt: '2026-01-28',
    image: 'https://picsum.photos/seed/maintenance/400/200'
  },
  {
    id: '2',
    title: 'Final Semester Exam Schedule',
    content: 'The official schedule for the even semester final exams has been released. Check your dashboard for details.',
    category: 'Academic',
    status: 'published',
    targetAudience: 'Students',
    author: 'Academic Bureau',
    publishDate: '2026-02-05',
    createdAt: '2026-02-01',
    image: 'https://picsum.photos/seed/exam/400/200'
  },
  {
    id: '3',
    title: 'Call for Research Papers 2026',
    content: 'Lecturers are invited to submit their research papers for the upcoming Annual Tech Conference. Deadline is March 15th.',
    category: 'Event',
    status: 'draft',
    targetAudience: 'Lecturers',
    author: 'Research Center',
    publishDate: '2026-02-10',
    createdAt: '2026-02-03',
  }
];

export const COMPETENCY_CHART_DATA: CompetencyData[] = [
  { name: 'Web Dev (Laravel)', value: 35, color: '#4F46E5' },
  { name: 'Data Science', value: 20, color: '#10B981' },
  { name: 'Design UI/UX', value: 25, color: '#F59E0B' },
  { name: 'Mobile Dev', value: 10, color: '#EC4899' },
  { name: 'Networking', value: 10, color: '#8B5CF6' },
];

export const SKILL_GAP_DATA: SkillGapData[] = [
  { skill: 'PHP/Laravel', studentSkill: 80, industryDemand: 65 },
  { skill: 'Python', studentSkill: 45, industryDemand: 75 },
  { skill: 'Figma', studentSkill: 60, industryDemand: 50 },
  { skill: 'Flutter', studentSkill: 30, industryDemand: 50 },
  { skill: 'DevOps', studentSkill: 15, industryDemand: 90 },
];
