import { NextResponse } from "next/server"
import { getPost } from "@/lib/blog"

// /api/blog?id=123
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
        return NextResponse.json({ error: "No id provided" }, { status: 400 })
    }
    const draft = await getPost(id)
    return NextResponse.json(draft)
}   