"use client"

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import Link from 'next/link'
import { apiClient } from '@/lib/client'

interface Post {
    id: string
    title: string
    slug: string
    createdAt: string
    author: {
        name: string
    }
    categories: {
        name: string
    }[]
}

export default function Blog() {
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await apiClient.get('/blog')
                setPosts(response.data)
            } catch (error) {
                console.error('Failed to fetch posts:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
        )
    }

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
                        {posts.map((post, index) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.5 }}
                                className="border-b border-gray-200 pb-8 last:border-0"
                            >
                                <Link href={`/blog/${post.slug}`} className="group">
                                    {/* Post Title */}
                                    <h2 className="text-2xl font-semibold mb-2 group-hover:text-gray-600 transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Post Metadata */}
                                    <div className="flex items-center text-sm text-gray-500 gap-4">
                                        <span>{post.author.name}</span>
                                        <span>•</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('ar-SA')}</span>
                                    </div>

                                    {/* Categories */}
                                    {post.categories.length > 0 && (
                                        <div className="flex gap-2 mt-3">
                                            {post.categories.map(category => (
                                                <span
                                                    key={category.name}
                                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </Link>
                            </motion.article>
                        ))}
                    </motion.div>
                </section>
            </div>
        </main>
    )
}