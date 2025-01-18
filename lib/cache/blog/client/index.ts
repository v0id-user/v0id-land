import 'client-only'
import { BlogsResponse, ExtendedPost } from "@/interfaces/blog"

const CACHE_PREFIX = 'blog_cache_'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

interface CacheItem<T> {
    data: T
    timestamp: number
}

// Cache keys
export const CACHE_KEYS = {
    BLOG_LIST: 'blog_list',
    POST: (slug: string) => `post_${slug}`,
    VERIFY: (id: string) => `verify_${id}`
} as const

// Base cache functions
function setCache<T>(key: string, data: T): void {
    try {
        const cacheItem: CacheItem<T> = {
            data,
            timestamp: Date.now()
        }
        localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem))
    } catch (error) {
        console.warn('Failed to set cache:', error)
    }
}

function getCache<T>(key: string): T | null {
    try {
        const item = localStorage.getItem(`${CACHE_PREFIX}${key}`)
        if (!item) return null

        const cacheItem: CacheItem<T> = JSON.parse(item)
        const isExpired = Date.now() - cacheItem.timestamp > CACHE_DURATION

        if (isExpired) {
            localStorage.removeItem(`${CACHE_PREFIX}${key}`)
            return null
        }

        return cacheItem.data
    } catch (error) {
        console.warn('Failed to get cache:', error)
        return null
    }
}

// Blog-specific cache functions
export function setBlogListCache(posts: BlogsResponse[]): void {
    // Transform flat structure to nested before caching
    const transformedPosts: BlogsResponse[] = posts.map(post => ({
        post: {
            id: post.post.id,
            title: post.post.title,
            slug: post.post.slug,
            createdAt: post.post.createdAt,
            author: post.post.author,
            categories: post.post.categories,
            signedWithGPG: post.post.signedWithGPG
        }
    }))
    setCache(CACHE_KEYS.BLOG_LIST, transformedPosts)
}

export function getBlogListCache(): BlogsResponse[] | null {
    const cachedPosts = getCache<BlogsResponse[]>(CACHE_KEYS.BLOG_LIST);
    return cachedPosts ?? null; // Ensure we return null if cachedPosts is undefined
}

export function setBlogPostCache(slug: string, post: ExtendedPost): void {
    setCache(CACHE_KEYS.POST(slug), post)
}

export function getBlogPostCache(slug: string): ExtendedPost | null {
    return getCache<ExtendedPost>(CACHE_KEYS.POST(slug))
}

export function setVerifyPostCache(id: string, post: ExtendedPost): void {
    setCache(CACHE_KEYS.VERIFY(id), post)
}

export function getVerifyPostCache(id: string): ExtendedPost | null {
    return getCache<ExtendedPost>(CACHE_KEYS.VERIFY(id))
}

export function clearBlogCache(key?: string): void {
    try {
        if (key) {
            localStorage.removeItem(`${CACHE_PREFIX}${key}`)
        } else {
            // Clear all blog cache items
            Object.keys(localStorage)
                .filter(key => key.startsWith(CACHE_PREFIX))
                .forEach(key => localStorage.removeItem(key))
        }
    } catch (error) {
        console.warn('Failed to clear cache:', error)
    }
}
