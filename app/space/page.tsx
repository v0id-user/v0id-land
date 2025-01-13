import { redirect } from "next/navigation"
import { getSpacerToken } from "@/lib/token"

export default async function Space() {
    const accessToken = await getSpacerToken();
    if (!accessToken) {
        redirect("/space/auth");
    }

    return (
        <main className="p-8" dir="rtl">

            <div className="max-w-5xl mx-auto space-y-6">

                {/* Welcome Card */}
                <div className="p-6 rounded-lg">
                    <h1 className="text-2xl font-semibold mb-2">مرحبا بك, {accessToken.name}</h1>
                    <p className="text-gray-600">لوحة التحكم العامة, مساحتك الخاصة للتعبير و الكتابة</p>
                </div>

            </div>
            <div className="flex flex-col-reverse gap-2 items-center justify-center mt-5"> 
            <img src="/logo.svg" alt="logo" className="w-7 h-7" />
            <p className="text-gray-600 text-sm">جميع الحقوق محفوظة © {new Date().getFullYear()} #V0ID</p>
            </div>
 
        </main>
    )
}