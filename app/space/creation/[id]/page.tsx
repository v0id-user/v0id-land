import BlogEditorForm from "@/components/BlogEditorForm";
import { getSpacerToken } from "@/lib/token";
import { redirect } from "next/navigation";

export default async function Creation({
    params
}: {
    params: { id: string }
}) {
    const id = (await params).id
    const accessToken = await getSpacerToken();
    if (!accessToken) {
        redirect("/space/auth");
    }
    
    return (
        <main className="p-8" dir="rtl">
            <BlogEditorForm spacerData={accessToken} id={id} />
        </main>
    )
}