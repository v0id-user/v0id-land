"use client"
import { languages, frameworks, databases, tools, libraries, cloudServices } from "@/app/about/expertise";
import Link from "next/link";

export default function CV() {
    return (
        <>
            <div className="max-w-[21cm] mx-auto p-4 bg-white print:p-3 font-serif">
                {/* Header Section */}
                <header className="mb-3">
                    <h1 className="text-xl font-bold mb-1 border-b border-gray-300 pb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Curriculum Vitae</h1>
                    <div className="text-gray-800 text-left leading-tight grid grid-cols-2">
                        <div>
                            <p>Fahad Alghamdi</p>
                            <p>Email: hey@v0id.me</p>
                        </div>
                        <div>
                            <p>GitHub: github.com/v0id-user</p>
                            <p>X: x.com/v0id_user</p>
                        </div>
                    </div>
                </header>

                {/* Profile Section */}
                <section className="mb-3">
                    <h2 className="text-base font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Professional Summary</h2>
                    <p className="text-gray-800 leading-snug text-sm">
                        Software developer since late 2020 with 4 years of experience in software development and technical problem-solving.
                        Currently pursuing university studies.
                    </p>
                </section>

                {/* Professional Experience Timeline */}
                <section className="mb-3">
                    <h2 className="text-base font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Projects & Professional Development</h2>
                    <div className="space-y-2">
                        <div>
                            <h3 className="font-bold text-sm">Mid 2024 - Present</h3>
                            <p className="text-gray-800 text-sm pl-3">
                                Developing a modular full-stack system, focusing on scalability, microservices architecture, and high-performance back-end development. Technologies used: Next.js, NestJS, PostgreSQL, Prisma, and Docker.
                                • Designed a shared library for efficient API communication • Implemented authentication, caching mechanisms, and automated CI/CD pipelines • Structured a well-organized monorepo to manage multiple services efficiently
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Late 2023 - Early 2024</h3>
                            <p className="text-gray-800 text-sm pl-3">
                                Worked on PMPS (Process Memory Pattern Scanner), a Windows-based tool for scanning process memory using C, Windows API, and regex matching.
                                • Implemented low-level memory scanning techniques • Utilized Windows API for deep process inspection • Experimented with pattern recognition algorithms for security analysis
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Early 2022 - Mid 2023</h3>
                            <p className="text-gray-800 text-sm pl-3">
                                Built various low-level networking and system programming projects: • DFTP (Custom FTP Protocol in C) → Developed a binary data serialization system
                                • HttpServer (Custom C HTTP Server) → Implemented a lightweight web server using hashmaps • Postgres-Reactive-SSE → Created a real-time system using PostgreSQL&apos;s NOTIFY/LISTEN
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Late 2020 - Late 2021</h3>
                            <p className="text-gray-800 text-sm pl-3">
                                Focused on automation, scripting, and reverse engineering: • Developed multiple automation bots using Python • Created network tools and security experiments
                                • Built a basic echo server in Assembly to experiment with low-level networking
                            </p>
                        </div>
                    </div>
                </section>

                {/* Technical Skills Section */}
                <section className="mb-3">
                    <h2 className="text-base font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Technical Skills</h2>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                        <div>
                            <h3 className="font-bold">Programming Languages:</h3>
                            <p className="text-gray-800">{languages.map(language => language.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Frameworks & Libraries:</h3>
                            <p className="text-gray-800">Frameworks: {frameworks.map(framework => framework.name).join(', ')} | Libraries: {libraries.map(library => library.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Databases:</h3>
                            <p className="text-gray-800">{databases.map(database => database.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Cloud Services:</h3>
                            <p className="text-gray-800">{cloudServices.map(cloudService => cloudService.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold">Tools:</h3>
                            <p className="text-gray-800">{tools.map(tool => tool.name).join(', ')}</p>
                        </div>
                    </div>
                </section>

                {/* Certifications Section */}
                <section className="mb-3">
                    <h2 className="text-base font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Certifications</h2>
                    <div className="text-gray-800 text-sm grid grid-cols-2 gap-x-3">
                        <div>
                            <p>• Meta Back-End Developer Certificate – Meta, Coursera (Feb 2025)</p>
                            <p>• Meta Full-Stack Development – Meta (Feb 2025)</p>
                            <p>• Meta APIs & Django Specialization – Meta (Feb 2025)</p>
                        </div>
                        <div>
                            <p>• Meta Coding Interview Preparation – Meta (Feb 2025)</p>
                            <p>• Version Control & CI/CD with GitHub – Meta (Jan 2025)</p>
                        </div>
                    </div>
                </section>

                {/* Education Section */}
                <section>
                    <h2 className="text-base font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Education</h2>
                    <div className="text-gray-800 text-sm">
                        <p className="font-bold">King Abdulaziz University, Saudi Arabia</p>
                        <p>Bachelor&apos;s Degree in Hospital Management (Business Administration) | Expected Graduation: 2026</p>
                        <p className="text-gray-700">While studying business, I pursued an extensive self-learning journey in software development, focusing on system programming, full-stack development, and networking.</p>
                    </div>
                </section>

                {/* Print Styles */}
                <style jsx global>{`
                .stroke {
                    text-decoration: line-through;
                }
                @media print {
                    @page {
                        margin: 0.5cm;
                        size: A4;
                    }
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                        font-family: 'Times New Roman', Times, serif;
                    }
                    .print\\:p-3 {
                        padding: 0.75rem;
                    }
                    .custom-cursor {
                        display: none !important;
                    }
                    * {
                        cursor: default !important;
                    }
                }
            `}</style>
            </div>
            <div className="print:hidden flex flex-col items-center">
                <p>This is a print version of my CV. Press CTRL+P (⌘+P on Mac) to print it.</p>
                <br />
                <hr className="my-2 w-full border-gray-300" />
                <p>Visit my website:</p>
                <Link href="https://v0id.me" className="text-blue-500 underline">v0id.me</Link>
                <br />
                <p className="text-gray-600 text-xs">copyright © {new Date().getFullYear()} #V0ID</p>
            </div>
        </>
    );
}