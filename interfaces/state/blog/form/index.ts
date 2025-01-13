import { PostStatus } from "@prisma/client";
export interface FormState {
    id: string;
    title: string;
    categories: string[];
    categoryInput: string;
    content: string;
    signedWithGPG: boolean;
    workbar: boolean;
    textStatus: string;
    slug: string;
    author: string;
    status: PostStatus;
}