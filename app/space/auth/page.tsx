'use client';

import { useState } from 'react';
import { login, register } from './actions';
import { errorMessages, AuthErrorCode, type AuthResponse } from '../../../errors/auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SpaceAuth() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            let response: AuthResponse;

            if (isLogin) {
                response = await login(
                    formData.get('email') as string,
                    formData.get('password') as string
                );
            } else {
                response = await register(
                    formData.get('email') as string,
                    formData.get('name') as string,
                    formData.get('gpgSignature') as string,
                    formData.get('password') as string
                );
            }

            if (response.success) {
                router.replace('/space');
            } else if (response.error) {
                const message = errorMessages['ar'][response.error.code];
                toast.error(message || response.error.message);
            }
        } catch (error) {
            toast.error(errorMessages['ar'][AuthErrorCode.UNKNOWN_ERROR]);
            console.error('Auth error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center" dir="rtl">
            <div className="max-w-md w-full space-y-8 p-8 border-2 border-gray-300 shadow-sm rounded-3xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        {isLogin ? 'تسجيل الدخول' : 'انشاء حساب جديد'}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-full shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">البريد الالكتروني</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                disabled={isLoading}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                                         border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md 
                                         focus:outline-none focus:ring-indigo-500 focus:border-gray-500 
                                         focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="البريد الالكتروني"
                            />
                        </div>
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="name" className="sr-only">الاسم الكامل</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        disabled={isLoading}
                                        className="appearance-none rounded-none relative block w-full px-3 
                                               py-2 border border-gray-300 placeholder-gray-500 text-gray-900 
                                               focus:outline-none focus:ring-indigo-500 focus:border-gray-500 
                                               focus:z-10 sm:text-sm disabled:bg-gray-100"
                                        placeholder="الاسم الكامل"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="gpgSignature" className="sr-only">GPG Signature</label>
                                    <textarea
                                        id="gpgSignature"
                                        name="gpgSignature"
                                        required
                                        disabled={isLoading}
                                        className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                                                border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none 
                                                focus:ring-indigo-500 focus:border-gray-500 focus:z-10 sm:text-sm 
                                                disabled:bg-gray-100"
                                        placeholder={`أدخل توقيع GPG لبريدك الإلكتروني باستخدام مفتاح الRoot
مثال:
-----BEGIN PGP SIGNED MESSAGE-----
Hash: SHA256

example@example.com
-----BEGIN PGP SIGNATURE-----

(....)
-----END PGP SIGNATURE-----`}
                                        rows={10}
                                        style={{ height: 'auto' }}
                                    />
                                </div>
                            </>
                        )}
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">كلمة المرور</label>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                disabled={isLoading}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border 
                                         border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md 
                                         focus:outline-none focus:ring-indigo-500 focus:border-gray-500 
                                         focus:z-10 sm:text-sm disabled:bg-gray-100"
                                placeholder="كلمة المرور"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 left-0 pl-3 flex items-center"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                                   text-sm font-medium rounded-md text-white bg-black hover:bg-gray-700 
                                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                                   disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span>جاري التحميل...</span>
                            ) : (
                                <span>{isLogin ? 'تسجيل الدخول' : 'انشاء حساب جديد'}</span>
                            )}
                        </button>
                    </div>
                </form>

                <div className="text-sm text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        disabled={isLoading}
                        className="font-medium text-black hover:text-gray-700 disabled:text-gray-400"
                    >
                        {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب؟'}
                    </button>
                </div>
            </div>

            <div style={{ display: "none" }} id="hidden-message">
                We seeks three craftsmen for a painting job.
                No work in the Middle East or Russia, but opportunities exist elsewhere.

                * One with height and strength.
                * One quick on their feet.
                * One who ensures nothing is left behind.

                Bills are covered. Complete the job and return home. Avoid wet floors.
                To sign the ledger, follow where ‘w’ meets itself at a slasher line.
            </div>
        </main>
    );
}