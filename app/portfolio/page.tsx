"use client";

import { Project, projects } from "./projects";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import BackToMain from "@/components/BackToMain";

export default function Portfolio() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Group projects by year for better organization
    const projectsByYear = projects.reduce((acc: Record<string, Project[]>, project: Project) => {
        const year = project.date.split(" ")[1];
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(project);
        return acc;
    }, {});

    // Sort years in descending order
    const sortedYears = Object.keys(projectsByYear).sort((a, b) => Number(b) - Number(a));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-background py-8 px-4 sm:py-12 sm:px-6 lg:px-8"
        >
            <div className="max-w-5xl mx-auto">
                <BackToMain />

                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">معرض أعمالي ورحلتي التقنية</h1>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground px-2">
                        جميع المشاريع التي أنجزتها والتي تعكس رحلتي التقنية
                    </p>
                </div>

                <div className="space-y-12 sm:space-y-16">
                    {sortedYears.map((year) => (
                        <div key={year} className="relative">
                            <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-2 sm:py-3 mb-6 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold">{year}</h2>
                            </div>
                            <div className="space-y-6 sm:space-y-8">
                                {projectsByYear[year].map((project: Project) => (
                                    <div
                                        key={project.name}
                                        className={`group relative bg-card rounded-lg p-4 sm:p-6 transition-all duration-300 ${!isMobile ? 'hover:shadow-lg' : ''}`}
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                                            <div className="space-y-2 sm:space-y-3 flex-grow">
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <h3 className="text-lg sm:text-xl font-medium">{project.name}</h3>
                                                    <Link
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        className="text-muted-foreground hover:text-foreground transition-colors"
                                                    >
                                                        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                        </svg>
                                                    </Link>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-foreground">{project.description}</p>
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                                    {project.technologies.map((tech: string) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="secondary"
                                                            className="text-[10px] sm:text-xs"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap sm:ml-4">
                                                {project.date}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}