import { NextRequest, NextResponse } from "next/server";
import { getSpacerToken } from "@/lib/token";
import { updateBlogPostDraftUnpublished, getPost } from "@/lib/blog";
import { PostStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
    const token = await getSpacerToken();
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.json();
        
        // Normalize categories to lowercase
        if (data.categories) {
            data.categories = [...new Set(data.categories.map((cat: string) => cat.toLowerCase()))];
        }

        // Get existing post
        const existingPost = await getPost(data.id);
        if (!existingPost) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        if (existingPost.status !== PostStatus.DRAFT && existingPost.status !== PostStatus.UNPUBLISHED) {
            return NextResponse.json({ error: 'Post is not a draft or unpublished' }, { status: 400 });
        }

        // Update the post
        const updatedPost = await updateBlogPostDraftUnpublished(data, existingPost);
        
        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error updating draft:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}