import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSpacerToken } from '@/lib/token'

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''

    // Check if it's a GPG subdomain request
    const isGpgSubdomain = hostname.startsWith('gpg.')

    if (isGpgSubdomain) {
        // Rewrite the URL to the GPG page
        return NextResponse.rewrite(new URL('/gpg', request.url))
    }

    // Check API routes
    const isApiRoute = request.url.startsWith('/api')
    if (isApiRoute && request.method === 'POST') {
        const token = await getSpacerToken();
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.next()
    }

    return NextResponse.next()
}

// Configure matcher for the middleware
export const config = {
    matcher: [
        /*
         * Match all paths except for:
         * 1. /api (API routes)
         * 2. /_next (Next.js internals)
         * 3. /_static (static files)
         * 4. /_vercel (Vercel internals)
         * 5. Static files (favicon.ico, robots.txt, etc.)
         */
        '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
    ],
} 