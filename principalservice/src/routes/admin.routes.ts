import { Router } from 'express';
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    getAllAdmins
} from '../controllers/admin.controller';
import { authenticateToken, isPrincipal } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// Principal-only routes
router.get('/all', authenticateToken, isPrincipal, getAllAdmins);

export default router;
