import * as openpgp from 'openpgp'
import fs from 'fs/promises'

export async function getPublicKey(): Promise<{ public_key: string, lastModified: string }> {
    if (!process.env.GPG_PUBLIC_KEY_PATH) {
        throw new Error("GPG_PUBLIC_KEY_PATH environment variable is not set");
    }

    const public_key = await fs.readFile(process.env.GPG_PUBLIC_KEY_PATH, "utf-8");
    const stats = await fs.stat(process.env.GPG_PUBLIC_KEY_PATH);
    return { public_key, lastModified: stats.mtime.toLocaleDateString() }
}

export async function getPrivateKey(): Promise<string> {
    if (!process.env.GPG_PRIVATE_KEY_PATH) {
        throw new Error("GPG_PRIVATE_KEY_PATH environment variable is not set");
    }

    const private_key = await fs.readFile(process.env.GPG_PRIVATE_KEY_PATH, "utf-8");
    return private_key
}

export async function verifySignature(signature: string): Promise<openpgp.VerifyMessageResult<string> | null> {
    const { public_key } = await getPublicKey()

    // Convert to opengpg key object
    let gpgPk;
    try {
        // Load the public key into a opengpg key object
        gpgPk = await openpgp.readKey({
            armoredKey: public_key,
        });
    } catch (error) {
        console.log('Error loading public key:', error);
        return null
    }
    let gpgSm;

    // Convert signature to opengpg key object
    try {
        // Signature message
        gpgSm = await openpgp.readCleartextMessage({
            cleartextMessage: signature,
        });
        console.log('GPG signature loaded into OpenPGP object');
    } catch (error) {
        console.log('Error loading signature:', error);
        return null
    }
    // Verify the signature
    const verificationResult = await openpgp.verify({
        message: gpgSm,
        verificationKeys: gpgPk,
    });
    console.log('Signature verification result:', verificationResult.data);

    if (!verificationResult) {
        console.log('Signature verification failed');
        return null
    }

    if (await !verificationResult.signatures[0].verified) {
        console.log('Signature verification failed');
        return null
    }

    return verificationResult
}

export async function signText(text: string): Promise<string | null> {
    // Load private key
    const private_key = await getPrivateKey()

    // Convert private key to opengpg key object
    let gpgSk;
    try {
        gpgSk = await openpgp.readPrivateKey({
            armoredKey: private_key,
        });
    } catch (error) {
        console.log('Error loading private key:', error);
        return null
    }

    // Create a message object
    const unsignedMessage = await openpgp.createCleartextMessage({
        text: text
    })

    // Sign the post and create a signature object
    const signature = await openpgp.sign({
        message: unsignedMessage,
        signingKeys: gpgSk,
    });

    return signature
}

