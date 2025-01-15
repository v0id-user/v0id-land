import BlogEditorForm from "@/components/BlogEditorForm";
import { getSpacerToken } from "@/lib/token";
import { redirect } from "next/navigation";

type Props = {
    params: Promise<{ id: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Creation({ params }: Props) {
    const id = (await params).id;
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