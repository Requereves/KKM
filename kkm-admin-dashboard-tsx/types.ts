
export interface StudentVerification {
  id: string;
  studentId: string;
  name: string;
  nim: string;
  documentTitle: string;
  description: string;
  filePath: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  verifiedAt?: string;
  createdAt: string;
}

export interface CompetencyData {
  name: string;
  value: number;
  color: string;
}

export interface SkillGapData {
  skill: string;
  studentSkill: number;
  industryDemand: number;
}

export interface Student {
  id: string;
  userId: string;
  nim: string;
  fullName: string;
  email: string;
  major: string;
  phone: string;
  yearOfEntry: string;
  createdAt: string;
  updatedAt: string;
  avatar: string;
  skills: string[]; // Joined from student_skills table
  status: 'active' | 'inactive'; // For UI display
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Internship' | 'Part-time' | 'Contract';
  salary: string;
  description: string;
  requirements: string[];
  status: 'active' | 'closed' | 'draft';
  postedAt: string;
  expiresAt: string;
  applicantsCount: number;
  logo: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  studentId: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'interview' | 'rejected' | 'accepted';
  coverLetter?: string;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  startDate: string;
  endDate: string;
  location: string;
  type: 'Online' | 'Offline' | 'Hybrid';
  category: string;
  description: string;
  status: 'upcoming' | 'active' | 'completed';
  participantsCount: number;
  maxParticipants: number;
  image: string;
  syllabus: string[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'News' | 'Event' | 'Academic' | 'Maintenance';
  status: 'published' | 'draft' | 'archived';
  targetAudience: 'All' | 'Students' | 'Lecturers';
  author: string;
  publishDate: string;
  createdAt: string;
  image?: string;
}
