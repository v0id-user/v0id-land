"use client"

import Link from "next/link";
import { getDomain } from 'tldts';
import { useEffect, useState } from 'react';

export default function BackToMain() {
    const [href, setHref] = useState('/');

    useEffect(() => {
        const hostname = window.location.hostname;
        const domain = getDomain(hostname) || hostname;
        setHref(`https://${domain}/`);
    }, []);

    return (
        <Link href={href} className="text-gray-600 hover:text-black transition-colors text-sm sm:text-base">← العودة للصفحة الرئيسية</Link>
    )
}