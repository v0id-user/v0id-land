'use client'

import dynamic from 'next/dynamic'
import { publishPost, unpublishPost } from '@/app/space/creation/actions'
import { Lock, LayoutPanelTop, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { SpacerTokenPayload } from '@/lib/token'
import { CreatePostFormData } from '@/app/space/creation/actions'
import { PostStatus } from '@prisma/client'
import { Badge } from './ui/badge'
import { useBlogFormStore } from '@/state/blog/form'
import { getDraft } from '@/lib/client/blog/draft'

const BlogEditor = dynamic(() => import('./BlogEditor'), {
    ssr: false,
    loading: () => <div>جاري تحميل المحرر...</div>
})

interface BlogEditorFormProps {
    spacerData: SpacerTokenPayload;
    id: string;
}

export default function BlogEditorForm({ spacerData, id }: BlogEditorFormProps) {
    const store = useBlogFormStore()
    const idRef = useRef(id);
    const spacerDataIdRef = useRef(spacerData.id);
    const storeRef = useRef(store);

    useEffect(() => {
        idRef.current = id;
        spacerDataIdRef.current = spacerData.id;
        storeRef.current = store;
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        store.setTitle(e.target.value)
        store.debouncedSaveDraft()
    }

    const handleCategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        store.setCategoryInput(value)

        if (value.endsWith(',') || value.endsWith(' ')) {
            const newCategory = value.slice(0, -1).trim()
            if (newCategory) {
                store.addCategory(newCategory)
            }
        }
    }

    const handleSubmit = async () => {
        try {
            if (!store.title?.trim()) {
                toast.error('يرجى إدخال عنوان للمقال')
                return
            }

            if (!store.content?.trim()) {
                toast.error('يرجى إدخال محتوى المقال')
                return
            }

            const formInterface = {
                id: id,
                author: spacerData.id,
                title: store.title,
                content: store.content,
                signedWithGPG: store.signedWithGPG,
                workbar: store.workbar,
                categories: store.categories,
            } as CreatePostFormData

            let response;
            if (store.status === PostStatus.PUBLISHED) {
                response = await unpublishPost(id)
            } else {
                response = await publishPost(formInterface)
            }
            if (response.success && response.post) {
                store.setState({
                    status: response.post.status,
                    slug: response.post.slug || undefined,
                    isDirty: false
                })
                if (store.status === PostStatus.PUBLISHED) {
                    toast.success('تم إلغاء نشر المقال بنجاح')
                } else {
                    toast.success('تم نشر المقال بنجاح')
                }
                setTimeout(() => {
                    window.location.reload()
                }, 400)
            } else {
                toast.error(response.error?.message || 'حدث خطأ أثناء نشر المقال')
            }
        } catch (error) {
            console.error('Error publishing post:', error)
            toast.error('حدث خطأ أثناء نشر المقال')
        }
    }

    const getSaveStatusBadgeClass = () => {
        switch (store.textStatus) {
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

    const getStatusColor = (status: PostStatus) => {
        switch (status) {
            case PostStatus.DRAFT:
                return 'bg-gray-500 text-white'
            case PostStatus.UNPUBLISHED:
                return 'bg-yellow-500 text-white'
            case PostStatus.PUBLISHED:
                return 'bg-green-500 text-white'
        }
    }


    useEffect(() => {
        const fetchDraft = async () => {
            const draft = await getDraft(idRef.current)

            if (!draft) {
                toast.error('لا يوجد مقال محفوظ')
                toast.error('ستيم تحويلك إلى صفحة المقالات')
                setTimeout(() => {
                    window.location.href = '/space'
                }, 2000)
                return
            }

            const categories = draft.categories?.map(cat => cat.name.toLowerCase()) ?? []

            storeRef.current.setState({
                title: draft?.title ?? '',
                content: draft?.content ?? '',
                categories,
                id: draft?.id ?? idRef.current,
                status: draft?.status ?? PostStatus.DRAFT,
                author: spacerDataIdRef.current,
                signedWithGPG: draft?.signedWithGPG ?? false,
                workbar: draft?.workbar ?? false,
                slug: draft?.slug ?? '',
            })
        }
        fetchDraft()
    }, []);

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
                <div className="sticky top-0 z-10 bg-white border-b py-4 px-10 rounded-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={store.title}
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
                                            checked={store.signedWithGPG}
                                            onChange={(e) => {
                                                store.setSignedWithGPG(e.target.checked)
                                                store.debouncedSaveDraft()
                                            }}
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
                                            checked={store.workbar}
                                            onChange={(e) => {
                                                store.setWorkbar(e.target.checked)
                                                store.debouncedSaveDraft()
                                            }}
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
                                    {store.textStatus}
                                </Badge>

                                <Badge className={`${getStatusColor(store.status)} text-sm transition-colors duration-200`}>
                                    {store.status}
                                </Badge>
                            </div>

                            <button
                                type="submit"
                                className={`px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {store.status === PostStatus.PUBLISHED ? 'إلغاء النشر' : 'نشر'}
                            </button>
                            {store.status === PostStatus.PUBLISHED && 
                            <Link href={`/blog/${store.slug}`} className="text-sm text-black bg-gray-100 px-4 py-1.5 rounded-full hover:bg-gray-200 transition">
                                الذهاب إلى المقال
                            </Link>}
                        </div>
                    </div>

                    {/* Categories Section */}
                    <div className="mt-4">
                        <div className="flex flex-wrap gap-2 mb-2">
                            {store.categories.map((category, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                                >
                                    {category}
                                    <button
                                        type="button"
                                        onClick={() => store.removeCategory(category)}
                                        className="hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={store.categoryInput}
                            onChange={handleCategoryInput}
                            className="w-full text-lg border-none outline-none text-gray-600 placeholder:text-gray-300"
                            placeholder={store.categories.length ? 'أضف المزيد من التصنيفات...' : 'أضف تصنيفات مفصولة بفواصل...'}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault()
                                    if (store.categoryInput.trim()) {
                                        store.addCategory(store.categoryInput.trim())
                                    }
                                } else if (e.key === 'Backspace' && !store.categoryInput && store.categories.length > 0) {
                                    // Remove the last category
                                    const lastCategory = store.categories[store.categories.length - 1]
                                    store.removeCategory(lastCategory)
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Editor Section */}
                <div className="mt-8">
                    <BlogEditor />
                </div>

                <input type="hidden" name="author" value={spacerData.id} />
            </form>
        </div>
    )
}

console.log("blog editor form")