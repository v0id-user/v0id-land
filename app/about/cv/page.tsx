"use client"

export default function CV() {
    return (
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

            {/* Technical Skills Section */}
            <section className="mb-4">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Technical Skills</h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                        <h3 className="font-bold text-sm">Programming Languages:</h3>
                        <p className="text-gray-800 text-sm">C, Assembly, Python, Go, TypeScript, PHP</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Frameworks & Libraries:</h3>
                        <p className="text-gray-800 text-sm">React, Next.js, Laravel, Gin, Fiber, Prisma ORM</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Databases:</h3>
                        <p className="text-gray-800 text-sm">PostgreSQL, Redis</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Cloud Services:</h3>
                        <p className="text-gray-800 text-sm">Vercel, Railway, Fly.io, Cloudflare, Tigris</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Tools:</h3>
                        <p className="text-gray-800 text-sm">Git, Docker, VSCode, Figma, Notion, Hoppscotch</p>
                    </div>
                </div>
            </section>

            {/* Projects Section */}
            <section className="mb-4">
                <h2 className="text-lg font-bold border-b border-gray-300 mb-1" style={{ fontFamily: 'Times New Roman, serif' }}>Technical Projects</h2>
                <ul className="list-disc list-inside text-gray-800 text-sm leading-snug pl-2">
                    <li>Developed a Custom Async Runtime using C</li>
                    <li>Built Realtime Reactive Systems using PostgreSQL and SSE</li>
                    <li>Developed Web, Mobile, and Desktop Applications</li>
                    <li>Designed User Interfaces using Figma</li>
                </ul>
                <p className="mt-1 text-gray-600 italic text-xs">
                    * For more projects, please visit my GitHub profile
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
    );
}