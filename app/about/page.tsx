"use client"

import { Badge } from "@/components/ui/badge";
import WorkBar from "@/components/WorkBar";
import { motion } from "motion/react";
import Link from "next/link";

export default function About() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }} // Fade in after <motion.h1> finishes
            >

                <div className="max-w-3xl mx-auto">
                    <Link href="/" className="text-gray-600 hover:text-black transition-colors text-sm sm:text-base">← العودة للصفحة الرئيسية</Link>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 mt-10">#V0ID</h1>

                    <div className="space-y-6 text-right" dir="rtl">
                        <div className="space-y-3">
                            <p className="text-base sm:text-lg text-gray-700">
                                السلام عليكم ورحمة الله وبركاته،
                            </p>

                            <p className="text-base sm:text-lg text-gray-700">
                                أنا <span className="font-semibold">فهد الغامدي</span>، معروف بـ <span className="font-semibold">#V0ID</span>
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <h2 className="font-semibold text-lg sm:text-xl mb-3">المسار المهني</h2>
                            <p className="text-gray-700">
                                مطور برمجيات منذ أواخر عام 2020 | 4 سنوات خبرة في تطوير البرمجيات وحل المشكلات التقنية
                            </p>
                        </div>

                        <div className="p-4 sm:p-6">
                            <h2 className="font-semibold text-lg sm:text-xl mb-3">التقنيات</h2>
                            <div className="flex flex-wrap gap-2 justify-start">
                                {["C", "Python", "Next.js", "React", "TypeScript", "Go", "Laravel"].map((tech) => (
                                    <Badge key={tech} className="text-base px-2 font-light">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 sm:p-6">
                            <h2 className="font-semibold text-lg sm:text-xl mb-3">بعض الإنجازات</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li>• تطوير Custom Async Runtime باستخدام لغة <strong>C</strong></li>
                                <li>• بناء Realtime Reactive Systems باستخدام <strong>PostgreSQL</strong> و<strong>SSE</strong></li>

                                <li>• تطوير تطبيقات ويب وموبايل وسطح المكتب</li>
                                <li>• تصميم واجهات مستخدم باستخدام <strong>Figma</strong></li>
                            </ul>
                        </div>

                        <div className="flex flex-col items-center gap-5 pt-6">
                            <WorkBar />
                        </div>

                        <footer
                            className="w-full text-center text-sm text-gray-500 pt-6"
                            dir="ltr"
                        >
                            جميع الحقوق محفوظة © {new Date().getFullYear()} #V0ID
                        </footer>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
