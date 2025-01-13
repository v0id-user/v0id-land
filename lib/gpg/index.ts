import * as openpgp from 'openpgp'
import fs from 'fs/promises'
export async function getPublicKey(){
    if (!process.env.GPG_PUBLIC_KEY_PATH) {
        throw new Error("GPG_PUBLIC_KEY_PATH environment variable is not set");
    }

    const public_key = await fs.readFile(process.env.GPG_PUBLIC_KEY_PATH, "utf-8");
    const stats = await fs.stat(process.env.GPG_PUBLIC_KEY_PATH);
    return {public_key, lastModified: stats.mtime.toLocaleDateString()}
}


export async function signPost(postId: string): Promise<string | null> {
    // TODO: Implement GPG signing
    return null
}

