import 'server-only'
import { BlogPostRequest, BlogPostResponse } from "@/interfaces/blog"
import { Post, PostStatus } from "@prisma/client"
import prisma from "@/lib/prisma"
import redis from "@/lib/redis"

const CACHE_TTL = 3600; // 1 hour in seconds
const POST_CACHE_PREFIX = "post:";
const SLUG_CACHE_PREFIX = "slug:";
const ALL_POSTS_CACHE_KEY = "all_published_posts";

async function invalidatePostCache(post: Post) {
    await Promise.all([
        redis.del(`${POST_CACHE_PREFIX}${post.id}`),
        post.slug ? redis.del(`${SLUG_CACHE_PREFIX}${post.slug}`) : Promise.resolve(),
        redis.del(ALL_POSTS_CACHE_KEY)
    ]);
}

interface DraftUpdateData {
    title?: string;
    content?: string;
    categories?: string[];
    signedWithGPG?: boolean;
    workbar?: boolean;
}

export async function getPostNoCache(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            categories: true,
            author: true
        }
    });
    return post
}

export async function getPost(id: string): Promise<Post | null> {
    // Try to get from cache first
    const cached = await redis.get(`${POST_CACHE_PREFIX}${id}`);
    if (cached) {
        return JSON.parse(cached);
    }

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            categories: true,
            author: true
        }
    });

    if (post) {
        await redis.setex(`${POST_CACHE_PREFIX}${id}`, CACHE_TTL, JSON.stringify(post));
    }

    return post;
}

export async function getPublishedPosts(): Promise<Post[]> {
    // Try to get from cache first
    const cached = await redis.get(ALL_POSTS_CACHE_KEY);
    if (cached) {
        return JSON.parse(cached);
    }

    const posts = await prisma.post.findMany({
        where: {
            status: 'PUBLISHED'
        },
        include: {
            author: {
                select: {
                    name: true
                }
            },
            categories: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    await redis.setex(ALL_POSTS_CACHE_KEY, CACHE_TTL, JSON.stringify(posts));
    return posts;
}

export async function getPostPublished(id: string): Promise<Post | null> {
    // Try to get from cache first
    const cached = await redis.get(`${POST_CACHE_PREFIX}${id}`);
    if (cached) {
        const post = JSON.parse(cached);
        if (post.status === PostStatus.PUBLISHED) {
            return post;
        }
    }

    const post = await prisma.post.findUnique({
        where: { id, status: PostStatus.PUBLISHED },
        include: {
            categories: true,
            author: true
        }
    });

    if (post) {
        await redis.setex(`${POST_CACHE_PREFIX}${id}`, CACHE_TTL, JSON.stringify(post));
    }

    return post;
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
        categories: post.categories,
        signedWithGPG: post.signedWithGPG,
        workbar: post.workbar
    }))

    console.log(blogPosts)
    return blogPosts
}

export async function getPostPublishedBySlug(slug: string): Promise<Post | null> {
    try {
        // Try to get from cache first
        const cached = await redis.get(`${SLUG_CACHE_PREFIX}${slug}`);
        if (cached) {
            const post = JSON.parse(cached);
            if (post.status === PostStatus.PUBLISHED) {
                return post;
            }
        }

        const post = await prisma.post.findUnique({
            where: {
                slug: slug,
                status: PostStatus.PUBLISHED
            },
            include: {
                author: true,
                categories: {
                    select: {
                        name: true
                    }
                }
            }
        });

        if (post) {
            await redis.setex(`${SLUG_CACHE_PREFIX}${slug}`, CACHE_TTL, JSON.stringify(post));
        }

        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
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
    
    // Invalidate caches if it's a published post
    if (post.status === PostStatus.PUBLISHED) {
        await invalidatePostCache(post);
    }
    
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

    // Invalidate caches
    await invalidatePostCache(updatedPost);

    return updatedPost;
}
