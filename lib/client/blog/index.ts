/*
* Abstract for blog API calls
*/
import { FormState } from '@/state/blog/form'
import { BlogPostResponse } from '@/interfaces/blog'

export async function updateDraft(state: FormState): Promise<BlogPostResponse | null> {
    try {
        const response = await fetch('/api/blog/draft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: state.id,
                title: state.title,
                content: state.content,
                categories: state.categories.map(cat => cat.toLowerCase()),
                signedWithGPG: state.signedWithGPG,
                workbar: state.workbar,
            }),
        })

        if (!response.ok) {
            throw new Error('Failed to update draft')
        }

        return await response.json()
    } catch (error) {
        console.error('Error updating draft:', error)
        return null
    }
}

export async function getDraft(id: string): Promise<BlogPostResponse | null> {
    try {
        const response = await fetch(`/api/blog?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            throw new Error('Failed to fetch draft')
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching draft:', error)
        return null
    }
}
