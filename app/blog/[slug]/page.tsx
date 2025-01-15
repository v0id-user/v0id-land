import BlogContainer from "@/components/BlogContainer";
import { Post, User } from "@prisma/client";
import { getPostPublishedBySlug } from "@/lib/blog";
import Link from "next/link";

interface ExtendedPost extends Post {
    author: User;
    categories: { name: string }[];
}

export default async function Blog({ params }: { params: { slug: string } }) {
    const post = await getPostPublishedBySlug( (await params).slug) as ExtendedPost | null;

    return (
        <main>
            <div className="min-h-screen text-right" dir="rtl">
                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <Link href="/blog" className="text-gray-600 hover:text-black transition-colors text-sm sm:text-base">العودة لصفحة المدونة ←</Link>

                    <div className="text-center mb-12">
                        <div className="w-24 h-1 mx-auto"></div>
                    </div>
                    <div className="rounded-lg p-6">
                        {post ? (
                            <BlogContainer post={post} />
                        ) : (
                            <p>Post not found.</p>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}