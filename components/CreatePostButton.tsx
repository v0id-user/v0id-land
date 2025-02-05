'use client';

import { PostStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { BlogPostRequest } from '@/interfaces/blog';

interface CreatePostButtonProps {
    authorId: string;
}

export default function CreatePostButton({ authorId }: CreatePostButtonProps) {
    const router = useRouter();

    const handleClick = async () => {
        try {
            // Create a unique random slug for the post to it's not duplicated with blank
            const slug = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

            const postData: BlogPostRequest = {
                author: authorId,
                title: '',
                content: '',
                slug: slug,
                categories: [],
                signedWithGPG: false,
                includeWorkbar: false,
                status: PostStatus.DRAFT
            };

            const response = await fetch('/api/blog/draft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            if (!response.ok) {
                throw new Error('Failed to create draft');
            }

            const draft = await response.json();
            router.push(`/space/creation/${draft.id}`);
        } catch (error) {
            console.error('Error creating draft:', error);
        }
    };

    return (
        <button onClick={handleClick} className="bg-black text-white p-2 rounded-lg">
            <p>انشاء منشور جديد</p>
        </button>
    );
} 