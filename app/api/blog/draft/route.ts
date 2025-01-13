import { Post, PostStatus } from "@prisma/client"
import { NextResponse } from "next/server"
import { BlogPostRequest } from "@/interfaces/blog"
import { 
    getPost, getPostBySlug, initBlogPostDraft, 
    updateBlogPostDraftUnpublished } from "@/lib/blog"

export async function POST(request: Request) {
    const blogRequest = await request.json() as BlogPostRequest
    let post: Post | null = null
    if (blogRequest.id) {
        post = await getPost(blogRequest.id)
        if (!post) {
            return NextResponse.json({ error: "Post not found, make sure to not provide an id if you are creating a new post" }, { status: 404 })
        }

        if (post.status !== PostStatus.DRAFT && post.status !== PostStatus.UNPUBLISHED) {
            return NextResponse.json({ error: "Post is not a draft or unpublished, make sure to not provide an id if you are creating a new post" }, { status: 404 })
        }

        // Update the drafted or unpublished post
        post = await updateBlogPostDraftUnpublished(blogRequest, post)

    } else {
        // Create a draft post
        post = await initBlogPostDraft(blogRequest)
    }


    return NextResponse.json(post)
}



export async function GET(slug: string) {
    const post = await getPostBySlug(slug)
    if (!post) {
        return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json(post)
}