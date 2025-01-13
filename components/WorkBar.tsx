"use client"

import { motion } from "framer-motion"
import Link from "next/link";

export default function WorkBar() {
    return (
        <>
            <div className="relative w-[200px] xs:w-[225px] sm:w-[250px] md:w-[275px] h-[50px] p-[2px] from-[#FFFCF6] to-[#D7CCB8] rounded-full" dir="ltr">
                <motion.div
                    className="pointer-events-none absolute -inset-[1px] rounded-full"
                    style={{
                        background: `linear-gradient(90deg,
                            rgba(215, 204, 184, 0.5),
                            rgba(255, 252, 246, 0.8),
                            rgba(255,252,246,1),
                            rgba(255, 252, 246, 0.8),
                            rgba(215, 204, 184, 0.5))`,
                        backgroundSize: "200% 100%",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        padding: "1px"
                    }}
                    animate={{
                        backgroundPosition: ["0% 50%", "-200% 50%"]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
                <div className="flex items-center justify-between h-full bg-[#FFFCF6] rounded-full px-4">
                    <button 
                        className="w-[70px] xs:w-[80px] sm:w-[90px] md:w-[100px] h-[35px] bg-gradient-to-b from-[#FFFCF6] to-[#D7CCB8] rounded-full shadow-sm 
                                flex items-center justify-center hover:shadow-md transition-shadow duration-300 border border-[#E8E2D7] border-opacity-70"
                        role="button"
                    >
                        <Link href="https://cal.com/v0id-user/30min" className="text-xs sm:text-sm">احجز موعدك</Link>
                    </button>

                    <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm text-gray-600">متاح للعمل</p>
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="absolute top-0 left-0 w-2 h-2 bg-green-500 rounded-full animate-ping [animation-duration:2s]"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
