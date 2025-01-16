import { apiClient } from "@/lib/client"
import { BlogPostResponse } from "@/interfaces/blog"
import { FormState } from "@/state/blog/form"

interface ApiError {
    cached?: boolean;
    data?: BlogPostResponse;
    message?: string;
    response?: {
        data: unknown;
        status: number;
    };
    stack?: string;
}

export async function getDraft(id: string): Promise<BlogPostResponse | null> {
    try {
        const response = await apiClient.get('/blog/draft', {
            params: { id }
        })
        return response.data
    } catch (error) {
        console.error('Error fetching draft:', error)
        return null
    }
}

export async function saveDraft(data: Partial<BlogPostResponse>): Promise<BlogPostResponse | null> {
    try {
        const response = await apiClient.post('/blog/draft', data)
        return response.data
    } catch (error) {
        console.error('Error saving draft:', error)
        return null
    }
}

export async function updateDraft(state: FormState): Promise<BlogPostResponse | null> {
    try {
        const response = await apiClient.post('/blog/draft', {
            id: state.id,
            title: state.title,
            content: state.content,
            categories: state.categories,
            signedWithGPG: state.signedWithGPG,
            workbar: state.workbar,
            status: state.status,
            author: state.author
        })

        if (!response.data) {
            throw new Error('No data received from server')
        }

        return response.data as BlogPostResponse
    } catch (error) {
        // Handle cached response
        const apiError = error as ApiError
        if (apiError.cached && apiError.data) {
            return apiError.data as BlogPostResponse
        }

        // Handle regular errors
        const errorDetails = {
            message: apiError.message || 'Unknown error',
            response: apiError.response?.data || 'No response data',
            status: apiError.response?.status || 'No status',
            stack: apiError.stack
        }
        
        console.error('Error updating draft:', errorDetails)
        return null
    }
}

