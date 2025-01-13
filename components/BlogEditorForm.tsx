'use client'

import dynamic from 'next/dynamic'
import { publishPost } from '@/app/space/actions'
import { Lock, LayoutPanelTop, X } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { SpacerTokenPayload } from '@/lib/token'
import { CreatePostFormData } from '@/app/space/actions'
const BlogEditor = dynamic(() => import('./BlogEditor'), {
    ssr: false,
    loading: () => <div>جاري تحميل المحرر...</div>
})

interface BlogEditorFormProps {
    spacerData: SpacerTokenPayload;
}

interface FormState {
    title: string;
    categories: string[];
    categoryInput: string;
    content: string;
    signedWithGPG: boolean;
    workbar: boolean;
}

export default function BlogEditorForm({ spacerData }: BlogEditorFormProps) {
    const [formState, setFormState] = useState<FormState>({
        title: '',
        categories: [],
        categoryInput: '',
        content: '',
        signedWithGPG: false,
        workbar: false,
    })

    const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormState(prev => ({ ...prev, categoryInput: value }))

        if (value.endsWith(',') || value.endsWith(' ')) {
            const newCategory = value.slice(0, -1).trim()
            if (newCategory && !formState.categories.includes(newCategory)) {
                setFormState(prev => ({
                    ...prev,
                    categories: [...prev.categories, newCategory],
                    categoryInput: ''
                }))
            }
        }
    }

    const removeCategory = (categoryToRemove: string) => {
        setFormState(prev => ({
            ...prev,
            categories: prev.categories.filter(cat => cat !== categoryToRemove)
        }))
    }

    const handleEditorUpdate = (content: string) => {
        setFormState(prev => ({ ...prev, content }))
    }

    const handleSubmit = async (formData: FormData) => {
        try {
            
            // Add all form state to formData
            formData.set('title', formState.title)
            formData.set('categories', formState.categories.join(','))
            formData.set('content', formState.content)
            formData.set('signedWithGPG', formState.signedWithGPG.toString())
            formData.set('workbar', formState.workbar.toString())
            formData.set('author', spacerData.id)

            if (!formState.title?.trim()) {
                toast.error('يرجى إدخال عنوان للمقال')
                return
            }

            if (!formState.content?.trim()) {
                toast.error('يرجى إدخال محتوى المقال')
                return
            }

            const formInterface = {
                author: spacerData.id,
                title: formState.title,
                content: formState.content,
                signedWithGPG: formState.signedWithGPG,
                workbar: formState.workbar,
                categories: formState.categories,
            } as CreatePostFormData

            await publishPost(formInterface)
            toast.success('تم نشر المقال بنجاح')
        } catch (error) {
            console.error('Error creating post:', error)
            toast.error('حدث خطأ أثناء نشر المقال')
        }
    }

    return (
        <div className="min-h-screen bg-white">
            <form 
                action={handleSubmit}
                className="max-w-[1000px] mx-auto px-4"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault()
                    }
                }}
            >
                {/* Header Section */}
                <div className="sticky top-0 z-10 bg-white border-b py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formState.title}
                                onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full h-full text-4xl font-bold border-none outline-none placeholder:text-gray-300"
                                placeholder="عنوان مقالك..."
                                required
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                    }
                                }}
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2">
                                    <div className="relative inline-flex items-center">
                                        <input 
                                            type="checkbox" 
                                            name="signedWithGPG"
                                            checked={formState.signedWithGPG}
                                            onChange={(e) => setFormState(prev => ({ ...prev, signedWithGPG: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black">
                                        </div>
                                        <span className="absolute left-1 top-1 text-gray-400 peer-checked:text-white transition-colors">
                                            <Lock className="w-4 h-4" />
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium">توقيع GPG</span>
                                </label>
                                
                                <label className="flex items-center gap-2">
                                    <div className="relative inline-flex items-center">
                                        <input 
                                            type="checkbox" 
                                            name="workbar"
                                            checked={formState.workbar}
                                            onChange={(e) => setFormState(prev => ({ ...prev, workbar: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black">
                                        </div>
                                        <span className="absolute left-1 top-1 text-gray-400 peer-checked:text-white transition-colors">
                                            <LayoutPanelTop className="w-4 h-4" />
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium">شريط العمل</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={`px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                نشر
                            </button>
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formState.categories.map((category, index) => (
                                <span 
                                    key={index} 
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                                >
                                    {category}
                                    <button
                                        type="button"
                                        onClick={() => removeCategory(category)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={formState.categoryInput}
                            onChange={handleCategoryInput}
                            className="w-full text-lg border-none outline-none text-gray-600 placeholder:text-gray-300"
                            placeholder={formState.categories.length ? 'أضف المزيد من التصنيفات...' : 'أضف تصنيفات مفصولة بفواصل...'}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (formState.categoryInput.trim()) {
                                        setFormState(prev => ({
                                            ...prev,
                                            categories: [...prev.categories, prev.categoryInput.trim()],
                                            categoryInput: ''
                                        }))
                                    }
                                } else if (e.key === 'Backspace' && !formState.categoryInput && formState.categories.length > 0) {
                                    setFormState(prev => ({
                                        ...prev,
                                        categories: prev.categories.slice(0, -1)
                                    }))
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Editor Section */}
                <div className="mt-8">
                    <BlogEditor onChange={handleEditorUpdate} initialContent={formState.content} />
                </div>

                <input type="hidden" name="author" value={spacerData.id} />
            </form>
        </div>
    )
} 