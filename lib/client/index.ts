import axios from 'axios'

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache: { [key: string]: CacheEntry<unknown> } = {}

const cacheDuration = 25 * 60 * 1000; // 25 minutes

// Endpoints that should never be cached
const UNCACHEABLE_ENDPOINTS = ['/blog/draft']

const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.response.use(response => {
    const url = response.config.url
    const method = response.config.method?.toLowerCase()
    
    // Only cache GET requests and non-draft endpoints
    if (url && method === 'get' && !UNCACHEABLE_ENDPOINTS.some(endpoint => url.includes(endpoint))) {
        cache[url] = {
            data: response.data,
            timestamp: Date.now(),
        }
    }
    return response
})

apiClient.interceptors.request.use(config => {
    const url = config.url
    const method = config.method?.toLowerCase()
    
    // Only use cache for GET requests and non-draft endpoints
    if (url && method === 'get' && !UNCACHEABLE_ENDPOINTS.some(endpoint => url.includes(endpoint)) && cache[url]) {
        const cachedResponse = cache[url]
        if (Date.now() - cachedResponse.timestamp < cacheDuration) {
            return Promise.reject({ cached: true, data: cachedResponse.data })
        }
        // Remove expired cache
        delete cache[url]
    }
    return config
})

export { apiClient }
