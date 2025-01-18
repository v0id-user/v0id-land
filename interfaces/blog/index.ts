import { PostStatus, Category, Post } from "@prisma/client"
import { SafeUser } from "../user"

export interface BlogPostRequest {
    id?: string
    title?: string
    content?: string
    slug?: string
    status?: PostStatus
    signedWithGPG?: boolean
    includeWorkbar?: boolean
    categories?: string[]
    author: string
}

export interface BlogPostResponse {
    id: string
    title: string
    content: string
    slug: string
    status: PostStatus
    categories: Category[]
    author: string
    signedWithGPG: boolean
    workbar: boolean
}

export interface ExtendedPost extends Post {
    author: SafeUser;
    categories: { name: string }[];
}

export interface BlogCard {
    id: string
    title: string
    slug: string
    createdAt: string
    author: {
        name: string
    }
    categories: {
        name: string
    }[]
    signedWithGPG: boolean
}

export interface BlogsResponse {
    post: BlogCard
}