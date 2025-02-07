'use client';

import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function Footer() {
    const [year, setYear] = useState<number>();

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <div className="flex flex-col gap-2 items-center justify-center w-full">
            <motion.footer
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 1
                }}
                className="text-center text-sm text-gray-500"
            >
                جميع الحقوق محفوظة © {year} #V0ID
            </motion.footer>
        </div>
    )
}