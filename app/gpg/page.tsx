import { getPublicKey } from '@/lib/gpg';   

export default async function GPG() {
    const {public_key} = await getPublicKey()

    return (
        <>
            <main>
                <h1 className="text-black font-mono">#V0ID GPG Public Key</h1>
                <pre className="text-black font-mono">{public_key}</pre>
            </main>
        </>
    )
}