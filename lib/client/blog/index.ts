/*
* Abstract for blog API calls
*/
import { BlogPostResponse, BlogsResponse, BlogCard, BlogPresignedUrlResponse, BlogPresignedUrlRequest } from "@/interfaces/blog"
import { apiClient } from "@/lib/client"
import { AxiosResponse } from "axios";
import axios from "axios"

export async function getPostPublished(id: string): Promise<BlogPostResponse | null> {
    const response = await apiClient.get('/blog', {
        params: { id }
    })
    return response.data as BlogPostResponse
}

export async function getPublishedPosts(): Promise<BlogsResponse[]> {
    let response;
    let attempts = 0;

    while (attempts < 2) {
        response = await apiClient.get('/blog');
        if (response.status === 200) {
            break; // Exit the loop if the response is OK
        }
        attempts++;
    }

    if (!response) {
        throw new Error('Failed to fetch posts after multiple attempts');
    }

    // Transform the flat data into the nested structure required by BlogsResponse
    return (response.data as { post: BlogCard }[]).map(({ post }) => ({
        post: {
            id: post.id,
            title: post.title,
            slug: post.slug,
            createdAt: post.createdAt,
            author: {
                name: post.author.name // Ensure only the name is included
            },
            categories: post.categories.map(category => ({
                name: category.name // Ensure only the category name is included
            })),
            signedWithGPG: post.signedWithGPG
        }
    }));
}

export async function getPresignedUrl(file: File): Promise<BlogPresignedUrlResponse | null> {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const request: BlogPresignedUrlRequest = {
        filename: file.name,
        contentType: file.type,
        fileSize: file.size,
        hash: hash,
    }

    const response = await apiClient.post('/s3/presign', request);

    if (!response) {
        throw new Error('Failed to get presigned URL');
    }

    const data = response.data as BlogPresignedUrlResponse;

    // If file already exists, just use the public URL
    if (data.publicUrl) {
        return data
    }

    return null
}

export async function uploadFile(file: File, url: string): Promise<boolean> {
    try {
        const response = await axios.put(url, file, {
            headers: {
                'Content-Type': file.type,
        },
    });

        return response.status === 200
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error uploading file:', error.response?.data)
        } else {
            console.error('Error uploading file:', error)
        }
        return false
    }
}
