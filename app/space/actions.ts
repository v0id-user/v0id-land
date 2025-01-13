'use server'

import { PostStatus, PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import slugify from "slugify"
import { SpaceErrorCode, type SpaceResponse } from "@/errors/posts"
import * as openpgp from 'openpgp'
import fs from 'fs/promises'

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
    We assume that the post is already in the database as a draft
    so we just need to update the status to published and append the
    slug and categories to the post, also sign it if it's enabled.
     */

    if (!formData.id) {
        return { error: { code: SpaceErrorCode.POST_ID_REQUIRED, message: "Post ID is required" } }
    }
    let signature: string | null = null
    if (formData.signedWithGPG){
        
    }

    const post = await prisma.post.update({
        where: { id: formData.id },
        data: { 
            status: PostStatus.PUBLISHED 
        }
    })
} 