'use client';

import { useRouter } from 'next/navigation';

interface CreatePostButtonProps {
    authorId: string;
}

export default function CreatePostButton({ authorId }: CreatePostButtonProps) {
    const router = useRouter();

    const handleClick = async () => {
        try {
            const response = await fetch('/api/blog/draft', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    author: authorId,
                    slug: '',
                    title: '',
                    categories: [],
                    content: '',
                    signedWithGPG: false,
                    includeWorkbar: false,
                }),
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