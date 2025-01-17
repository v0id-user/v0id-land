/*
* Abstract for blog API calls
*/
import { BlogPostResponse, BlogsResponse, BlogCard } from "@/interfaces/blog"
import { apiClient } from "@/lib/client"

export async function getPostPublished(id: string): Promise<BlogPostResponse | null> {
    const response = await apiClient.get('/blog', {
        params: { id }
    })
    return response.data as BlogPostResponse
}   

export async function getPublishedPosts(): Promise<BlogsResponse[]> {
    const response = await apiClient.get('/blog')
    // Transform the flat data into the nested structure required by BlogsResponse
    return (response.data as BlogCard[]).map(post => ({
        post: {
            id: post.id,
            title: post.title,
            slug: post.slug,
            createdAt: post.createdAt,
            author: post.author,
            categories: post.categories,
            signedWithGPG: post.signedWithGPG
        }
    }))
}