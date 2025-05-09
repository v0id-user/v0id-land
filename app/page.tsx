"use client"

import Link from "next/link";
import WorkBar from "@/components/WorkBar";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem('hasVisitedBefore');

    if (!hasVisited) {
      localStorage.setItem('hasVisitedBefore', 'true');
      setIsFirstVisit(true);
    } else {
      setIsFirstVisit(false);
    }

    setIsLoaded(true);
  }, []);

  // Don't render animations until we know if it's first visit
  if (!isLoaded) return null;

  return (
    <main className="flex flex-col items-center pt-40 sm:pt-52 pb-24 sm:pb-24 min-h-screen gap-3">
      <div className="flex-1 flex flex-col items-center">
        <motion.h1
          initial={{ opacity: 0, y: isFirstVisit ? 250 : 0 }}
          animate={{
            opacity: isFirstVisit ? [0, 1, 1] /* Fade in and then hold */ : 1,
            y: isFirstVisit ? [100, 100, 0] /* Start below, hold, then move up */ : 0,
          }}
          transition={{
            duration: isFirstVisit ? 3 : 0.5,
            times: isFirstVisit ? [0, 0.5, 1] /* 0% (start), 50% (hold), 100% (move up) */ : null,
            ease: "easeInOut",
          }}
          className="text-4xl sm:text-5xl font-bold question-hover"
          onClick={() => {
            window.location.href = "/about";
          }}
        >
          #V0ID
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: isFirstVisit ? 3 : 0,
            duration: isFirstVisit ? 1 : 0.5
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-8">
            <Link className="text-base sm:text-lg hover:text-gray-600 transition-colors" href="/about">من أنا؟</Link>
            <Link className="text-base sm:text-lg hover:text-gray-600 transition-colors" href="/tree">تواصل معي</Link>
            <Link className="text-base sm:text-lg hover:text-gray-600 transition-colors" href="/portfolio">معرض الأعمال</Link>
            <Link className="text-base sm:text-lg hover:text-gray-600 transition-colors" href="/blog">المدونة</Link>
            <Link className="text-base sm:text-lg hover:text-gray-600 transition-colors" href="https://components.v0id.me/">المكونات</Link>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8 pt-8">
            <Link className="text-gray-600 hover:text-black transition-colors" href="https://x.com/v0id_user">
              اكس
            </Link>
            <Link referrerPolicy="no-referrer" target="_blank" className="text-gray-600 hover:text-black transition-colors" href="https://www.github.com/v0id-user">
              قيت هوب
            </Link>
          </div>
          <div className="pt-8 flex flex-col items-center gap-5">
            <WorkBar />
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-2 items-center justify-center w-full ">
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: isFirstVisit ? 3 : 0,
            duration: isFirstVisit ? 1 : 0.5
          }}
          className="text-center text-sm text-gray-500"
        >
          جميع الحقوق محفوظة © {new Date().getFullYear()} #V0ID
        </motion.footer>
        <Image src="/logo.svg" alt="logo" width={28} height={28} />
      </div>

    </main>
  );
}
