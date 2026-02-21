import express, { Request, Response } from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';

const app = express();
const PORT = process.env.PORT || 3005;

// Database connection
const sql = neon('postgresql://neondb_owner:npg_iTAk2nWhVa4C@ep-patient-cell-aiiefsdc-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require');

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",   // Vite dev
      "http://localhost:3000",   // React dev
    //   "https://your-frontend-domain.onrender.com" // <-- Replace with actual frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.use(express.json());

// Initialize database table with unique constraint to prevent duplicates
async function initializeDatabase() {
    try {
        // Drop old table if exists and recreate with correct schema
        await sql`
            CREATE TABLE IF NOT EXISTS teacher_activities (
                id SERIAL PRIMARY KEY,
                teacher_id VARCHAR(50) NOT NULL,
                teacher_name VARCHAR(100) NOT NULL,
                grade INTEGER NOT NULL,
                subject VARCHAR(100) NOT NULL,
                activity_type VARCHAR(50) NOT NULL CHECK (activity_type IN ('Lesson Plan', 'Quiz', 'Question Paper')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE (teacher_id, grade, subject, activity_type, created_at)
            )
        `;
        
        // Create indexes for faster queries
        await sql`
            CREATE INDEX IF NOT EXISTS idx_teacher_activities_teacher_id 
            ON teacher_activities(teacher_id)
        `;
        
        await sql`
            CREATE INDEX IF NOT EXISTS idx_teacher_activities_created_at 
            ON teacher_activities(created_at)
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_teacher_activities_activity_type 
            ON teacher_activities(activity_type)
        `;
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// ==================== API ENDPOINTS ====================

// Health check
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'principal-admin-portal' });
});

// 1. Add new teacher activity (with duplicate prevention)
app.post('/api/activities', async (req: Request, res: Response) => {
    try {
        const { teacher_id, teacher_name, activity_type, subject, grade, created_at } = req.body;

        // Validate required fields
        if (!teacher_id || !teacher_name || !activity_type || !subject || !grade) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                required: ['teacher_id', 'teacher_name', 'activity_type', 'subject', 'grade']
            });
        }

        // Validate activity_type
        if (!['Lesson Plan', 'Quiz', 'Question Paper'].includes(activity_type)) {
            return res.status(400).json({ 
                error: 'Invalid activity_type. Must be: Lesson Plan, Quiz, or Question Paper' 
            });
        }

        // Check for duplicate entry
        const timestamp = created_at ? new Date(created_at) : new Date();
        const existingEntry = await sql`
            SELECT id FROM teacher_activities 
            WHERE teacher_id = ${teacher_id} 
            AND grade = ${grade} 
            AND subject = ${subject} 
            AND activity_type = ${activity_type} 
            AND created_at = ${timestamp}
        `;

        if (existingEntry.length > 0) {
            return res.status(409).json({ 
                error: 'Duplicate entry: This exact activity already exists' 
            });
        }

        // Insert the new activity
        const result = await sql`
            INSERT INTO teacher_activities (teacher_id, teacher_name, grade, subject, activity_type, created_at)
            VALUES (${teacher_id}, ${teacher_name}, ${grade}, ${subject}, ${activity_type}, ${timestamp})
            RETURNING *
        `;

        res.status(201).json({ 
            message: 'Activity created successfully', 
            activity: result[0] 
        });
    } catch (error: any) {
        console.error('Error creating activity:', error);
        res.status(500).json({ error: 'Failed to create activity', details: error.message });
    }
});

// 2. Get all teacher activities (with optional filters)
app.get('/api/activities', async (req: Request, res: Response) => {
    try {
        const { teacher_id, activity_type, subject, grade, start_date, end_date } = req.query;

        // Build dynamic query based on filters
        let result;
        
        if (teacher_id && activity_type && subject && grade && start_date && end_date) {
            result = await sql`
                SELECT * FROM teacher_activities 
                WHERE teacher_id = ${teacher_id as string}
                AND activity_type = ${activity_type as string}
                AND subject = ${subject as string}
                AND grade = ${parseInt(grade as string)}
                AND created_at >= ${start_date as string}
                AND created_at <= ${end_date as string}
                ORDER BY created_at DESC
            `;
        } else if (teacher_id) {
            result = await sql`
                SELECT * FROM teacher_activities 
                WHERE teacher_id = ${teacher_id as string}
                ORDER BY created_at DESC
            `;
        } else if (activity_type) {
            result = await sql`
                SELECT * FROM teacher_activities 
                WHERE activity_type = ${activity_type as string}
                ORDER BY created_at DESC
            `;
        } else if (subject) {
            result = await sql`
                SELECT * FROM teacher_activities 
                WHERE subject = ${subject as string}
                ORDER BY created_at DESC
            `;
        } else if (grade) {
            result = await sql`
                SELECT * FROM teacher_activities 
                WHERE grade = ${parseInt(grade as string)}
                ORDER BY created_at DESC
            `;
        } else {
            result = await sql`
                SELECT * FROM teacher_activities 
                ORDER BY created_at DESC
            `;
        }

        res.json({ activities: result, count: result.length });
    } catch (error: any) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ error: 'Failed to fetch activities', details: error.message });
    }
});

