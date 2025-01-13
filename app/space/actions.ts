'use server'

import { PostStatus, PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import slugify from "slugify"
import { SpaceErrorCode, type SpaceResponse } from "@/errors/posts"
import * as openpgp from 'openpgp'
import fs from 'fs/promises'

const prisma = new PrismaClient()

export interface CreatePostFormData {
    title: string
    content: string
    signedWithGPG: boolean
    workbar: boolean
    categories: string[]
    author: string
}

export async function publishPost(formData: CreatePostFormData) {
   //
} 