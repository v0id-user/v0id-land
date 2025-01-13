export enum SpaceErrorCode {
    // Validation Errors
    INVALID_TITLE = 'INVALID_TITLE',
    INVALID_CONTENT = 'INVALID_CONTENT',
    INVALID_CATEGORIES = 'INVALID_CATEGORIES',
    INVALID_SLUG = 'INVALID_SLUG',
    
    // Post Operation Errors
    POST_NOT_FOUND = 'POST_NOT_FOUND',
    POST_CREATION_FAILED = 'POST_CREATION_FAILED',
    POST_UPDATE_FAILED = 'POST_UPDATE_FAILED',
    POST_DELETE_FAILED = 'POST_DELETE_FAILED',
    
    // Category Related Errors
    CATEGORY_CREATION_FAILED = 'CATEGORY_CREATION_FAILED',
    CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
    
    // GPG Related Errors
    GPG_SIGNING_FAILED = 'GPG_SIGNING_FAILED',
    
    // System Errors
    SYSTEM_ERROR = 'SYSTEM_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export type SpaceError = {
    code: SpaceErrorCode;
    message: string; // Fallback message if no translation is available
}

export type SpaceResponse = {
    success: boolean;
    error?: SpaceError;
    data?: any;
}

// Error messages for different languages
export const errorMessages = {
    ar: {
        [SpaceErrorCode.INVALID_TITLE]: 'العنوان غير صالح',
        [SpaceErrorCode.INVALID_CONTENT]: 'المحتوى غير صالح',
        [SpaceErrorCode.INVALID_CATEGORIES]: 'التصنيفات غير صالحة',
        [SpaceErrorCode.INVALID_SLUG]: 'الرابط المختصر غير صالح',
        [SpaceErrorCode.POST_NOT_FOUND]: 'المنشور غير موجود',
        [SpaceErrorCode.POST_CREATION_FAILED]: 'فشل إنشاء المنشور',
        [SpaceErrorCode.POST_UPDATE_FAILED]: 'فشل تحديث المنشور',
        [SpaceErrorCode.POST_DELETE_FAILED]: 'فشل حذف المنشور',
        [SpaceErrorCode.CATEGORY_CREATION_FAILED]: 'فشل إنشاء التصنيف',
        [SpaceErrorCode.CATEGORY_NOT_FOUND]: 'التصنيف غير موجود',
        [SpaceErrorCode.GPG_SIGNING_FAILED]: 'فشل التوقيع باستخدام GPG',
        [SpaceErrorCode.SYSTEM_ERROR]: 'حدث خطأ في النظام',
        [SpaceErrorCode.UNKNOWN_ERROR]: 'حدث خطأ غير متوقع'
    }
} 