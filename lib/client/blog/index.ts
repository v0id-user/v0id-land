/*
* Abstract for blog API calls
*/
import { FormState } from '@/state/blog/form'
import { BlogPostResponse } from '@/interfaces/blog'
import { apiClient } from '@/lib/client'

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

export async function getDraft(id: string): Promise<BlogPostResponse | null> {
    try {
        const response = await apiClient.get(`/blog`, {
            params: { id }
        })

        return response.data as BlogPostResponse
    } catch (error) {
        console.error('Error fetching draft:', error)
        return null
    }
}
