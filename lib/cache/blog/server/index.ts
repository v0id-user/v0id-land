import 'server-only'
import { Post, User } from "@prisma/client"
import redis from "@/lib/redis"

const CACHE_PREFIX = 'blog_server_'
const CACHE_TTL = 3600 // 1 hour in seconds

interface ExtendedPost extends Post {
    author: User;
    categories: { name: string }[];
}

// Cache keys
export const CACHE_KEYS = {
    BLOG_LIST: 'blog_list',
    POST: (slug: string) => `post_${slug}`,
    POST_BY_ID: (id: string) => `post_id_${id}`,
    VERIFY: (id: string) => `verify_${id}`
} as const

// Base cache functions
async function setCache<T>(key: string, data: T): Promise<void> {
    try {
        await redis.setex(
            `${CACHE_PREFIX}${key}`,
            CACHE_TTL,
            JSON.stringify(data)
        )
    } catch (error) {
        console.warn('Failed to set Redis cache:', error)
    }
}

async function getCache<T>(key: string): Promise<T | null> {
    try {
        const data = await redis.get(`${CACHE_PREFIX}${key}`)
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.warn('Failed to get Redis cache:', error)
        return null
    }
}

// Blog-specific cache functions
export async function setBlogListCache(posts: ExtendedPost[]): Promise<void> {
    await setCache(CACHE_KEYS.BLOG_LIST, posts)
}

export async function getBlogListCache(): Promise<ExtendedPost[] | null> {
    return getCache<ExtendedPost[]>(CACHE_KEYS.BLOG_LIST)
}

export async function setBlogPostCache(slug: string, post: ExtendedPost): Promise<void> {
    await setCache(CACHE_KEYS.POST(slug), post)
}

export async function getBlogPostCache(slug: string): Promise<ExtendedPost | null> {
    return getCache<ExtendedPost>(CACHE_KEYS.POST(slug))
}

export async function setBlogPostByIdCache(id: string, post: ExtendedPost): Promise<void> {
    await setCache(CACHE_KEYS.POST_BY_ID(id), post)
}

export async function getBlogPostByIdCache(id: string): Promise<ExtendedPost | null> {
    return getCache<ExtendedPost>(CACHE_KEYS.POST_BY_ID(id))
}

export async function setVerifyPostCache(id: string, post: ExtendedPost): Promise<void> {
    await setCache(CACHE_KEYS.VERIFY(id), post)
}

export async function getVerifyPostCache(id: string): Promise<ExtendedPost | null> {
    return getCache<ExtendedPost>(CACHE_KEYS.VERIFY(id))
}

export async function clearBlogCache(key?: string): Promise<void> {
    try {
        if (key) {
            await redis.del(`${CACHE_PREFIX}${key}`)
        } else {
            // Get all keys with the blog prefix
            const keys = await redis.keys(`${CACHE_PREFIX}*`)
            if (keys.length > 0) {
                await redis.del(keys)
            }
        }
    } catch (error) {
        console.warn('Failed to clear Redis cache:', error)
    }
}

// Cache invalidation helper
export async function invalidatePostCache(post: Post): Promise<void> {
    await Promise.all([
        clearBlogCache(CACHE_KEYS.BLOG_LIST),
        clearBlogCache(CACHE_KEYS.POST(post.slug ?? '')),
        clearBlogCache(CACHE_KEYS.POST_BY_ID(post.id)),
        clearBlogCache(CACHE_KEYS.VERIFY(post.id))
    ])
}
