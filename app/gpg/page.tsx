import fs from 'fs/promises';

export default async function GPG() {
    if (!process.env.GPG_PUBLIC_KEY_PATH) {
        throw new Error("GPG_PUBLIC_KEY_PATH environment variable is not set");
    }

    const public_key = await fs.readFile(process.env.GPG_PUBLIC_KEY_PATH, "utf-8");
    const stats = await fs.stat(process.env.GPG_PUBLIC_KEY_PATH);

    const lastModified = stats.mtime.toLocaleDateString();

    return (
        <>
            <main>
                <h1 className="text-black font-mono">#V0ID GPG Public Key</h1>
                <p className="text-black font-mono mb-4">Last Modified: {lastModified}</p>
                <pre className="text-black font-mono">{public_key}</pre>
            </main>
        </>
    )
}