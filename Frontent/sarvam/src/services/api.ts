import axios from 'axios';
import type { TeacherActivity, TeacherSummary, TeacherDetail, OverallStats, WeeklyTrend, DailyTrend } from '../types';

const API_BASE_URL = 'https://sarvam-admin.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Activities
export const getActivities = async (filters?: {
  teacher_id?: string;
  grade?: number;
  subject?: string;
  start_date?: string;
  end_date?: string;
}): Promise<{ activities: TeacherActivity[]; count: number }> => {
  const params = new URLSearchParams();
  if (filters?.teacher_id) params.append('teacher_id', filters.teacher_id);
  if (filters?.grade) params.append('grade', filters.grade.toString());
  if (filters?.subject) params.append('subject', filters.subject);
  if (filters?.start_date) params.append('start_date', filters.start_date);
  if (filters?.end_date) params.append('end_date', filters.end_date);

  const response = await api.get(`/activities?${params.toString()}`);
  return response.data;
};

// Summary
export const getSummary = async (): Promise<{ summary: TeacherSummary[] }> => {
  const response = await api.get('/summary');
  return response.data;
};

// Overall Stats
export const getStats = async (): Promise<OverallStats> => {
  const response = await api.get('/stats');
  return response.data;
};

// Teachers
export const getTeachers = async (): Promise<{ teachers: Array<{ teacher_id: string; teacher_name: string }> }> => {
  const response = await api.get('/teachers');
  return response.data;
};

// Teacher by ID
export const getTeacherById = async (teacherId: string): Promise<TeacherDetail> => {
  const response = await api.get(`/teachers/${teacherId}`);
  return response.data;
};

// Weekly Trends
export const getWeeklyTrends = async (teacherId?: string): Promise<{ trends: WeeklyTrend[] }> => {
  const params = teacherId ? `?teacher_id=${teacherId}` : '';
  const response = await api.get(`/trends/weekly${params}`);
  return response.data;
};

// Daily Trends
export const getDailyTrends = async (teacherId?: string, days?: number): Promise<{ trends: DailyTrend[] }> => {
  const params = new URLSearchParams();
  if (teacherId) params.append('teacher_id', teacherId);
  if (days) params.append('days', days.toString());
  const response = await api.get(`/trends/daily?${params.toString()}`);
  return response.data;
};

// Subjects
export const getSubjects = async (): Promise<{ subjects: string[] }> => {
  const response = await api.get('/subjects');
  return response.data;
};

// Grades
export const getGrades = async (): Promise<{ grades: number[] }> => {
  const response = await api.get('/grades');
  return response.data;
};

export default api;
