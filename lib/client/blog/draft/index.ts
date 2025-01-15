import { apiClient } from "@/lib/client"

import { BlogPostResponse } from "@/interfaces/blog"
import { FormState } from "@/state/blog/form"

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
            categories: state.categories.map(cat => cat.toLowerCase()),
            signedWithGPG: state.signedWithGPG,
            workbar: state.workbar,
        })

        return response.data as BlogPostResponse
    } catch (error) {
        console.error('Error updating draft:', error)
        return null
    }
}

