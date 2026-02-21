import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '../db/connection';
import { AdminLoginRequest, AdminRegisterRequest, AdminResponse, AuthToken } from '../models/admin.model';

const JWT_SECRET = process.env.JWT_SECRET || 'principal_admin_secret_key_2026';
const JWT_EXPIRES_IN = 60 * 60 * 24; // 24 hours in seconds

// Register a new admin
export const register = async (req: Request, res: Response) => {
    try {
        const { admin_id, name, email, password, role = 'principal' }: AdminRegisterRequest = req.body;

        // Validate required fields
        if (!admin_id || !name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required: admin_id, name, email, password' });
        }

        // Check if admin already exists
        const existingAdmin = await sql`
            SELECT id FROM admins WHERE email = ${email} OR admin_id = ${admin_id}
        `;

        if (existingAdmin.length > 0) {
            return res.status(409).json({ error: 'Admin with this email or admin_id already exists' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new admin
        const result = await sql`
            INSERT INTO admins (admin_id, name, email, password, role)
            VALUES (${admin_id}, ${name}, ${email}, ${hashedPassword}, ${role})
            RETURNING id, admin_id, name, email, role, created_at
        `;

        const admin: AdminResponse = result[0] as AdminResponse;

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, admin_id: admin.admin_id, email: admin.email, role: admin.role },
            JWT_SECRET as jwt.Secret,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const response: AuthToken = { token, admin };
        res.status(201).json(response);
    } catch (error) {
        console.error('Error registering admin:', error);
        res.status(500).json({ error: 'Failed to register admin' });
    }
};

// Login admin
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: AdminLoginRequest = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find admin by email
        const result = await sql`
            SELECT id, admin_id, name, email, password, role, created_at
            FROM admins WHERE email = ${email}
        `;

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const admin = result[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: admin.id, admin_id: admin.admin_id, email: admin.email, role: admin.role },
            JWT_SECRET as jwt.Secret,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const adminResponse: AdminResponse = {
            id: admin.id,
            admin_id: admin.admin_id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
            created_at: admin.created_at
        };

        const response: AuthToken = { token, admin: adminResponse };
        res.status(200).json(response);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

// Get current admin profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).admin?.id;

        if (!adminId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await sql`
            SELECT id, admin_id, name, email, role, created_at, updated_at
            FROM admins WHERE id = ${adminId}
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// Update admin profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).admin?.id;
        const { name, email } = req.body;

        if (!adminId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await sql`
            UPDATE admins 
            SET name = COALESCE(${name}, name), 
                email = COALESCE(${email}, email),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ${adminId}
            RETURNING id, admin_id, name, email, role, created_at, updated_at
        `;

        if (result.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        res.status(200).json(result[0]);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

// Change password
export const changePassword = async (req: Request, res: Response) => {
    try {
        const adminId = (req as any).admin?.id;
        const { currentPassword, newPassword } = req.body;

        if (!adminId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current password and new password are required' });
        }

        // Get current admin
        const adminResult = await sql`
            SELECT password FROM admins WHERE id = ${adminId}
        `;

        if (adminResult.length === 0) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, adminResult[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await sql`
            UPDATE admins 
            SET password = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${adminId}
        `;

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

// Get all admins (only for principals)
export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const adminRole = (req as any).admin?.role;

        if (adminRole !== 'principal') {
            return res.status(403).json({ error: 'Access denied. Principal role required.' });
        }

        const result = await sql`
            SELECT id, admin_id, name, email, role, created_at, updated_at
            FROM admins
            ORDER BY created_at DESC
        `;

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
};
