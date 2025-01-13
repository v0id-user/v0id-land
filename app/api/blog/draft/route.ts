import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"
import { BlogPostRequest, BlogPostResponse } from "@/interfaces/blog"

const prisma = new PrismaClient()

export async function POST(request: Request) {
    const  = await request.json() as BlogPostRequest
    


    return NextResponse.json(post)
}



export async function GET(request: Request) {
}
