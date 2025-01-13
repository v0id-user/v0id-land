import 'server-only'
import { sign, verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'

export interface SpacerTokenPayload {
    email: string
    name: string
    id: string
}

export const createSpacerToken = (payload: SpacerTokenPayload) => {
    return sign(payload, process.env.JWT_SECRET!, { expiresIn: '30d' })
}

export const verifyToken = (token: string) => {
    return verify(token, process.env.JWT_SECRET!)
}

export const getSpacerToken = async () => {
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