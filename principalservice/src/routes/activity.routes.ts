import { Router } from 'express';
import * as ActivityController from '../controllers/activity.controller';

const router = Router();

// Health check
router.get('/health', ActivityController.healthCheck);

// Activity data (read-only - uses sample data)
router.get('/activities', ActivityController.getActivities);

// Summary and analytics
router.get('/summary', ActivityController.getSummary);
router.get('/stats', ActivityController.getStats);

// Trends for charts
router.get('/trends/weekly', ActivityController.getWeeklyTrends);
router.get('/trends/daily', ActivityController.getDailyTrends);

// Teachers
router.get('/teachers', ActivityController.getTeachers);
router.get('/teachers/:teacherId', ActivityController.getTeacherById);

// Filters data
router.get('/subjects', ActivityController.getSubjects);
router.get('/grades', ActivityController.getGrades);

export default router;
