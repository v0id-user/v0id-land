"use client"

import Link from "next/link";
import { useState } from "react";

export default function TreePage() {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText("hey@v0id.me");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col items-center min-h-screen justify-center gap-4 p-4" dir="rtl">
            <Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm sm:text-base mb-6">
                العودة للصفحة الرئيسية ←
            </Link>
            
            <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                <h1 className="text-4xl font-bold mb-4">#V0ID</h1>
                <a href="https://x.com/v0id_user" className="w-full text-center p-3 hover:bg-gray-100 transition-colors rounded-lg">
                    اكس
                </a>
                <a href="https://github.com/v0id-user" className="w-full text-center p-3 hover:bg-gray-100 transition-colors rounded-lg">
                    قيت هب
                </a>
                <a href="https://reddit.com/u/v0id_user" className="w-full text-center p-3 hover:bg-gray-100 transition-colors rounded-lg">
                    ريديت
                </a>
                <button 
                    onClick={copyToClipboard}
                    className="w-full text-center p-3 hover:bg-gray-100 transition-colors rounded-lg relative"
                >
                    hey@v0id.me
                    {copied && (
                        <span className="absolute left-1/2 -translate-x-1/2 -top-10 bg-black text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            تم النسخ للحافظة
                        </span>
                    )}
                </button>
                <a href="https://gpg.v0id.me" className="w-full text-center p-3 hover:bg-gray-100 transition-colors rounded-lg">
                    مفتاح GPG العام
                </a>
            </div>
        </div>
    );
}