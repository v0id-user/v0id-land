const CACHE_PREFIX = 'blog_cache_'
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes in milliseconds

interface CacheItem<T> {
    data: T
    timestamp: number
}

export function setCache<T>(key: string, data: T): void {
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

export function getCache<T>(key: string): T | null {
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

export function clearCache(key?: string): void {
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