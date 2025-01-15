"use client"

import { Badge } from "@/components/ui/badge";
import WorkBar from "@/components/WorkBar";
import { motion } from "motion/react";
import Link from "next/link";
import { languages, frameworks, databases, tools, TechInfo, libraries, lifeTools, cloudServices } from "./expertise";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";

interface TooltipProps {
    content: string;
    isVisible: boolean;
    isTouchDevice: boolean;
    onClose?: () => void;
}

function Tooltip({ content, isVisible, isTouchDevice, onClose }: TooltipProps) {
    if (isTouchDevice) {
        return isVisible ? (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-gray-900 text-white p-6 rounded-lg max-w-[80%] relative">
                    <button 
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white hover:text-gray-300"
                    >
                        ✕
                    </button>
                    <p className="mt-4 text-sm">
                        {content}
                    </p>
                </div>
            </div>
        ) : null;
    }

    return (
        <span className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-[calc(100%+1rem)]
                       px-3 py-2 bg-gray-900 text-white text-xs rounded-md
                       transition-opacity duration-200 w-48 
                       text-center pointer-events-none z-50 whitespace-normal
                       after:content-[''] after:absolute after:left-1/2 after:bottom-[-0.5rem]
                       after:w-0 after:h-0 after:-translate-x-1/2
                       after:border-l-[6px] after:border-l-transparent
                       after:border-r-[6px] after:border-r-transparent
                       after:border-t-[6px] after:border-t-gray-900
                       opacity-0 group-hover:opacity-100`}>
            {content}
        </span>
    );
}

interface TechBadgeProps {
    tech: TechInfo;
    isActive: boolean;
    isTouchDevice: boolean;
    onInteraction: (techName: string) => void;
}

function TechBadge({ tech, isActive, isTouchDevice, onInteraction }: TechBadgeProps) {
    const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
        if (isTouchDevice) {
            e.preventDefault();
            onInteraction(tech.name);
        }
    };

    return (
        <Link href={tech.url} target="_blank" rel="noopener noreferrer" 
              onClick={isTouchDevice ? handleInteraction : undefined}>
            <Badge 
                className={`text-sm px-4 py-1 font-light ${tech.color} text-white 
                           cursor-pointer transition-all duration-200
                           group relative inline-block
                           ${isTouchDevice ? 'hover:no-underline' : 'hover:underline'}`}
                onClick={handleInteraction}
            >
                {tech.name}
                <Tooltip 
                    content={tech.description}
                    isVisible={isActive}
                    isTouchDevice={isTouchDevice}
                    onClose={() => onInteraction(tech.name)}
                />
            </Badge>
        </Link>
    );
}

function Expertise() {
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

    useEffect(() => {
        setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const handleBadgeInteraction = (techName: string) => {
        setActiveTooltip(activeTooltip === techName ? null : techName);
    };

    return (
        <>
            <label className="text-gray-500 text-sm text-right">
                {isTouchDevice ? 
                    "(اضغط على كل شارة لرؤية المزيد)" : 
                    "(حرك المؤشر فوق كل شارة لرؤية المزيد)"}
            </label>
            <div className="flex flex-wrap gap-2 justify-start">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">اللغات</h3>
                {languages.map((lang) => (
                    <TechBadge 
                        key={lang.name} 
                        tech={lang}
                        isActive={activeTooltip === lang.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">المكتبات</h3>
                {libraries.map((lib) => (
                    <TechBadge 
                        key={lib.name} 
                        tech={lib}
                        isActive={activeTooltip === lib.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">فريم ووركس</h3>
                {frameworks.map((framework) => (
                    <TechBadge 
                        key={framework.name} 
                        tech={framework}
                        isActive={activeTooltip === framework.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">الخدمات السحابية</h3>
                {cloudServices.map((cloud) => (
                    <TechBadge 
                        key={cloud.name} 
                        tech={cloud}
                        isActive={activeTooltip === cloud.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))} 
            </div>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">قواعد البيانات</h3>
                {databases.map((db) => (
                    <TechBadge 
                        key={db.name} 
                        tech={db}
                        isActive={activeTooltip === db.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">الأدوات التقنية</h3>
                {tools.map((tool) => (
                    <TechBadge 
                        key={tool.name} 
                        tech={tool}
                        isActive={activeTooltip === tool.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 justify-start mt-4">
                <h3 className="font-semibold text-md sm:text-lg mb-2 w-full">البرامج</h3>
                {lifeTools.map((tool) => (
                    <TechBadge 
                        key={tool.name} 
                        tech={tool}
                        isActive={activeTooltip === tool.name}
                        isTouchDevice={isTouchDevice}
                        onInteraction={handleBadgeInteraction}
                    />
                ))}
            </div>
        </>
    )
}

export default function About() {
    return (
        <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
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
                            <h2 className="font-semibold text-lg sm:text-xl mb-3">أبرز التقنيات التي أستخدمها</h2>
                            <Expertise />
                        </div>

                        <div className="p-4 sm:p-6">
                            <h2 className="font-semibold text-lg sm:text-xl mb-3">بعض مشاريعي</h2>
                            <ul className="space-y-2 text-gray-700">
                                <li>• تطوير Custom Async Runtime باستخدام لغة <strong>C</strong></li>
                                <li>• بناء Realtime Reactive Systems باستخدام <strong>PostgreSQL</strong> و<strong>SSE</strong></li>
                                <li>• تطوير تطبيقات ويب وموبايل وسطح المكتب</li>
                                <li>• تصميم واجهات مستخدم باستخدام <strong>Figma</strong></li>
                            </ul>
                        </div>

                        <div className="p-4 sm:p-6">
                            <h1 className="font-semibold text-lg sm:text-xl mb-3">التواصل معي</h1>
                            <p className="text-gray-700">
                                لمشاهدة المزيد من أعمالي يمكنك زيارة حسابي على GitHub
                            </p>
                            <p className="text-gray-700">
                                github.com/v0id-user
                            </p>
                            <p className="text-gray-700 mt-4">
                                للتواصل والمتابعة:
                            </p>
                            <p className="text-gray-700">
                                البريد الإلكتروني: hey@v0id.me
                            </p>
                            <p className="text-gray-700">
                                اكس: x.com/v0id_user
                            </p>
                        </div>

                        <div className="flex flex-col items-center gap-5 pt-6">
                            <WorkBar />
                        </div>

                        <Footer />
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
