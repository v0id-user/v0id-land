import { Badge } from "@/components/ui/badge";
import WorkBar from "./WorkBar";
import { Shield, ShieldCheck } from "lucide-react";
import Link from "next/link";
import BlogContent from "@/components/BlogContent";
import { getSpacerToken } from "@/lib/token";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import { ExtendedPost } from "@/interfaces/blog";

export default async function BlogContainer({ post }: { post: ExtendedPost }) {
    const spacer = await getSpacerToken()
    const access = spacer?.id === post.authorId


    return (
        <article className="w-[95%] sm:w-[90%] max-w-3xl mx-auto py-4 sm:py-8">
            <div className="flex flex-col gap-4 sm:gap-8">
                {/* Title and Metadata Section */}
                <div className="space-y-3 sm:space-y-4 w-full">
                    <h1 className="text-2xl sm:text-4xl font-bold break-words w-full">{post.title}</h1>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-gray-600 gap-2 sm:gap-0 w-full">
                        {/* Fast button to edit the post for author */}
                        {access && (
                            <Link href={`/space/creation/${post.id}`} className="text-sm text-blue-500 hover:text-blue-700 underline">
                                تعديل
                            </Link>
                        )}
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="truncate">{post.author.name}</span>
                            <span>•</span>
                            <span>{new Date(post.createdAt).toLocaleDateString('ar-SA')}</span>
                        </div>

                        {/* GPG Signature Status */}
                        {post.signedWithGPG ? (
                            <Link href={`/blog/verify/${post.id}`} target="_blank" className="flex underline items-center gap-1 text-green-600 hover:text-green-700 transition-colors flex-shrink-0">
                                <ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>موقع بـ GPG</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-1 text-gray-400 flex-shrink-0">
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                                <span>غير موقع</span>
                            </div>
                        )}
                    </div>

                    {/* Categories */}
                    {post.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
                            {post.categories.map(category => (
                                <Badge
                                    key={category.name}
                                    variant="secondary"
                                    className="rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm whitespace-nowrap"
                                >
                                    {category.name}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content Section - Client Component */}
                <div className="w-full">
                    <BlogContent content={post.content || ''} />
                </div>

                {/* WorkBar Section - if enabled */}
                {post.workbar && (
                    <div className="flex justify-center pt-4 sm:pt-8 w-full">
                        <WorkBar />
                    </div>
                )}
                <div className="flex justify-center gap-4 mt-8 mb-4">
                    <a 
                        href="https://github.com/v0id-user"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                    </a>
                    <a 
                        href="https://x.com/v0id_user"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black transition-colors"
                    >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                    </a>
                </div>
                <Footer />
            </div>
            <ScrollToTop />
        </article>
    );
}
