import { OGImageParams, PostMetadata } from "@/interfaces/blog/og";
import { User } from "@prisma/client";

interface ExtendedPost {
    title: string;
    content: string | null;
    author: User;
}

export function generateOGImageUrl(params: OGImageParams): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://v0id.me';
    const url = new URL('/api/og', baseUrl);
    
    url.searchParams.set('title', params.title);
    url.searchParams.set('author', params.author);
    
    return url.toString();
}

export function generatePostMetadata(post: ExtendedPost): PostMetadata {
    const description = post.content?.substring(0, 160) || post.title;
    const ogImageUrl = generateOGImageUrl({
        title: post.title,
        author: post.author.name,
    });

    const socialMetadata = {
        title: post.title,
        description: description,
        images: [
            {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
            }
        ],
    };

    return {
        title: post.title,
        description: description,
        openGraph: socialMetadata,
        twitter: {
            card: 'summary_large_image',
            ...socialMetadata,
        },
        telegram: {
            card: 'article',
            ...socialMetadata,
        },
    };
} 