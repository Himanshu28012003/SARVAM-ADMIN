import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iTAk2nWhVa4C@ep-patient-cell-aiiefsdc-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

export const sql = neon(DATABASE_URL);

export async function initializeDatabase() {
    try {
        // Create table with unique constraint to prevent duplicates
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

        // Create admin table for authentication
        await sql`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                admin_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL DEFAULT 'principal' CHECK (role IN ('principal', 'admin')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE INDEX IF NOT EXISTS idx_admins_email 
            ON admins(email)
        `;
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
}
