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