import { PostStatus } from "@prisma/client"

export interface BlogPostRequest {
    id: string
    title: string
    content: string
    slug: string
    status: PostStatus
    categories: string[]
    author: string
}

export interface BlogPostResponse {
    id: string
    title: string
    content: string
    slug: string
    status: PostStatus
    categories: string[]
    author: string
}   
