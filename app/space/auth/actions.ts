'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import { AuthErrorCode } from '@/errors/auth';
import { createSpacerToken } from '@/lib/token';
import { cookies } from 'next/headers';
import { verifySignature } from '@/lib/gpg';
import { LoginRequest, RegisterRequest, AuthResponse } from '@/interfaces/space/auth';
import prisma from '@/lib/prisma';
// Validation schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    gpgSignature: z.string().min(1, 'GPG signature is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});


export async function login({ email, password }: LoginRequest): Promise<AuthResponse> {
    try {
        console.log('Starting login process for:', email);
        
        // Validate input
        const validatedData = loginSchema.parse({ email, password });
        console.log('Validated login data:', validatedData);

        console.log('Login attempt:', validatedData.email);
        const user = await prisma.user.findUnique({
            where: {
                email: validatedData.email,
            },
        });

        if (!user) {
            return {
                success: false,
                error: {
                    code: AuthErrorCode.INVALID_CREDENTIALS,
                    message: 'Invalid credentials'
                }
            };
        }
       
        const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
        if (!isValidPassword) {
            return {
                success: false,
                error: {
                    code: AuthErrorCode.INVALID_CREDENTIALS,
                    message: 'Invalid credentials'
                }
            };
        }


        // Create JWT cookie with (email and name)
        const token = createSpacerToken({ email: validatedData.email, name: user.name, id: user.id });
        
        (await cookies()).set('spacer_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        console.log('Spacer token set successfully');
       
        return {
            success: true,
            data: { email: validatedData.email }
        };
    } catch (error) {
        console.log('Error during login:', error);
        if (error instanceof z.ZodError) {
            const zodError = error.errors[0];
            console.log('Zod validation error:', zodError);
            if (zodError.path[0] === 'email') {
                return {
                    success: false,
                    error: {
                        code: AuthErrorCode.INVALID_EMAIL,
                        message: zodError.message
                    }
                };
            }
            if (zodError.path[0] === 'password') {
                return {
                    success: false,
                    error: {
                        code: AuthErrorCode.INVALID_PASSWORD,
                        message: zodError.message
                    }
                };
            }
        }

        return {
            success: false,
            error: {
                code: AuthErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred'
            }
        };
    }
}

export async function register({ email, name, gpgSignature, password }: RegisterRequest): Promise<AuthResponse> {
    try {
        console.log('Starting registration process for:', email);
        // Validate input
        const validatedData = registerSchema.parse({
            email,
            name,
            gpgSignature,
            password,
        });
        console.log('Validated registration data:', validatedData);

        console.log('Registration attempt:', validatedData.email);

        // Check if the email is already in use
        const existingUser = await prisma.user.findUnique({
            where: {
                email: validatedData.email,
            },
        });
        console.log('Existing user check result:', existingUser);

        if (existingUser) {
            console.log('Email already in use:', validatedData.email);
            return {
                success: false,
                error: {
                    code: AuthErrorCode.EMAIL_IN_USE,
                    message: 'Email already in use'
                }
            };
        }

        // Validate the gpg signature
        if (!process.env.GPG_PUBLIC_KEY_PATH) {
            console.log('GPG public key path not found in environment variables');
            return {
                success: false,
                error: {
                    code: AuthErrorCode.GPG_KEY_NOT_FOUND,
                    message: 'GPG public key not found'
                }
            };
        }

        const signatureData = await verifySignature(validatedData.gpgSignature)

        if (!signatureData){
            return {
                success: false,
                error: {
                    code: AuthErrorCode.GPG_SIGNATURE_MISMATCH,
                    message: 'Signature verification failed'
                }
            };
        }

        // Check the message for if the email does not match the email in the validated data
        if (signatureData.data !== validatedData.email) {
            console.log('GPG signature mismatch for email:', validatedData.email);
            return {
                success: false,
                error: {
                    code: AuthErrorCode.GPG_SIGNATURE_MISMATCH,
                    message: 'Email does not match the email in the signature'
                }
            };
        }


        // Hash password using bun run-time
        const hashedPassword = await bcrypt.hash(validatedData.password, 10);
        console.log('Password hashed successfully');

        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                name: validatedData.name,
                password: hashedPassword,
                RegisterGPGKeyId: signatureData.signatures[0].keyID.toHex(),
            }
        });

        if (!user) {
            console.log('User creation failed');
            return {
                success: false,
                error: {
                    code: AuthErrorCode.USER_CREATION_FAILED,
                    message: 'User creation failed'
                }
            };
        }

        console.log('User created successfully:', user);

        // Create JWT cookie with (email and name)
        const token = createSpacerToken({ email: validatedData.email, name: validatedData.name, id: user.id });

        /* 
            Set the cookie | I hate the await here. I mean, await for what!?!?!?!?!?!??! :/ 
            Everything in the ECMAScript world is async. The language is slow, so we solve 
            this by awaiting everything. Okay, but imagine I don’t *want* to await! Is there a sync 
            option??? Like, fine, I get it, cookies can be up to 16 KB, and reading that much 
            data synchronously might overwhelm the system. But right now, I don’t care about that! 
            I want it to sync and *sink*. For god’s sake, man, block the main thread! IDC! 
            I’m the only one who will ever auth into this system. WHY SHOULD I DO "(await cookies())"? 
            Why do I need to use magic for simple things? WHYYYYYY!!!!
        
            I swear, if this Next.js framework wasn’t an industry trend and required by the market, 
            I would never touch ECMAScript (JavaScript/TypeScript) again. I’m so sick of this async 
            nonsense. I want to do things synchronously when I want to and block the main thread. 
            I’ll use THREAD or ASYNC when I actually need to!
        
            Async is great when I need to avoid blocking the main thread, but I don’t want to 
            await for *everything*. This is what I’d call overuse or misuse. Think about it—when you 
            use await, you’re pushing the function into a queue and then waiting for its state to 
            change to "RESOLVED/FINISHED." In a sense, we’re pausing (BLOCKING) the execution 
            of this instance of the function. All this async machinery for what? ~62 BYTES?! 
            We could read those ~62 bytes synchronously, quickly, and no one would care.
            Yeah If I was a multi-billion dollar company I would use async for my bloatware cookies
            like "google level" cookies of trackers and shit, but not I'm bot I'm a simple guy
            who wants a sync function to access cookies to portect his simple blog site.
        
            All love,
            #V0ID ;)

            ---------------------------------------------------------------

            Please if there is something alternative to this, please let me know.
            - x.com/v0id_user
            - hey@v0id.me
            Hit me up where ever you want, I'm all ears :)
        */
        (await cookies()).set('spacer_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: '/',
        });

        console.log('Spacer token set successfully');

        return {
            success: true,
            data: { email: validatedData.email }
        };
    } catch (error) {
        console.log('Error during registration:', error);
        if (error instanceof z.ZodError) {
            const zodError = error.errors[0];
            console.log('Zod validation error:', zodError);
            const errorMap: Record<string, AuthErrorCode> = {
                email: AuthErrorCode.INVALID_EMAIL,
                name: AuthErrorCode.INVALID_NAME,
                gpgSignature: AuthErrorCode.INVALID_GPG_SIGNATURE,
                password: AuthErrorCode.INVALID_PASSWORD
            };

            const errorCode = errorMap[zodError.path[0] as string] || AuthErrorCode.UNKNOWN_ERROR;

            return {
                success: false,
                error: {
                    code: errorCode,
                    message: zodError.message
                }
            };
        }

        return {
            success: false,
            error: {
                code: AuthErrorCode.UNKNOWN_ERROR,
                message: 'An unexpected error occurred'
            }
        };
    }
}
