import { redirect } from "next/navigation"
import { getSpacerToken } from "@/lib/token"
import { getBlogPosts } from "@/lib/blog";
import Link from "next/link";
import CreatePostButton from "@/components/CreatePostButton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PostStatus } from "@prisma/client";

export default async function Space() {
    const accessToken = await getSpacerToken();
    if (!accessToken) {
        redirect("/space/auth");
    }

    const blogPosts = await getBlogPosts(accessToken.id)

    const getBadgeColor = (status: PostStatus) => {
        switch (status) {
            case PostStatus.DRAFT: return "bg-gray-500"
            case PostStatus.PUBLISHED: return "bg-green-500"
            case PostStatus.UNPUBLISHED: return "bg-yellow-500"
        }
    }

    return (
        <main className="p-8" dir="rtl">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Welcome Card */}
                <div className="p-8 rounded-lg">
                    <h1 className="text-3xl font-bold mb-3">مرحبا بك, {accessToken.name}</h1>
                    <p className="text-gray-600 text-lg">لوحة التحكم العامة, مساحتك الخاصة للتعبير و الكتابة</p>
                </div>

                {/* Blogs */}
                <div className="space-y-4">
                    {blogPosts.length > 0 ? blogPosts.map(post => (
                        <Link 
                            key={post.id} 
                            href={`/space/creation/${post.id}`}
                            className="block p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                        >
                            <h2 className="text-2xl font-semibold mb-2">{post.title ?? "بدون عنوان"}</h2>
                            <p className="text-gray-600 mb-2">{post.slug ?? "بدون رابط"}</p>
                            <span className="text-gray-500 text-sm mb-2">معرف المقال: {post.id}</span>
                            <Badge className={`m-2 ${getBadgeColor(post.status)}`}>{post.status}</Badge>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {post.categories.map(cat => (
                                    <Badge key={cat.id}>{cat.name}</Badge>
                                ))}
                            </div>
                        </Link>
                    )) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg">لا يوجد منشورات بعد</p>
                        </div>
                    )}
                </div>

                <CreatePostButton authorId={accessToken.id} />
            </div>

            <footer className="mt-12 text-center">
                <div className="flex flex-col items-center gap-3">
                    <Image 
                        src="/logo.svg"
                        alt="V0ID Logo"
                        width={32}
                        height={32}
                    />
                    <p className="text-gray-600 text-sm">جميع الحقوق محفوظة © {new Date().getFullYear()} #V0ID</p>
                </div>
            </footer>
        </main>
    )
}