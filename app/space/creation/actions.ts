'use server'

import { PostStatus, PrismaClient } from "@prisma/client"
import { SpaceErrorCode, type SpaceResponse } from "@/errors/posts"
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
     *We assume that the post is already in the database as a draft
     *so we just need to update the status to published and append the
     *slug and categories to the post, also sign it if it's enabled.
    */

    if (!formData.id) {
        return { error: { code: SpaceErrorCode.POST_ID_REQUIRED, message: "Post ID is required" } }
    }

    // Sign the post if it's enabled
    let signature: string | null = null
    if (formData.signedWithGPG) {
        signature = await signText(formData.content)
    }

    // Create or get existing categories
    const normalizedCategories = [...new Set(formData.categories.map(cat => cat.toLowerCase()))];
    
    const categories = await Promise.all(
        normalizedCategories.map(async (category) => {
            const existingCategory = await prisma.category.findUnique({
                where: { name: category },
            });
            return existingCategory || await prisma.category.create({
                data: { name: category },
            });
        })
    );

    // First disconnect all existing categories
    await prisma.post.update({
        where: { id: formData.id },
        data: {
            categories: {
                set: [] // Clear existing categories
            }
        }
    });

    // Then update with new categories and other data
    const post = await prisma.post.update({
        where: { id: formData.id },
        data: {
            status: PostStatus.PUBLISHED,
            signature: signature,
            slug: slugify(formData.title, { lower: true, strict: true }),
            categories: { 
                connect: categories.map(category => ({ id: category.id })) 
            },
            author: { connect: { id: formData.author } },
        },
        include: {
            categories: true
        }
    })


    return { success: true, post: post }
} 