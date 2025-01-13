/*
Organizing error codes and messages is the best way to handle errors in any backend application. 
This approach ensures:
* Clear categorization by error code.
* Easy extension and maintenance.
* Simplified translation of error messages into different languages.

This design improves scalability and internationalization while keeping the codebase clean.

#V0ID - tips ;)
*/

export enum AuthErrorCode {
    // Validation Errors
    INVALID_EMAIL = 'INVALID_EMAIL',
    INVALID_PASSWORD = 'INVALID_PASSWORD',
    INVALID_NAME = 'INVALID_NAME',
    INVALID_GPG_SIGNATURE = 'INVALID_GPG_SIGNATURE',
    
    // Authentication Errors
    EMAIL_IN_USE = 'EMAIL_IN_USE',
    INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
    
    // GPG Related Errors
    GPG_SIGNATURE_MISMATCH = 'GPG_SIGNATURE_MISMATCH',
    GPG_VERIFICATION_FAILED = 'GPG_VERIFICATION_FAILED',
    GPG_KEY_NOT_FOUND = 'GPG_KEY_NOT_FOUND',
    
    // System Errors
    SYSTEM_ERROR = 'SYSTEM_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',

    // User Creation Errors
    USER_CREATION_FAILED = 'USER_CREATION_FAILED'
}

export type AuthError = {
    code: AuthErrorCode;
    message: string; // Fallback message if no translation is available
}

export type AuthResponse = {
    success: boolean;
    error?: AuthError;
    data?: any;
}

// Error messages for different languages
export const errorMessages = {
    ar: {
        [AuthErrorCode.INVALID_EMAIL]: 'صيغة البريد الإلكتروني غير صالحة',
        [AuthErrorCode.INVALID_PASSWORD]: 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
        [AuthErrorCode.INVALID_NAME]: 'يجب أن يتكون الاسم من حرفين على الأقل',
        [AuthErrorCode.INVALID_GPG_SIGNATURE]: 'توقيع GPG غير صالح',
        [AuthErrorCode.EMAIL_IN_USE]: 'البريد الإلكتروني مستخدم بالفعل',
        [AuthErrorCode.INVALID_CREDENTIALS]: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        [AuthErrorCode.GPG_SIGNATURE_MISMATCH]: 'البريد الإلكتروني لا يتطابق مع توقيع GPG',
        [AuthErrorCode.GPG_VERIFICATION_FAILED]: 'فشل التحقق من توقيع GPG',
        [AuthErrorCode.GPG_KEY_NOT_FOUND]: 'مفتاح GPG العام غير موجود',
        [AuthErrorCode.SYSTEM_ERROR]: 'حدث خطأ في النظام',
        [AuthErrorCode.UNKNOWN_ERROR]: 'حدث خطأ غير متوقع',
        [AuthErrorCode.USER_CREATION_FAILED]: 'فشل إنشاء الحساب'
    }
} 