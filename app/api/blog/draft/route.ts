import { NextRequest, NextResponse } from "next/server";
import { getSpacerToken } from "@/lib/token";
import { updateBlogPostDraftUnpublished, getPostNoCache, initBlogPostDraft } from "@/lib/blog";
import { PostStatus } from "@prisma/client";
import { BlogPostRequest } from "@/interfaces/blog";

export const maxDuration = 30;

interface CategoryLike {
    name: string;
}

type CategoryInput = string | CategoryLike;

export async function POST(request: NextRequest) {
    console.log('Received POST request for draft creation or update.');

    const token = await getSpacerToken();
    if (!token) {
        console.log('Unauthorized access attempt.');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('Token validated successfully.');

    try {
        const data = await request.json();
        console.log('Request data parsed:', data);
        const blogPostData: BlogPostRequest = data as BlogPostRequest;
        // Normalize categories to lowercase if present
        if (blogPostData.categories) {
            blogPostData.categories = [...new Set(blogPostData.categories.map((cat: CategoryInput) => {
                if (typeof cat === 'string') {
                    return cat.toLowerCase();
                }
                return cat.name.toLowerCase();
            }))];
            console.log('Normalized categories:', blogPostData.categories);
        }

        // If no ID is provided, create a new draft
        if (!data.id) {
            console.log('Creating a new draft post.');
            const newPost = await initBlogPostDraft(data);
            console.log('New draft created:', newPost);
            return NextResponse.json(newPost);
        }

        // Otherwise, update existing post
        console.log('Fetching existing post with ID:', data.id);
        const existingPost = await getPostNoCache(data.id);
        if (!existingPost) {
            console.log('Post not found for ID:', data.id);
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }
        console.log('Existing post found:', existingPost);

        if (existingPost.status !== PostStatus.DRAFT && existingPost.status !== PostStatus.UNPUBLISHED) {
            console.log('Post status is not draft or unpublished:', existingPost.status);
            return NextResponse.json({ error: 'Post is not a draft or unpublished' }, { status: 400 });
        }

        // Update the post
        console.log('Updating the existing post:', existingPost.id);
        const updatedPost = await updateBlogPostDraftUnpublished(data, existingPost);
        console.log('Post updated successfully:', updatedPost);
        
        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Error handling draft:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// /api/blog?id=123
export async function GET(request: Request) {
    const token = await getSpacerToken();
    if (!token) {
        console.log('Unauthorized access attempt.');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }
    const draft = await getPostNoCache(id)
    return NextResponse.json(draft)
}   