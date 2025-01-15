'use server'

import { PostStatus } from "@prisma/client"
import { SpaceErrorCode } from "@/errors/posts"
import { signText } from "@/lib/gpg"
import slugify from "slugify"
import { getSpacerToken } from "@/lib/token"
import prisma from "@/lib/prisma"

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

    const accessToken = await getSpacerToken()
    if (!accessToken) {
        return { error: { code: SpaceErrorCode.ACCESS_TOKEN_REQUIRED, message: "Access token is required" } }
    }

    if (!formData.id) {
        return { error: { code: SpaceErrorCode.POST_ID_REQUIRED, message: "Post ID is required" } }
    }

    // Sign the post if it's enabled
    let signature: string | null = null
    if (formData.signedWithGPG) {
        signature = await signText(formData.content)
    }

    console.log(formData)

    // Then update with new categories and other data
    const post = await prisma.post.update({
        where: { id: formData.id },
        data: {
            status: PostStatus.PUBLISHED,
            signature: signature,
            slug: slugify(formData.title.trim(), { lower: true, strict: true }),
            author: { connect: { id: formData.author } },
            categories: {
                set: formData.categories.map(category => ({ name: category }))
            }
        },
        include: {
            categories: true,
            author: true
        }
    })

    if (!post) {
        return { error: { code: SpaceErrorCode.POST_PUBLISH_FAILED, message: "Post publish failed" } }
    }

    return { success: true, post: post }
}

export async function unpublishPost(id: string) {
    const accessToken = await getSpacerToken()
    if (!accessToken) {
        return { error: { code: SpaceErrorCode.ACCESS_TOKEN_REQUIRED, message: "Access token is required" } }
    }

    const post = await prisma.post.update({
        where: { id },
        data: { status: PostStatus.UNPUBLISHED }
    })

    if (!post) {
        return { error: { code: SpaceErrorCode.POST_UNPUBLISH_FAILED, message: "Post unpublish failed" } }
    }

    return { success: true, post: post }
}
