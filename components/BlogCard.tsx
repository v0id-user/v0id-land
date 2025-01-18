import { motion } from 'motion/react'
import Link from 'next/link'
import { BlogCard as BlogCardType } from '@/interfaces/blog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Loader from '@/components/Loader'
import { Shield } from 'lucide-react'
import { ShieldCheck } from 'lucide-react'

interface BlogCardProps {
    post: BlogCardType
    index: number
}

export function BlogCardSkeleton() {
    return (
        <div className="border-b border-gray-200 pb-8 last:border-0">
            <div className="space-y-3">
                {/* Title skeleton */}
                <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
                
                {/* Metadata skeleton */}
                <div className="flex items-center gap-4">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-24"></div>
                </div>
                
                {/* Categories skeleton */}
                <div className="flex gap-2 mt-3">
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
                    <div className="h-6 bg-gray-200 animate-pulse rounded w-16"></div>
                </div>
            </div>
        </div>
    )
}
export default function BlogCard({ post, index }: BlogCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setIsLoading(true);
        router.push(`/blog/${post.slug}`);
    };

    if (!post) return null; // Early return if post is not available

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index, duration: 0.5 }}
            className={`border-b border-gray-200 pb-8 last:border-0 ${isLoading ? 'pointer-events-none' : ''}`}
        >
            <Link href={`/blog/${post.slug}`} onClick={handleClick} className="group block relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                        <Loader />
                    </div>
                )}
                {/* Post Title */}
                <h2 className="text-2xl font-semibold mb-2 group-hover:text-gray-600 transition-colors">
                    {post.title}
                </h2>

                {/* Post Metadata */}
                <div className="flex items-center text-sm text-gray-500 gap-4">
                    <span>{post.author?.name || "Unknown"}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString('ar-SA')}</span>
                    {post.signedWithGPG ? (
                        <div 
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(`/blog/verify/${post.id}`, '_blank');
                            }}
                            className="flex underline items-center gap-1 text-green-600 hover:text-green-700 transition-colors flex-shrink-0 cursor-pointer"
                        >
                            <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>موقع بـ GPG</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>غير موقع</span>
                        </div>
                    )}
                </div>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
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
    );
}