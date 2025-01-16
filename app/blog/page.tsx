"use client"

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { apiClient } from '@/lib/client'
import BlogCard, { BlogCardSkeleton } from '@/components/BlogCard'
import { BlogCard as BlogCardType } from '@/interfaces/blog'
import { getBlogListCache, setBlogListCache } from '@/lib/cache/blog/client'

export default function Blog() {
    const [posts, setPosts] = useState<BlogCardType[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Try to get from cache first
                const cachedPosts = getBlogListCache()
                if (cachedPosts) {
                    setPosts(cachedPosts)
                    setIsLoading(false)
                    return
                }

                // If not in cache, fetch from API
                const response = await apiClient.get('/blog')
                setPosts(response.data)
                
                // Save to cache
                setBlogListCache(response.data)
            } catch (error) {
                console.error('Failed to fetch posts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [])

    return (
        <main className="items-center pt-40 sm:pt-52 pb-24 min-h-screen" dir='rtl'>
            {/* Navigation */}
            <nav className="max-w-4xl mx-auto px-4">
                <Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm sm:text-base mb-4 text-right">
                    العودة لصفحة الرئيسية ←
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <header>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-5xl font-bold mb-12"
                    >
                        المدونة
                    </motion.h1>
                </header>

                {/* Blog Posts List */}
                <section className="w-full max-w-3xl px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="space-y-8"
                    >
                        {isLoading ? (
                            // Show skeleton loading state
                            Array.from({ length: 3 }).map((_, index) => (
                                <BlogCardSkeleton key={index} />
                            ))
                        ) : (
                            posts.map((post, index) => (
                                <BlogCard key={post.id} post={post} index={index} />
                            ))
                        )}
                    </motion.div>
                </section>
            </div>
        </main>
    )
}