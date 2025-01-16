import { NextResponse } from 'next/server';
import { getPostPublished, getPublishedPosts } from '@/lib/blog';
export const maxDuration = 30;
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (id) {
            const post = await getPostPublished(id)
            return NextResponse.json(post);
        } else {
            const posts = await getPublishedPosts()
            return NextResponse.json(posts);
        }
    } catch (error) {
        console.error(error)
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}