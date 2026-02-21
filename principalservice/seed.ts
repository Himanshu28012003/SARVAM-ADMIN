import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_iTAk2nWhVa4C@ep-patient-cell-aiiefsdc-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require');

// Demo admin account credentials
const demoAdmin = {
    admin_id: 'PRINCIPAL001',
    name: 'School Principal',
    email: 'principal@school.edu',
    password: 'admin123',
    role: 'principal'
};

// Sample teacher activity data
const sampleData = [
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 10, subject: 'Social Studies', activity_type: 'Quiz', created_at: '2026-02-12 19:07:41' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 7, subject: 'English', activity_type: 'Question Paper', created_at: '2026-02-13 15:31:51' },
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 10, subject: 'Social Studies', activity_type: 'Lesson Plan', created_at: '2026-02-11 19:15:55' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 7, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-17 20:35:33' },
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Question Paper', created_at: '2026-02-15 16:51:32' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Quiz', created_at: '2026-02-14 15:22:29' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: '2026-02-12 12:26:22' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Quiz', created_at: '2026-02-17 09:21:32' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Question Paper', created_at: '2026-02-12 11:38:24' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Question Paper', created_at: '2026-02-17 19:07:47' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-11 17:53:57' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Question Paper', created_at: '2026-02-16 11:26:52' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 7, subject: 'English', activity_type: 'Lesson Plan', created_at: '2026-02-16 15:41:50' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Question Paper', created_at: '2026-02-11 17:54:16' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-17 19:19:56' },
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Quiz', created_at: '2026-02-16 19:12:33' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Question Paper', created_at: '2026-02-13 09:16:06' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Quiz', created_at: '2026-02-15 11:36:03' },
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Lesson Plan', created_at: '2026-02-11 13:06:29' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: '2026-02-15 13:31:42' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Question Paper', created_at: '2026-02-16 11:44:31' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-18 18:45:43' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Question Paper', created_at: '2026-02-12 19:19:44' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Quiz', created_at: '2026-02-14 13:57:07' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Question Paper', created_at: '2026-02-12 18:01:59' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 7, subject: 'Mathematics', activity_type: 'Question Paper', created_at: '2026-02-14 10:36:09' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-18 16:32:47' },
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 10, subject: 'Social Studies', activity_type: 'Quiz', created_at: '2026-02-15 15:59:00' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Lesson Plan', created_at: '2026-02-15 13:31:36' },
    { teacher_id: 'T004', teacher_name: 'Vikas Nair', grade: 9, subject: 'Social Studies', activity_type: 'Lesson Plan', created_at: '2026-02-15 16:32:23' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Question Paper', created_at: '2026-02-18 09:12:05' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 9, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-18 16:26:04' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 9, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-16 17:14:47' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Question Paper', created_at: '2026-02-12 17:47:58' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: '2026-02-18 14:05:20' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Quiz', created_at: '2026-02-14 09:54:01' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Lesson Plan', created_at: '2026-02-12 18:27:09' },
    { teacher_id: 'T001', teacher_name: 'Anita Sharma', grade: 8, subject: 'Mathematics', activity_type: 'Quiz', created_at: '2026-02-14 15:43:38' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 8, subject: 'Science', activity_type: 'Lesson Plan', created_at: '2026-02-18 15:48:08' },
    { teacher_id: 'T002', teacher_name: 'Rahul Verma', grade: 9, subject: 'Science', activity_type: 'Lesson Plan', created_at: '2026-02-16 13:31:34' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Lesson Plan', created_at: '2026-02-14 19:49:54' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 10, subject: 'Mathematics', activity_type: 'Quiz', created_at: '2026-02-14 11:55:18' },
    { teacher_id: 'T003', teacher_name: 'Pooja Mehta', grade: 6, subject: 'English', activity_type: 'Lesson Plan', created_at: '2026-02-16 15:33:27' },
    { teacher_id: 'T005', teacher_name: 'Neha Kapoor', grade: 9, subject: 'Mathematics', activity_type: 'Lesson Plan', created_at: '2026-02-18 11:51:37' },
];

async function seedDatabase() {
    console.log('Starting database seeding...\n');

    try {
        // Drop existing table and recreate
        console.log('Dropping existing table if exists...');
        await sql`DROP TABLE IF EXISTS teacher_activities CASCADE`;

        console.log('Creating new table...');
        await sql`
            CREATE TABLE teacher_activities (
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

        // Create indexes
        console.log('Creating indexes...');
        await sql`CREATE INDEX idx_teacher_activities_teacher_id ON teacher_activities(teacher_id)`;
        await sql`CREATE INDEX idx_teacher_activities_created_at ON teacher_activities(created_at)`;
        await sql`CREATE INDEX idx_teacher_activities_activity_type ON teacher_activities(activity_type)`;

        console.log('Inserting sample data...\n');

        let insertedCount = 0;
        let skippedCount = 0;

        for (const data of sampleData) {
            try {
                await sql`
                    INSERT INTO teacher_activities (teacher_id, teacher_name, grade, subject, activity_type, created_at)
                    VALUES (${data.teacher_id}, ${data.teacher_name}, ${data.grade}, ${data.subject}, ${data.activity_type}, ${data.created_at})
                `;
                insertedCount++;
                console.log(`✓ Inserted: ${data.teacher_name} - ${data.activity_type} (${data.subject}, Grade ${data.grade})`);
            } catch (error: any) {
                if (error.message.includes('duplicate') || error.message.includes('unique')) {
                    skippedCount++;
                    console.log(`⚠ Skipped duplicate: ${data.teacher_name} - ${data.activity_type}`);
                } else {
                    console.error(`✗ Error inserting: ${data.teacher_name}`, error.message);
                }
            }
        }

        console.log('\n--- Seeding Complete ---');
        console.log(`Total records: ${sampleData.length}`);
        console.log(`Inserted: ${insertedCount}`);
        console.log(`Skipped (duplicates): ${skippedCount}`);

        // Verify data
        const count = await sql`SELECT COUNT(*) as total FROM teacher_activities`;
        console.log(`\nVerification: ${count[0].total} records in database`);

        // Show summary
        const summary = await sql`
            SELECT teacher_id, teacher_name, COUNT(*) as activities
            FROM teacher_activities
            GROUP BY teacher_id, teacher_name
            ORDER BY activities DESC
        `;

        console.log('\n--- Teacher Summary ---');
        summary.forEach((teacher: any) => {
            console.log(`${teacher.teacher_id}: ${teacher.teacher_name} - ${teacher.activities} activities`);
        });

        // Create admins table and seed demo admin
        console.log('\n--- Setting up Admin Account ---');
        
        await sql`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                admin_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'principal' CHECK (role IN ('principal', 'admin')),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('✓ Admins table created/verified');

        // Check if demo admin exists
        const existingAdmin = await sql`SELECT id FROM admins WHERE email = ${demoAdmin.email}`;
        
        if (existingAdmin.length === 0) {
            // Hash password and insert demo admin
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(demoAdmin.password, saltRounds);
            
            await sql`
                INSERT INTO admins (admin_id, name, email, password, role)
                VALUES (${demoAdmin.admin_id}, ${demoAdmin.name}, ${demoAdmin.email}, ${hashedPassword}, ${demoAdmin.role})
            `;
            console.log(`✓ Demo admin created: ${demoAdmin.email} / ${demoAdmin.password}`);
        } else {
            console.log(`⚠ Demo admin already exists: ${demoAdmin.email}`);
        }

    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }

    console.log('\n✓ Database seeding completed successfully!');
    process.exit(0);
}

seedDatabase();
