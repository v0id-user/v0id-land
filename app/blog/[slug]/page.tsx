import BlogContainer from "@/components/BlogContainer";
import { Post, User } from "@prisma/client";
import { getPostPublishedBySlug } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from 'next';

interface ExtendedPost extends Post {
    author: User;
    categories: { name: string }[];
}

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const slug = (await params).slug;
    const post = await getPostPublishedBySlug(slug) as ExtendedPost | null;

    return {
        title: post?.title || 'Post Not Found',
        description: post?.content?.substring(0, 160) || 'Blog post not found',
    };
}

export default async function Blog({ params }: Props) {
    const slug = (await params).slug;
    const post = await getPostPublishedBySlug(slug) as ExtendedPost | null;

    return (
        <main>
            <div className="min-h-screen text-right" dir="rtl">
                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <Link href="/blog" className="text-gray-600 hover:text-black transition-colors text-sm sm:text-base">
                        العودة لصفحة المدونة ←
                    </Link>

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
