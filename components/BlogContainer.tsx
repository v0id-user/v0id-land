import { Badge } from "@/components/ui/badge";

export default function BlogContainer() {
    return (
        <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
            <h2 className="text-2xl font-bold mb-4">موضوع</h2>

            <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">المحتوى</p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <p>التاريخ: 2025-01-01</p>
                    <div className="mx-2"> {/* `mx-2` to Added space between date and author */} </div>
                    <p>المؤلف: #V0ID</p>
                </div>

                <div className="flex items-center justify-end gap-3">
                    <Badge className="rounded hover:bg-gray-700 transition-colors">
                        تجارب
                    </Badge>

                    <Badge className="rounded hover:bg-gray-700 transition-colors">
                        low-level
                    </Badge>
                </div>
            </div>
        </div>
    );
}
