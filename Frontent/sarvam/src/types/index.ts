export interface TeacherActivity {
  id: number;
  teacher_id: string;
  teacher_name: string;
  grade: number;
  subject: string;
  activity_type: 'Lesson Plan' | 'Quiz' | 'Question Paper';
  created_at: string;
}

export interface TeacherSummary {
  teacher_id: string;
  teacher_name: string;
  total_lesson_plans: number;
  total_quizzes: number;
  total_question_papers: number;
  total_activities: number;
}

export interface TeacherDetail {
  teacher: {
    teacher_id: string;
    teacher_name: string;
    total_lesson_plans: number;
    total_quizzes: number;
    total_question_papers: number;
    total_activities: number;
    first_activity: string;
    last_activity: string;
  };
  subjectBreakdown: Array<{
    subject: string;
    activity_type: string;
    count: number;
  }>;
  gradeBreakdown: Array<{
    grade: number;
    activity_type: string;
    count: number;
  }>;
  recentActivities: TeacherActivity[];
  weeklyTrend: Array<{
    week_start: string;
    activity_type: string;
    count: number;
  }>;
}

export interface OverallStats {
  overall: {
    total_teachers: number;
    total_activities: number;
    total_lesson_plans: number;
    total_quizzes: number;
    total_question_papers: number;
    total_subjects: number;
    total_grades: number;
  };
  thisWeek: {
    activities_this_week: number;
    lesson_plans_this_week: number;
    quizzes_this_week: number;
    question_papers_this_week: number;
  };
  topTeachersThisWeek: Array<{
    teacher_id: string;
    teacher_name: string;
    activity_count: number;
  }>;
}

export interface WeeklyTrend {
  week: string;
  lesson_plans: number;
  quizzes: number;
  question_papers: number;
}

export interface DailyTrend {
  date: string;
  activity_type: string;
  count: number;
}

export type TimeFilter = 'week' | 'month' | 'year';
