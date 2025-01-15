/*
* Abstract for blog API calls
*/
import { BlogPostResponse } from "@/interfaces/blog"
import { apiClient } from "@/lib/client"

export async function getPostPublished(id: string): Promise<BlogPostResponse | null> {
    const response = await apiClient.get('/blog', {
        params: { id }
    })
    return response.data as BlogPostResponse
}   
