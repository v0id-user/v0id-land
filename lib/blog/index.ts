import 'server-only'
import { BlogPostRequest } from "@/interfaces/blog"
import { Post, PostStatus, PrismaClient } from "@prisma/client"
import { createClient } from "@redis/client"

const prisma = new PrismaClient()
const redis = createClient({
    url: process.env.REDIS_URL
})

export async function getPost(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
        where: { id }
    })
    return post
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
        data:
        {
            author: {
                connect: {
                    id: data.author
                }
            },
            title: data.title,
            content: data.content,
            signedWithGPG: data.signedWithGPG,
            workbar: data.includeWorkbar,

            // The categories and slug are not set yet, they are set on publish or full update to a published post
            categories: {},
            slug: ""
        }
    })
    return post
}


export async function updateBlogPostDraftUnpublished(data: BlogPostRequest, post: Post): Promise<Post> {
    const updatedPost = await prisma.post.update({
        where: {
            id: post.id,
            AND: {
                status: {
                    in: [PostStatus.DRAFT, PostStatus.UNPUBLISHED]
                }
            }
        },
        data: {
            title: data.title,
            content: data.content,
            signedWithGPG: data.signedWithGPG,
            workbar: data.includeWorkbar,

            // The categories and slug are not set yet, they are set on publish or full update to a published post
            categories: {},
            slug: ""
        }
    })
    return updatedPost
}
