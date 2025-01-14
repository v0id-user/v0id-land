'use server'

import { PostStatus, PrismaClient } from "@prisma/client"
import { SpaceErrorCode } from "@/errors/posts"
import { signText } from "@/lib/gpg"
import slugify from "slugify"

const prisma = new PrismaClient()

export interface CreatePostFormData {
    id: string
    title: string
    content: string
    signedWithGPG: boolean
    workbar: boolean
    categories: string[]
    author: string
}

export async function publishPost(formData: CreatePostFormData) {
    /*
     * We assume that the post is already in the database as a draft
     * so we just need to update the status to published and append the
     * slug and author to the post to make sure, also sign it if it's enabled.
    */

    if (!formData.id) {
        return { error: { code: SpaceErrorCode.POST_ID_REQUIRED, message: "Post ID is required" } }
    }

    // Sign the post if it's enabled
    let signature: string | null = null
    if (formData.signedWithGPG) {
        signature = await signText(formData.content)
    }

    // Then update with new categories and other data
    const post = await prisma.post.update({
        where: { id: formData.id },
        data: {
            status: PostStatus.PUBLISHED,
            signature: signature,
            slug: slugify(formData.title, { lower: true, strict: true }),
            author: { connect: { id: formData.author } },
        },
        include: {
            author: true
        }
    })


    return { success: true, post: post }
} 