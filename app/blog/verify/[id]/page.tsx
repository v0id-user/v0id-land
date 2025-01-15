"use client"

import { Post, User } from "@prisma/client";
import { getPostPublished } from "@/lib/client/blog";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import React from "react";

interface ExtendedPost extends Post {
    author: User;
    categories: { name: string }[];
}

export default function Blog({ params }: { params: { id: string } }) {
    const [post, setPost] = useState<ExtendedPost | null>(null);
    useEffect(() => {
        const fetchPost = async () => {
            const postId = (await params).id; // Directly access id from params
            const post = await getPostPublished(postId) as ExtendedPost | null;
            console.log(post);
            setPost(post);
        }
        fetchPost();
    }, [params]) // Added params as a dependency

    return (
        <main>
            <div className="min-h-screen text-right">
                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="w-24 h-1 mx-auto"></div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        {post && (
                            <div className="flex flex-col sm:flex-row gap-2 mb-8">
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(post.signature ?? '');
                                        toast.success('تم نسخ المحتوى بنجاح!');
                                    }}
                                    className="text-sm text-blue-500 hover:text-blue-700 underline"
                                >
                                    نسخ
                                </button>
                                <a
                                    href="https://gpg.v0id.me"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-green-500 hover:text-green-700 underline"
                                >
                                    مفتاح GPG العام
                                </a>
                                <a
                                    href={`/blog/${post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-black hover:text-gray-50-700 underline"
                                >
                                    الذهاب للمنشور
                                </a>
                            </div>
                        )}
                        <pre className="rounded-lg p-6 w-full sm:w-[50%] mx-auto whitespace-pre-wrap break-words">
                            {post ? (
                                post.signature
                            ) : (
                                <p>Post not found.</p>
                            )}
                        </pre>
                    </div>
                </div>
            </div>
        </main>
    );
}