// 3. Get summary: total lessons, quizzes, and question papers per teacher
app.get('/api/summary', async (req: Request, res: Response) => {
    try {
        const result = await sql`
            SELECT 
                teacher_id,
                teacher_name,
                COUNT(*) FILTER (WHERE activity_type = 'Lesson Plan') as total_lesson_plans,
                COUNT(*) FILTER (WHERE activity_type = 'Quiz') as total_quizzes,
                COUNT(*) FILTER (WHERE activity_type = 'Question Paper') as total_question_papers,
                COUNT(*) as total_activities
            FROM teacher_activities
            GROUP BY teacher_id, teacher_name
            ORDER BY total_activities DESC
        `;

        res.json({ summary: result });
    } catch (error: any) {
        console.error('Error fetching summary:', error);
        res.status(500).json({ error: 'Failed to fetch summary', details: error.message });
    }
});

// 4. Get weekly activity trends (for charts)
app.get('/api/trends/weekly', async (req: Request, res: Response) => {
    try {
        const { teacher_id } = req.query;

        let result;
        if (teacher_id) {
            result = await sql`
                SELECT 
                    DATE_TRUNC('week', created_at) as week_start,
                    activity_type,
                    COUNT(*) as count
                FROM teacher_activities
                WHERE teacher_id = ${teacher_id as string}
                    AND created_at >= CURRENT_DATE - INTERVAL '8 weeks'
                GROUP BY DATE_TRUNC('week', created_at), activity_type
                ORDER BY week_start DESC, activity_type
            `;
        } else {
            result = await sql`
                SELECT 
                    DATE_TRUNC('week', created_at) as week_start,
                    activity_type,
                    COUNT(*) as count
                FROM teacher_activities
                WHERE created_at >= CURRENT_DATE - INTERVAL '8 weeks'
                GROUP BY DATE_TRUNC('week', created_at), activity_type
                ORDER BY week_start DESC, activity_type
            `;
        }

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
});

// 5. Get daily activity trends
app.get('/api/trends/daily', async (req: Request, res: Response) => {
    try {
        const { teacher_id, days = '30' } = req.query;

        let result;
        if (teacher_id) {
            result = await sql`
                SELECT 
                    DATE(created_at) as date,
                    activity_type,
                    COUNT(*) as count
                FROM teacher_activities
                WHERE teacher_id = ${teacher_id as string}
                    AND created_at >= CURRENT_DATE - CAST(${days} AS INTEGER) * INTERVAL '1 day'
                GROUP BY DATE(created_at), activity_type
                ORDER BY date DESC, activity_type
            `;
        } else {
            result = await sql`
                SELECT 
                    DATE(created_at) as date,
                    activity_type,
                    COUNT(*) as count
                FROM teacher_activities
                WHERE created_at >= CURRENT_DATE - CAST(${days} AS INTEGER) * INTERVAL '1 day'
                GROUP BY DATE(created_at), activity_type
                ORDER BY date DESC, activity_type
            `;
        }

        res.json({ trends: result });
    } catch (error: any) {
        console.error('Error fetching daily trends:', error);
        res.status(500).json({ error: 'Failed to fetch daily trends', details: error.message });
    }
});

// 6. Get list of all teachers (for selector/dropdown)
app.get('/api/teachers', async (req: Request, res: Response) => {
    try {
        const result = await sql`
            SELECT DISTINCT teacher_id, teacher_name
            FROM teacher_activities
            ORDER BY teacher_name
        `;

        res.json({ teachers: result });
    } catch (error: any) {
        console.error('Error fetching teachers:', error);
        res.status(500).json({ error: 'Failed to fetch teachers', details: error.message });
    }
});

// 7. Get single teacher analysis (detailed view when clicking on a teacher)
app.get('/api/teachers/:teacherId', async (req: Request, res: Response) => {
    try {
        const teacherId = req.params.teacherId as string;

        // Get teacher info and activity counts
        const teacherSummary = await sql`
            SELECT 
                teacher_id,
                teacher_name,
                COUNT(*) FILTER (WHERE activity_type = 'Lesson Plan') as total_lesson_plans,
                COUNT(*) FILTER (WHERE activity_type = 'Quiz') as total_quizzes,
                COUNT(*) FILTER (WHERE activity_type = 'Question Paper') as total_question_papers,
                COUNT(*) as total_activities,
                MIN(created_at) as first_activity,
                MAX(created_at) as last_activity
            FROM teacher_activities
            WHERE teacher_id = ${teacherId}
            GROUP BY teacher_id, teacher_name
        `;

        if (teacherSummary.length === 0) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Get subject-wise breakdown
        const subjectBreakdown = await sql`
            SELECT 
                subject,
                activity_type,
                COUNT(*) as count
            FROM teacher_activities
            WHERE teacher_id = ${teacherId}
            GROUP BY subject, activity_type
            ORDER BY subject, activity_type
        `;

        // Get grade-wise breakdown
        const gradeBreakdown = await sql`
            SELECT 
                grade,
                activity_type,
                COUNT(*) as count
            FROM teacher_activities
            WHERE teacher_id = ${teacherId}
            GROUP BY grade, activity_type
            ORDER BY grade, activity_type
        `;

        // Get recent activities
        const recentActivities = await sql`
            SELECT *
            FROM teacher_activities
            WHERE teacher_id = ${teacherId}
            ORDER BY created_at DESC
            LIMIT 10
        `;

        // Get weekly trend for this teacher
        const weeklyTrend = await sql`
            SELECT 
                DATE_TRUNC('week', created_at) as week_start,
                activity_type,
                COUNT(*) as count
            FROM teacher_activities
            WHERE teacher_id = ${teacherId}
                AND created_at >= CURRENT_DATE - INTERVAL '8 weeks'
            GROUP BY DATE_TRUNC('week', created_at), activity_type
            ORDER BY week_start DESC
        `;

        res.json({
            teacher: teacherSummary[0],
            subjectBreakdown,
            gradeBreakdown,
            recentActivities,
            weeklyTrend
        });
    } catch (error: any) {
        console.error('Error fetching teacher analysis:', error);
        res.status(500).json({ error: 'Failed to fetch teacher analysis', details: error.message });
    }
});

// 8. Get all subjects (for filter dropdown)
app.get('/api/subjects', async (req: Request, res: Response) => {
    try {
        const result = await sql`
            SELECT DISTINCT subject
            FROM teacher_activities
            ORDER BY subject
        `;

        res.json({ subjects: result.map((r: any) => r.subject) });
    } catch (error: any) {
        console.error('Error fetching subjects:', error);
        res.status(500).json({ error: 'Failed to fetch subjects', details: error.message });
    }
});

// 9. Get all grades (for filter dropdown)
app.get('/api/grades', async (req: Request, res: Response) => {
    try {
        const result = await sql`
            SELECT DISTINCT grade
            FROM teacher_activities
            ORDER BY grade
        `;

        res.json({ grades: result.map((r: any) => r.grade) });
    } catch (error: any) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'Failed to fetch grades', details: error.message });
    }
});

