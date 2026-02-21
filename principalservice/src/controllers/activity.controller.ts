import { Request, Response } from 'express';
import * as ActivityModel from '../models/teacherActivity.model';

// Health check
export const healthCheck = (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'principal-admin-portal' });
};

// Get all activities (using sample data)
export const getActivities = async (req: Request, res: Response) => {
    try {
        const { teacher_id, activity_type, subject, grade, start_date, end_date } = req.query;

        const activities = await ActivityModel.getActivities({
            teacher_id: teacher_id as string,
            activity_type: activity_type as string,
            subject: subject as string,
            grade: grade ? parseInt(grade as string) : undefined,
            start_date: start_date as string,
            end_date: end_date as string
        });

        res.json({ activities, count: activities.length });
    } catch (error: any) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
    }
};

// Get summary per teacher
export const getSummary = async (req: Request, res: Response) => {
    try {
        const summary = await ActivityModel.getTeacherSummary();
        res.json({ summary });
    } catch (error: any) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary', details: error.message });
    }
};

// Get weekly trends
export const getWeeklyTrends = async (req: Request, res: Response) => {
    try {
        const { teacher_id } = req.query;
        const result = await ActivityModel.getWeeklyTrends(teacher_id as string);

        // Transform data for chart-friendly format
        const weeklyData: { [key: string]: { week: string; lesson_plans: number; quizzes: number; question_papers: number } } = {};
        
        result.forEach((row: any) => {
            const weekKey = new Date(row.week_start).toISOString().split('T')[0];
            if (!weeklyData[weekKey]) {
                weeklyData[weekKey] = { week: weekKey, lesson_plans: 0, quizzes: 0, question_papers: 0 };
            }
            if (row.activity_type === 'Lesson Plan') weeklyData[weekKey].lesson_plans = Number(row.count);
            if (row.activity_type === 'Quiz') weeklyData[weekKey].quizzes = Number(row.count);
            if (row.activity_type === 'Question Paper') weeklyData[weekKey].question_papers = Number(row.count);
        });

        res.json({ trends: Object.values(weeklyData).sort((a, b) => a.week.localeCompare(b.week)) });
    } catch (error: any) {
        console.error('Error fetching weekly trends:', error);
        res.status(500).json({ error: 'Failed to fetch weekly trends', details: error.message });
    }
};

// Get daily trends
export const getDailyTrends = async (req: Request, res: Response) => {
    try {
        const { teacher_id, days = '30' } = req.query;
        const trends = await ActivityModel.getDailyTrends(
            teacher_id as string, 
            parseInt(days as string)
        );
        res.json({ trends });
    } catch (error: any) {
        console.error('Error fetching daily trends:', error);
        res.status(500).json({ error: 'Failed to fetch daily trends', details: error.message });
    }
};

// Get all teachers
export const getTeachers = async (req: Request, res: Response) => {
    try {
        const teachers = await ActivityModel.getAllTeachers();
        res.json({ teachers });
    } catch (error: any) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Failed to fetch teachers', details: error.message });
    }
};

// Get single teacher details
export const getTeacherById = async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.teacherId as string;
        const teacherData = await ActivityModel.getTeacherById(teacherId);

        if (!teacherData) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        res.json(teacherData);
    } catch (error: any) {
        console.error('Error fetching teacher analysis:', error);
        res.status(500).json({ error: 'Failed to fetch teacher analysis', details: error.message });
    }
};

// Get all subjects
export const getSubjects = async (req: Request, res: Response) => {
    try {
        const subjects = await ActivityModel.getAllSubjects();
        res.json({ subjects });
    } catch (error: any) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects', details: error.message });
    }
};

// Get all grades
export const getGrades = async (req: Request, res: Response) => {
    try {
        const grades = await ActivityModel.getAllGrades();
        res.json({ grades });
    } catch (error: any) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to fetch grades', details: error.message });
    }
};

// Get overall stats
export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await ActivityModel.getOverallStats();
        res.json(stats);
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
};
