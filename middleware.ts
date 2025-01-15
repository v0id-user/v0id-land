import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
/*
To solve
Error: The Edge Function "middleware" is referencing unsupported modules:
	- __vc__ns__/0/middleware.js: @/lib/token
---
Duplication for @/lib/token? Blame vercel >:( !
*/

import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

interface SpacerTokenPayload {
    email: string
    name: string
    id: string
}


const getSpacerToken = async () => {
    try {
        const cookie = await cookies()
        const who = cookie.get("spacer_token")

        if (!who) {
            return null;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set");
        }

        const token = verify(who.value, process.env.JWT_SECRET) as SpacerTokenPayload;

        return token;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''

    // Check if it's a GPG subdomain request
    const isGpgSubdomain = hostname.startsWith('gpg.')

    if (isGpgSubdomain) {
        // Rewrite the URL to the GPG page
        return NextResponse.rewrite(new URL('/gpg', request.url))
    }

    // Check if it's a CV subdomain request
    const isCvSubdomain = hostname.startsWith('cv.')
    if (isCvSubdomain) {
        return NextResponse.rewrite(new URL('/cv', request.url))
    }

    // Check API routes
    const isApiRoute = request.url.startsWith('/api/blog/draft')
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