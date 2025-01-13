import BlogContainer from "@/components/BlogContainer";

export default function Blog() {
    return (
        <main>
            <div className="min-h-screen text-right">
                <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl font-bold mb-4">مدونتي</h1>
                        <div className="w-24 h-1 mx-auto"></div>
                    </div>
                    <div className="rounded-lg p-6">
                        <BlogContainer />
                    </div>
                </div>
            </div>
        </main>
    );
}