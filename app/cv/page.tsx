"use client"
import { languages, frameworks, databases, tools, libraries, cloudServices } from "@/app/about/expertise";
import Link from "next/link";

export default function CV() {
    return (
        <>
            <div className="max-w-[21cm] mx-auto p-6 bg-white print:p-4 font-serif">
                {/* Header Section */}
                <header className="mb-4">
                    <h1 className="text-2xl font-bold mb-2 border-b border-gray-300 pb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Curriculum Vitae</h1>
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
                <section className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Professional Summary</h2>
                    <p className="text-gray-800 leading-snug">
                        Software developer since late 2020 with 4 years of experience in software development and technical problem-solving.
                        Currently pursuing university studies.
                    </p>
                </section>

                {/* Professional Experience Timeline */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Projects & Professional Development</h2>
                    <div className="space-y-3">
                        <div>
                            <h3 className="font-bold text-sm">Mid 2024 - Present</h3>
                            <p className="text-gray-800 text-sm pl-4">
                                To be added...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Late 2023 - Early 2024</h3>
                            <p className="text-gray-800 text-sm pl-4">
                                To be added...
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Early 2022 - Mid 2023</h3>
                            <p className="text-gray-800 text-sm pl-4">
                            To be added...

                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Late 2020 - Late 2021</h3>
                            <p className="text-gray-800 text-sm pl-4">
                                To be added...
                            </p>
                        </div>
                    </div>
                </section>

                {/* Technical Skills Section */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Technical Skills</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                            <h3 className="font-bold text-sm">Programming Languages:</h3>
                            <p className="text-gray-800 text-sm">{languages.map(language => language.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Frameworks & Libraries:</h3>
                            <p className="text-gray-800 text-sm">Frameworks: {frameworks.map(framework => framework.name).join(', ')} | Libraries: {libraries.map(library => library.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Databases:</h3>
                            <p className="text-gray-800 text-sm">{databases.map(database => database.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Cloud Services:</h3>
                            <p className="text-gray-800 text-sm">{cloudServices.map(cloudService => cloudService.name).join(', ')}</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">Tools:</h3>
                            <p className="text-gray-800 text-sm">{tools.map(tool => tool.name).join(', ')}</p>
                        </div>
                    </div>
                </section>

                {/* Notable Projects Section */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Notable Projects</h2>
                    <ul className="list-disc list-inside text-gray-800 text-sm leading-snug pl-2">
                        <li className="stroke">Engineered and implemented a custom asynchronous runtime environment utilizing C, demonstrating advanced systems programming capabilities</li>
                        <li className="stroke">Architected real-time reactive systems leveraging PostgreSQL and Server-Sent Events (SSE), achieving robust data synchronization</li>
                        <li className="stroke">Developed cross-platform applications with emphasis on scalability and performance optimization</li>
                        <li className="stroke">Led UI/UX design initiatives utilizing industry-standard design tools and methodologies</li>
                    </ul>
                    <p className="text-gray-600 italic text-xs">To be polished more</p>
                    <p className="mt-1 text-gray-600 italic text-xs">
                        * Additional project details available on GitHub profile
                    </p>
                </section>

                {/* Certifications Section */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Certifications</h2>
                    <p className="text-gray-600 italic text-sm">Certifications to be added...</p>
                </section>

                {/* Education Section */}
                <section className="mb-4">
                    <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Education</h2>
                    <p className="text-gray-600 italic text-sm">
                        Certificates to be added...
                    </p>
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
                    .print\\:p-4 {
                        padding: 1rem;
                    }
                    /* Hide custom cursor when printing */
                    .custom-cursor {
                        display: none !important;
                    }
                    /* Restore default cursor behavior */
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