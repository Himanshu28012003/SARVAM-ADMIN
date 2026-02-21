export interface Admin {
    id?: number;
    admin_id: string;
    name: string;
    email: string;
    password: string;
    role: 'principal' | 'admin';
    created_at?: Date;
    updated_at?: Date;
}

export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminRegisterRequest {
    admin_id: string;
    name: string;
    email: string;
    password: string;
    role?: 'principal' | 'admin';
}

export interface AdminResponse {
    id: number;
    admin_id: string;
    name: string;
    email: string;
    role: string;
    created_at: Date;
}

export interface AuthToken {
    token: string;
    admin: AdminResponse;
}
