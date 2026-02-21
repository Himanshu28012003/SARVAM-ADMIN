import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'principal_admin_secret_key_2026';

export interface AuthRequest extends Request {
    admin?: {
        id: number;
        admin_id: string;
        email: string;
        role: string;
    };
}

// Middleware to verify JWT token
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: number;
            admin_id: string;
            email: string;
            role: string;
        };
        
        (req as AuthRequest).admin = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// Middleware to check if user is a principal
export const isPrincipal = (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as AuthRequest).admin;

    if (!admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (admin.role !== 'principal') {
        return res.status(403).json({ error: 'Access denied. Principal role required.' });
    }

    next();
};

// Middleware to check if user is an admin or principal
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as AuthRequest).admin;

    if (!admin) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (admin.role !== 'admin' && admin.role !== 'principal') {
        return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    next();
};
