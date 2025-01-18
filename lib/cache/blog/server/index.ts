import 'server-only'
import { Post, User, Category } from "@prisma/client"
import redis from "@/lib/redis"
import { BlogsResponse } from "@/interfaces/blog"

const CACHE_PREFIX = 'blog_server_'
const CACHE_TTL = 3600 // 1 hour in seconds

// Safe user type without sensitive data
interface SafeUser {
    id: string;
    name: string;
}

// Types matching Prisma return types
interface PostWithSafeAuthorAndCategories extends Post {
    author: SafeUser;
    categories: Category[];
}

interface PublishedPostWithSafeAuthorAndCategories extends PostWithSafeAuthorAndCategories {
    status: "PUBLISHED";
}

// Type transformation utilities
export function toSafeUser(user: Pick<User, 'id' | 'name'>): SafeUser {
    return {
        id: user.id,
        name: user.name
    };
}

export function toPostWithSafeAuthor(post: Post & { 
    author: Pick<User, 'id' | 'name'>, 
    categories: Category[] 
}): PostWithSafeAuthorAndCategories {
    return {
        ...post,
        author: toSafeUser(post.author),
        categories: post.categories
    };
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
export async function setBlogListCache(posts: BlogsResponse[]): Promise<void> {
    await setCache(CACHE_KEYS.BLOG_LIST, posts)
}

export async function getBlogListCache(): Promise<BlogsResponse[] | null> {
    return getCache<BlogsResponse[]>(CACHE_KEYS.BLOG_LIST)
}

export async function setBlogPostCache(slug: string, post: PublishedPostWithSafeAuthorAndCategories): Promise<void> {
    await setCache(CACHE_KEYS.POST(slug), post)
}

export async function getBlogPostCache(slug: string): Promise<PublishedPostWithSafeAuthorAndCategories | null> {
    return getCache<PublishedPostWithSafeAuthorAndCategories>(CACHE_KEYS.POST(slug))
}

export async function setBlogPostByIdCache(id: string, post: PostWithSafeAuthorAndCategories): Promise<void> {
    await setCache(CACHE_KEYS.POST_BY_ID(id), post)
}

export async function getBlogPostByIdCache(id: string): Promise<PostWithSafeAuthorAndCategories | null> {
    return getCache<PostWithSafeAuthorAndCategories>(CACHE_KEYS.POST_BY_ID(id))
}

export async function setVerifyPostCache(id: string, post: PostWithSafeAuthorAndCategories): Promise<void> {
    await setCache(CACHE_KEYS.VERIFY(id), post)
}

export async function getVerifyPostCache(id: string): Promise<PostWithSafeAuthorAndCategories | null> {
    return getCache<PostWithSafeAuthorAndCategories>(CACHE_KEYS.VERIFY(id))
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
