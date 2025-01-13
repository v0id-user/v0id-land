import 'server-only'
import { BlogPostRequest, BlogPostResponse } from "@/interfaces/blog"
import { Post, PrismaClient, PostStatus } from "@prisma/client"
import { createClient } from "@redis/client"

const prisma = new PrismaClient()
const redis = createClient({
    url: process.env.REDIS_URL
})

interface DraftUpdateData {
    title?: string;
    content?: string;
    categories?: string[];
    signedWithGPG?: boolean;
    workbar?: boolean;
}

export async function getPost(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            categories: true
        }
    })
    return post
}

export async function getBlogPosts(authorId: string): Promise<BlogPostResponse[]> {
    const posts = await prisma.post.findMany({
        where: { authorId: authorId },
        include: {
            categories: true
        }
    })

    const blogPosts: BlogPostResponse[] = posts.map(post => ({
        title: post.title ?? "",
        slug: post.slug ?? "",
        id: post.id,
        author: post.authorId,
        content: post.content ?? "",
        status: post.status,
        categories: post.categories.map(cat => cat.name)
    }))

    console.log(blogPosts)
    return blogPosts
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
    // Cache the post in redis
    const cachedPost = await redis.get(slug)

    if (cachedPost) {
        // Cache hit
        return JSON.parse(cachedPost) as Post
    }

    // Cache miss
    const post = await prisma.post.findUnique({
        where: { slug: slug }
    })

    if (!post) {
        return null
    }

    // Cache the post in redis for 1 Day | Don't await
    redis.set(slug, JSON.stringify(post), { EX: (60 * 60 * 24) })

    return post
}

export async function initBlogPostDraft(data: BlogPostRequest): Promise<Post> {
    const post = await prisma.post.create({
        data: {
            authorId: data.author,
            title: data.title || '',
            content: data.content || '',
            signedWithGPG: data.signedWithGPG || false,
            workbar: data.includeWorkbar || false,
            status: data.status || PostStatus.DRAFT,
            slug: data.slug || '',
            categories: {
                connect: []
            }
        }
    });
    return post;
}

export async function updateBlogPostDraftUnpublished(data: DraftUpdateData, post: Post): Promise<Post> {
    // Create or get existing categories
    const normalizedCategories = data.categories ? [...new Set(data.categories.map(cat => cat.toLowerCase()))] : [];
    
    const categories = await Promise.all(
        normalizedCategories.map(async (name) => {
            return prisma.category.upsert({
                where: { name },
                create: { name },
                update: {} // No updates needed if exists
            });
        })
    );

    // Update the post with new data
    const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: {
            title: data.title,
            content: data.content,
            signedWithGPG: data.signedWithGPG,
            workbar: data.workbar,
            categories: {
                set: categories.map(cat => ({ id: cat.id }))
            },
            updatedAt: new Date()
        },
        include: {
            categories: true
        }
    });

    return updatedPost;
}
