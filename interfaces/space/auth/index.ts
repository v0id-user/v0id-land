export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    name: string;
    gpgSignature: string;
    password: string;
}

export interface AuthSuccessResponse {
    success: true;
    data: {
        email: string;
    };
}

export interface AuthErrorResponse {
    success: false;
    error: {
        code: string;
        message: string;
    };
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;
