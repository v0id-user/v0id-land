'use client'

import dynamic from 'next/dynamic'
import { publishPost } from '@/app/space/creation/actions'
import { Lock, LayoutPanelTop, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import toast from 'react-hot-toast'
import { SpacerTokenPayload } from '@/lib/token'
import { CreatePostFormData } from '@/app/space/creation/actions'
import { PostStatus, Category } from '@prisma/client'
import { Badge } from './ui/badge'
import { FormState } from '@/interfaces/state/blog/form'
import { updateDraft } from '@/lib/client/blog'
import { getDraft } from '@/lib/client/blog'

const BlogEditor = dynamic(() => import('./BlogEditor'), {
    ssr: false,
    loading: () => <div>جاري تحميل المحرر...</div>
})

interface BlogEditorFormProps {
    spacerData: SpacerTokenPayload;
    id: string;
}

interface DraftResponse {
    id: string;
    title?: string;
    content?: string;
    categories?: Category[];
    status: PostStatus;
}

export default function BlogEditorForm({ spacerData, id }: BlogEditorFormProps) {
    const [formState, setFormState] = useState<FormState>({
        // Initial state
        id: id,
        slug: '',
        author: spacerData.id,
        title: '',
        categories: [],
        categoryInput: '',
        content: '',
        signedWithGPG: false,
        workbar: false,
        textStatus: 'لايوجد تغييرات',
        status: PostStatus.DRAFT,
    })

    // Single activity tracker for all changes
    const activityTracker = useRef({
        saveTimeout: null as ReturnType<typeof setTimeout> | null,
        lastSaveTime: Date.now(),
        lastSavedState: {
            title: '',
            content: '',
            categories: [] as string[]
        }
    })

    const debouncedSave = () => {
        const tracker = activityTracker.current
        if (tracker.saveTimeout) {
            clearTimeout(tracker.saveTimeout)
        }

        setFormState(prev => ({
            ...prev,
            textStatus: 'تغييرات غير محفوظة'
        }))

        // Schedule the save with state check
        tracker.saveTimeout = setTimeout(() => {
            // Wait for any pending state updates
            Promise.resolve().then(() => {
                // Final check before saving (300ms pause)
                setTimeout(async () => {
                    // Get the very latest state
                    const currentState = {
                        title: formState.title,
                        content: formState.content,
                        categories: formState.categories
                    }

                    // Re-check if content has changed after the pause
                    const finalChanges = currentState.title !== tracker.lastSavedState.title ||
                        currentState.content !== tracker.lastSavedState.content ||
                        JSON.stringify(currentState.categories) !== JSON.stringify(tracker.lastSavedState.categories)

                    if (finalChanges) {
                        handleSavingDrafts()
                    }
                }, 300)
            })
        }, 2000)
    }

    // Update handlers with immediate state updates
    const handleEditorUpdate = (content: string) => {
        setFormState(prev => ({ ...prev, content }))
        debouncedSave()
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setFormState(prev => ({ ...prev, title: newTitle }))
        debouncedSave()
    }

    const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormState(prev => ({ ...prev, categoryInput: value }))

        if (value.endsWith(',') || value.endsWith(' ')) {
            const newCategory = value.slice(0, -1).trim()
            if (newCategory && !formState.categories.map(cat => cat.toLowerCase()).includes(newCategory.toLowerCase())) {
                setFormState(prev => ({
                    ...prev,
                    categories: [...prev.categories, newCategory.toLowerCase()],
                    categoryInput: ''
                }))
                debouncedSave()
            } else {
                setFormState(prev => ({
                    ...prev,
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
        debouncedSave()
    }

    const handleSavingDrafts = async () => {
        const tracker = activityTracker.current
        if (!tracker) return

        try {
            setFormState(prev => ({
                ...prev,
                textStatus: 'جاري الحفظ',
            }))

            const response = await updateDraft(formState)

            if (!response) {
                setFormState(prev => ({
                    ...prev,
                    textStatus: 'فشل في الحفظ',
                }))
                return
            }

            // Update last saved state
            tracker.lastSavedState = {
                title: formState.title,
                content: formState.content,
                categories: [...formState.categories]
            }
            tracker.lastSaveTime = Date.now()

            setFormState(prev => ({
                ...prev,
                textStatus: 'تم الحفظ',
            }))

            // Reset status after delay
            setTimeout(() => {
                setFormState(prev => ({
                    ...prev,
                    textStatus: 'لايوجد تغييرات',
                }))
            }, 3000)
        } catch (error) {
            console.error('Error saving draft:', error)
            setFormState(prev => ({
                ...prev,
                textStatus: 'فشل في الحفظ',
            }))
            toast.error('حدث خطأ أثناء حفظ المقال')
        }
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

    // Update the status badge to show different states
    const getSaveStatusBadgeClass = () => {
        switch (formState.textStatus) {
            case 'يتم الحفظ...':
                return 'bg-yellow-100 text-yellow-800'
            case 'تم الحفظ':
                return 'bg-green-100 text-green-800'
            case 'فشل في الحفظ':
                return 'bg-red-100 text-red-800'
            case 'جاري الكتابة...':
                return 'bg-gray-100 text-gray-800'
            case 'توقف عن الكتابة للحفظ التلقائي':
                return 'bg-blue-100 text-blue-800'
            default:
                return 'bg-gray-200 text-gray-600'
        }
    }

    // Initial state load
    useEffect(() => {
        const fetchDraft = async () => {
            const draft = await getDraft(id) as DraftResponse | null
            
            if (!draft) return

            const categories = draft.categories?.map(cat => cat.name.toLowerCase()) ?? []

            const newState = {
                title: draft?.title ?? '',
                content: draft?.content ?? '',
                categories,
                id: draft?.id ?? id,
                status: draft?.status ?? PostStatus.DRAFT,
            }

            setFormState(prev => ({
                ...prev,
                ...newState
            }))

            // Initialize the activity tracker
            activityTracker.current.lastSavedState = {
                title: newState.title,
                content: newState.content,
                categories: newState.categories
            }
            activityTracker.current.lastSaveTime = Date.now()
        }
        fetchDraft()
    }, [id])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            const tracker = activityTracker.current
            if (tracker.saveTimeout) {
                clearTimeout(tracker.saveTimeout)
            }
        }
    }, [])

    return (
        <div className="min-h-screen bg-white">
            <form
                action={handleSubmit}
                className="w-full mx-auto px-10"
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
                                onChange={handleTitleChange}
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

                                <Badge className={`${getSaveStatusBadgeClass()} text-sm transition-colors duration-200`}>
                                    {formState.textStatus}
                                </Badge>
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
                    <BlogEditor onChange={handleEditorUpdate} currentFormState={formState} setFormState={setFormState} handleSavingDrafts={handleSavingDrafts} />
                </div>

                <input type="hidden" name="author" value={spacerData.id} />
            </form>
        </div>
    )
}

console.log("blog editor form")