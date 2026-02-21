// Using sample data instead of database queries

export interface TeacherActivity {
    id?: number;
    teacher_id: string;
    teacher_name: string;
    grade: number;
    subject: string;
    activity_type: 'Lesson Plan' | 'Quiz' | 'Question Paper';
    created_at?: Date;
}

export interface ActivityFilters {
    teacher_id?: string;
    activity_type?: string;
    subject?: string;
    grade?: number;
    start_date?: string;
    end_date?: string;
}

// Sample teacher activity data
const sampleData: TeacherActivity[] = [
    { id: 1, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 10, subject: 'Social Studies', activity_type: 'Quiz', created_at: new Date('2026-02-12 19:07:41') },
    { id: 2, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 7, subject: 'English', activity_type: 'Question Paper', created_at: new Date('2026-02-13 15:31:51') },
    { id: 3, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 10, subject: 'Social Studies', activity_type: 'Lesson Plan', created_at: new Date('2026-02-11 19:15:55') },
    { id: 4, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 7, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-17 20:35:33') },
    { id: 5, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Question Paper', created_at: new Date('2026-02-15 16:51:32') },
    { id: 6, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Quiz', created_at: new Date('2026-02-14 15:22:29') },
    { id: 7, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: new Date('2026-02-12 12:26:22') },
    { id: 8, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Quiz', created_at: new Date('2026-02-17 09:21:32') },
    { id: 9, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Question Paper', created_at: new Date('2026-02-12 11:38:24') },
    { id: 10, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Question Paper', created_at: new Date('2026-02-17 19:07:47') },
    { id: 11, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-11 17:53:57') },
    { id: 12, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Question Paper', created_at: new Date('2026-02-16 11:26:52') },
    { id: 13, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 7, subject: 'English', activity_type: 'Lesson Plan', created_at: new Date('2026-02-16 15:41:50') },
    { id: 14, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Question Paper', created_at: new Date('2026-02-11 17:54:16') },
    { id: 15, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-17 19:19:56') },
    { id: 16, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Quiz', created_at: new Date('2026-02-16 19:12:33') },
    { id: 17, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Question Paper', created_at: new Date('2026-02-13 09:16:06') },
    { id: 18, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Quiz', created_at: new Date('2026-02-15 11:36:03') },
    { id: 19, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Lesson Plan', created_at: new Date('2026-02-11 13:06:29') },
    { id: 20, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: new Date('2026-02-15 13:31:42') },
    { id: 21, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Question Paper', created_at: new Date('2026-02-16 11:44:31') },
    { id: 22, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-18 18:45:43') },
    { id: 23, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Question Paper', created_at: new Date('2026-02-12 19:19:44') },
    { id: 24, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Quiz', created_at: new Date('2026-02-14 13:57:07') },
    { id: 25, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Question Paper', created_at: new Date('2026-02-12 18:01:59') },
    { id: 26, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 7, subject: 'Mathematics', activity_type: 'Question Paper', created_at: new Date('2026-02-14 10:36:09') },
    { id: 27, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-18 16:32:47') },
    { id: 28, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 10, subject: 'Social Studies', activity_type: 'Quiz', created_at: new Date('2026-02-15 15:59:00') },
    { id: 29, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Lesson Plan', created_at: new Date('2026-02-15 13:31:36') },
    { id: 30, teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Lesson Plan', created_at: new Date('2026-02-15 16:32:23') },
    { id: 31, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Question Paper', created_at: new Date('2026-02-18 09:12:05') },
    { id: 32, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 9, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-18 16:26:04') },
    { id: 33, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 9, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-16 17:14:47') },
    { id: 34, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Question Paper', created_at: new Date('2026-02-12 17:47:58') },
    { id: 35, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: new Date('2026-02-18 14:05:20') },
    { id: 36, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Quiz', created_at: new Date('2026-02-14 09:54:01') },
    { id: 37, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Lesson Plan', created_at: new Date('2026-02-12 18:27:09') },
    { id: 38, teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Quiz', created_at: new Date('2026-02-14 15:43:38') },
    { id: 39, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Lesson Plan', created_at: new Date('2026-02-18 15:48:08') },
    { id: 40, teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Lesson Plan', created_at: new Date('2026-02-16 13:31:34') },
    { id: 41, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Lesson Plan', created_at: new Date('2026-02-14 19:49:54') },
    { id: 42, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: new Date('2026-02-14 11:55:18') },
    { id: 43, teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Lesson Plan', created_at: new Date('2026-02-16 15:33:27') },
    { id: 44, teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 9, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: new Date('2026-02-18 11:51:37') },
];

// Get all activities with optional filters
export async function getActivities(filters: ActivityFilters = {}) {
    const { teacher_id, activity_type, subject, grade, start_date, end_date } = filters;
    
    let filtered = [...sampleData];
    
    if (teacher_id) {
        filtered = filtered.filter(a => a.teacher_id === teacher_id);
    }
    if (activity_type) {
        filtered = filtered.filter(a => a.activity_type === activity_type);
    }
    if (subject) {
        filtered = filtered.filter(a => a.subject === subject);
    }
    if (grade) {
        filtered = filtered.filter(a => a.grade === grade);
    }
    if (start_date) {
        const startDate = new Date(start_date);
        filtered = filtered.filter(a => a.created_at && a.created_at >= startDate);
    }
    if (end_date) {
        const endDate = new Date(end_date);
        filtered = filtered.filter(a => a.created_at && a.created_at <= endDate);
    }
    
    // Sort by created_at descending
    return filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
    });
}

// Get summary per teacher
export async function getTeacherSummary() {
    const teacherMap = new Map<string, { teacher_id: string; teacher_name: string; total_lesson_plans: number; total_quizzes: number; total_question_papers: number; total_activities: number }>();
    
    sampleData.forEach(activity => {
        if (!teacherMap.has(activity.teacher_id)) {
            teacherMap.set(activity.teacher_id, {
                teacher_id: activity.teacher_id,
                teacher_name: activity.teacher_name,
                total_lesson_plans: 0,
                total_quizzes: 0,
                total_question_papers: 0,
                total_activities: 0
            });
        }
        const teacher = teacherMap.get(activity.teacher_id)!;
        teacher.total_activities++;
        if (activity.activity_type === 'Lesson Plan') teacher.total_lesson_plans++;
        if (activity.activity_type === 'Quiz') teacher.total_quizzes++;
        if (activity.activity_type === 'Question Paper') teacher.total_question_papers++;
    });
    
    return Array.from(teacherMap.values()).sort((a, b) => b.total_activities - a.total_activities);
}

// Get weekly trends
export async function getWeeklyTrends(teacher_id?: string) {
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
    
    let filtered = sampleData.filter(a => a.created_at && a.created_at >= eightWeeksAgo);
    if (teacher_id) {
        filtered = filtered.filter(a => a.teacher_id === teacher_id);
    }
    
    const weekMap = new Map<string, { week_start: Date; activity_type: string; count: number }>();
    
    filtered.forEach(activity => {
        const weekStart = getWeekStart(activity.created_at!);
        const key = `${weekStart.toISOString()}_${activity.activity_type}`;
        if (!weekMap.has(key)) {
            weekMap.set(key, { week_start: weekStart, activity_type: activity.activity_type, count: 0 });
        }
        weekMap.get(key)!.count++;
    });
    
    return Array.from(weekMap.values()).sort((a, b) => b.week_start.getTime() - a.week_start.getTime());
}

function getWeekStart(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Get daily trends
export async function getDailyTrends(teacher_id?: string, days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    let filtered = sampleData.filter(a => a.created_at && a.created_at >= cutoffDate);
    if (teacher_id) {
        filtered = filtered.filter(a => a.teacher_id === teacher_id);
    }
    
    const dayMap = new Map<string, { date: string; activity_type: string; count: number }>();
    
    filtered.forEach(activity => {
        const dateStr = activity.created_at!.toISOString().split('T')[0];
        const key = `${dateStr}_${activity.activity_type}`;
        if (!dayMap.has(key)) {
            dayMap.set(key, { date: dateStr, activity_type: activity.activity_type, count: 0 });
        }
        dayMap.get(key)!.count++;
    });
    
    return Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));
}

// Get all teachers
export async function getAllTeachers() {
    const teacherMap = new Map<string, { teacher_id: string; teacher_name: string }>();
    sampleData.forEach(activity => {
        if (!teacherMap.has(activity.teacher_id)) {
            teacherMap.set(activity.teacher_id, {
                teacher_id: activity.teacher_id,
                teacher_name: activity.teacher_name
            });
        }
    });
    return Array.from(teacherMap.values()).sort((a, b) => a.teacher_name.localeCompare(b.teacher_name));
}

// Get single teacher details
export async function getTeacherById(teacherId: string) {
    const teacherActivities = sampleData.filter(a => a.teacher_id === teacherId);
    
    if (teacherActivities.length === 0) {
        return null;
    }
    
    const teacher = {
        teacher_id: teacherId,
        teacher_name: teacherActivities[0].teacher_name,
        total_lesson_plans: teacherActivities.filter(a => a.activity_type === 'Lesson Plan').length,
        total_quizzes: teacherActivities.filter(a => a.activity_type === 'Quiz').length,
        total_question_papers: teacherActivities.filter(a => a.activity_type === 'Question Paper').length,
        total_activities: teacherActivities.length,
        first_activity: teacherActivities.reduce((min, a) => a.created_at && a.created_at < min ? a.created_at : min, teacherActivities[0].created_at!),
        last_activity: teacherActivities.reduce((max, a) => a.created_at && a.created_at > max ? a.created_at : max, teacherActivities[0].created_at!)
    };
    
    // Subject breakdown
    const subjectMap = new Map<string, { subject: string; activity_type: string; count: number }>();
    teacherActivities.forEach(activity => {
        const key = `${activity.subject}_${activity.activity_type}`;
        if (!subjectMap.has(key)) {
            subjectMap.set(key, { subject: activity.subject, activity_type: activity.activity_type, count: 0 });
        }
        subjectMap.get(key)!.count++;
    });
    const subjectBreakdown = Array.from(subjectMap.values()).sort((a, b) => a.subject.localeCompare(b.subject));
    
    // Grade breakdown
    const gradeMap = new Map<string, { grade: number; activity_type: string; count: number }>();
    teacherActivities.forEach(activity => {
        const key = `${activity.grade}_${activity.activity_type}`;
        if (!gradeMap.has(key)) {
            gradeMap.set(key, { grade: activity.grade, activity_type: activity.activity_type, count: 0 });
        }
        gradeMap.get(key)!.count++;
    });
    const gradeBreakdown = Array.from(gradeMap.values()).sort((a, b) => a.grade - b.grade);
    
    // Recent activities
    const recentActivities = [...teacherActivities]
        .sort((a, b) => (b.created_at?.getTime() || 0) - (a.created_at?.getTime() || 0))
        .slice(0, 10);
    
    // Weekly trend
    const weeklyTrend = await getWeeklyTrends(teacherId);
    
    return {
        teacher,
        subjectBreakdown,
        gradeBreakdown,
        recentActivities,
        weeklyTrend
    };
}

// Get all subjects
export async function getAllSubjects() {
    const subjects = new Set<string>();
    sampleData.forEach(a => subjects.add(a.subject));
    return Array.from(subjects).sort();
}

// Get all grades
export async function getAllGrades() {
    const grades = new Set<number>();
    sampleData.forEach(a => grades.add(a.grade));
    return Array.from(grades).sort((a, b) => a - b);
}

// Get overall stats
export async function getOverallStats() {
    const teachers = new Set<string>();
    const subjects = new Set<string>();
    const grades = new Set<number>();
    let lessonPlans = 0, quizzes = 0, questionPapers = 0;
    
    sampleData.forEach(activity => {
        teachers.add(activity.teacher_id);
        subjects.add(activity.subject);
        grades.add(activity.grade);
        if (activity.activity_type === 'Lesson Plan') lessonPlans++;
        if (activity.activity_type === 'Quiz') quizzes++;
        if (activity.activity_type === 'Question Paper') questionPapers++;
    });
    
    const weekStart = getWeekStart(new Date());
    const thisWeekActivities = sampleData.filter(a => a.created_at && a.created_at >= weekStart);
    
    const thisWeekLessonPlans = thisWeekActivities.filter(a => a.activity_type === 'Lesson Plan').length;
    const thisWeekQuizzes = thisWeekActivities.filter(a => a.activity_type === 'Quiz').length;
    const thisWeekQuestionPapers = thisWeekActivities.filter(a => a.activity_type === 'Question Paper').length;
    
    // Top teachers this week
    const teacherCounts = new Map<string, { teacher_id: string; teacher_name: string; activity_count: number }>();
    thisWeekActivities.forEach(activity => {
        if (!teacherCounts.has(activity.teacher_id)) {
            teacherCounts.set(activity.teacher_id, { teacher_id: activity.teacher_id, teacher_name: activity.teacher_name, activity_count: 0 });
        }
        teacherCounts.get(activity.teacher_id)!.activity_count++;
    });
    
    const topTeachers = Array.from(teacherCounts.values())
        .sort((a, b) => b.activity_count - a.activity_count)
        .slice(0, 5);
    
    return {
        overall: {
            total_teachers: teachers.size,
            total_activities: sampleData.length,
            total_lesson_plans: lessonPlans,
            total_quizzes: quizzes,
            total_question_papers: questionPapers,
            total_subjects: subjects.size,
            total_grades: grades.size
        },
        thisWeek: {
            activities_this_week: thisWeekActivities.length,
            lesson_plans_this_week: thisWeekLessonPlans,
            quizzes_this_week: thisWeekQuizzes,
            question_papers_this_week: thisWeekQuestionPapers
        },
        topTeachersThisWeek: topTeachers
    };
}
