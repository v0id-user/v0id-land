import { getSpacerToken } from "@/lib/token";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { BlogPresignedUrlRequest, BlogPresignedUrlResponse } from "@/interfaces/blog";
export const maxDuration = 30;

// Initialize S3 client with standard AWS configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'auto',
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    forcePathStyle: true // Needed for some S3-compatible services
});

// Allowed file types for security
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml'  // Be careful with SVG as it can contain JavaScript
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
    try {
        // Check authentication
        const token = await getSpacerToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const presignedUrlRequest = await request.json() as BlogPresignedUrlRequest | null;
        
        // Validate required fields
        if (!presignedUrlRequest?.filename || !presignedUrlRequest?.contentType || !presignedUrlRequest?.fileSize || !presignedUrlRequest?.hash) {
            return NextResponse.json({ 
                error: "Missing required fields: filename, contentType, fileSize, or hash" 
            }, { status: 400 });
        }

        // Security checks
        if (!ALLOWED_MIME_TYPES.includes(presignedUrlRequest.contentType)) {
            return NextResponse.json({ 
                error: "File type not allowed" 
            }, { status: 400 });
        }

        if (presignedUrlRequest.fileSize > MAX_FILE_SIZE) {
            return NextResponse.json({ 
                error: "File size exceeds maximum allowed size of 5MB" 
            }, { status: 400 });
        }

        if (!process.env.AWS_BUCKET_NAME) {
            throw new Error('AWS_BUCKET_NAME environment variable is not set');
        }

        // Extract file extension
        const fileExtension = presignedUrlRequest.filename.split('.').pop()?.toLowerCase() || '';
        // Generate key based on hash and original extension
        const key = `uploads/${presignedUrlRequest.hash}.${fileExtension}`;

        try {
            // Check if file already exists
            const headCommand = new HeadObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: key,
            });
            
            await s3Client.send(headCommand);
            
            // File exists, return the public URL without generating a new presigned URL
            const publicUrl = `${process.env.STORAGE_DOMAIN}/${key}`;
            
            const response: BlogPresignedUrlResponse = {
                publicUrl
            }
            return NextResponse.json(response);
        } catch (error) {
            // File doesn't exist, generate presigned URL for upload
            if (error instanceof Error && 'name' in error && error.name === 'NotFound') {
                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                    ContentType: presignedUrlRequest.contentType,
                    CacheControl: 'public, max-age=31536000',
                    Metadata: {
                        'original-filename': presignedUrlRequest.filename,
                        'content-hash': presignedUrlRequest.hash,
                        'upload-date': new Date().toISOString(),
                    }
                });

                const presignedUrl = await getSignedUrl(s3Client, command, { 
                    expiresIn: 600 // 10 minutes
                });

                const publicUrl = `${process.env.STORAGE_DOMAIN}/${key}`;
                const response: BlogPresignedUrlResponse = {
                    publicUrl,
                    presignedUrl
                }
                return NextResponse.json(response);
            }
            throw error;
        }
    } catch (error) {
        console.error("Error handling file upload:", error);
        return NextResponse.json({ 
            error: "Failed to process upload request" 
        }, { status: 500 });
    }
}