import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'

interface SpacerTokenPayload extends JWTPayload {
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

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(who.value, secret);
        
        // Validate the payload has the required properties
        if (!payload.email || !payload.name || !payload.id || 
            typeof payload.email !== 'string' || 
            typeof payload.name !== 'string' || 
            typeof payload.id !== 'string') {
            throw new Error("Invalid token payload");
        }
        
        return payload as SpacerTokenPayload;
    } catch (error) {
        console.error("Error verifying token:", error);
        return null;
    }
}

export async function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || ''
    const subdomainMap: Record<string, string> = {
        'gpg.': '/gpg',
        'cv.': '/cv',
        'tree.': '/tree',
    };

    for (const [subdomain, path] of Object.entries(subdomainMap)) {
        if (hostname.startsWith(subdomain)) {
            return NextResponse.rewrite(new URL(path, request.url));
        }
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