// 10. Get overall statistics for dashboard
app.get('/api/stats', async (req: Request, res: Response) => {
    try {
        const overallStats = await sql`
            SELECT 
                COUNT(DISTINCT teacher_id) as total_teachers,
                COUNT(*) as total_activities,
                COUNT(*) FILTER (WHERE activity_type = 'Lesson Plan') as total_lesson_plans,
                COUNT(*) FILTER (WHERE activity_type = 'Quiz') as total_quizzes,
                COUNT(*) FILTER (WHERE activity_type = 'Question Paper') as total_question_papers,
                COUNT(DISTINCT subject) as total_subjects,
                COUNT(DISTINCT grade) as total_grades
            FROM teacher_activities
        `;

        // Activities this week
        const thisWeekStats = await sql`
            SELECT 
                COUNT(*) as activities_this_week,
                COUNT(*) FILTER (WHERE activity_type = 'Lesson Plan') as lesson_plans_this_week,
                COUNT(*) FILTER (WHERE activity_type = 'Quiz') as quizzes_this_week,
                COUNT(*) FILTER (WHERE activity_type = 'Question Paper') as question_papers_this_week
            FROM teacher_activities
            WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
        `;

        // Most active teachers this week
        const topTeachers = await sql`
            SELECT 
                teacher_id,
                teacher_name,
                COUNT(*) as activity_count
            FROM teacher_activities
            WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
            GROUP BY teacher_id, teacher_name
            ORDER BY activity_count DESC
            LIMIT 5
        `;

        res.json({
            overall: overallStats[0],
            thisWeek: thisWeekStats[0],
            topTeachersThisWeek: topTeachers
        });
    } catch (error: any) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats', details: error.message });
    }
});

// 11. Delete an activity (admin function)
app.delete('/api/activities/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const result = await sql`
            DELETE FROM teacher_activities
            WHERE id = ${parseInt(id)}
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }

        res.json({ message: 'Activity deleted successfully', deleted: result[0] });
    } catch (error: any) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ error: 'Failed to delete activity', details: error.message });
    }
});

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Principal Admin Portal backend running on port ${PORT}`);
        console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
});

export default app;
