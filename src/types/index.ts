export type UserRole = 'admin' | 'guru' | 'siswa';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Student extends User {
  nis: string;
  class: string;
}

export interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  created_by: string;
  created_at: string;
}

export interface Exam {
  id: string;
  title: string;
  duration: number; // in minutes
  created_by: string;
  created_at: string;
  questions?: Question[];
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_id: string;
}

export interface Answer {
  id: string;
  user_id: string;
  exam_id: string;
  question_id: string;
  answer: string;
}

export interface Result {
  id: string;
  user_id: string;
  exam_id: string;
  score: number;
  completed_at: string;
}
