import { PostStatus } from "@prisma/client";
import { create } from 'zustand'
import { updateDraft } from '@/lib/client/blog/draft'
import debounce from 'lodash/debounce'

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
    lastSavedContent: string;
    isDirty: boolean;
}

interface BlogFormStore extends FormState {
    setStatus: (status: PostStatus) => void;
    setTitle: (title: string) => void;
    setContent: (content: string) => void;
    setCategories: (categories: string[]) => void;
    setCategoryInput: (input: string) => void;
    setSignedWithGPG: (signed: boolean) => void;
    setWorkbar: (workbar: boolean) => void;
    setTextStatus: (status: string) => void;
    addCategory: (category: string) => void;
    removeCategory: (category: string) => void;
    setState: (state: Partial<FormState>) => void;
    saveDraft: () => Promise<void>;
    debouncedSaveDraft: () => void;
}

export const useBlogFormStore = create<BlogFormStore>((set, get) => {
    // Create a debounced version of saveDraft
    const debouncedSave = debounce(async () => {
        const state = get()
        if (!state.isDirty) return

        try {
            set({ textStatus: 'جاري الحفظ' })
            const response = await updateDraft(state)

            if (!response) {
                set({ textStatus: 'فشل في الحفظ' })
                return
            }

            set({
                textStatus: 'تم الحفظ',
                lastSavedContent: state.content,
                isDirty: false
            })

            setTimeout(() => {
                if (!get().isDirty) {
                    set({ textStatus: 'لايوجد تغييرات' })
                }
            }, 3000)
        } catch (error) {
            console.error('Error saving draft:', error)
            set({ textStatus: 'فشل في الحفظ' })
        }
    }, 2000, { maxWait: 10000 })

    return {
        // Initial state
        id: '',
        title: '',
        categories: [],
        categoryInput: '',
        content: '',
        signedWithGPG: false,
        workbar: false,
        textStatus: 'لايوجد تغييرات',
        slug: '',
        author: '',
        status: PostStatus.DRAFT,
        lastSavedContent: '',
        isDirty: false,

        // Actions
        setTitle: (title: string) => set({
            title,
            textStatus: 'تغييرات غير محفوظة',
            isDirty: true
        }),

        setContent: (content: string) => {
            const state = get()
            if (content === state.content) return

            set({
                content,
                textStatus: 'تغييرات غير محفوظة',
                isDirty: true
            })
            debouncedSave()
        },

        setCategories: (categories: string[]) => {
            set({
                categories,
                textStatus: 'تغييرات غير محفوظة',
                isDirty: true
            })
            debouncedSave()
        },
        setCategoryInput: (categoryInput: string) => set({ categoryInput }),
        setSignedWithGPG: (signedWithGPG: boolean) => {
            set({
                signedWithGPG,
                textStatus: 'تغييرات غير محفوظة',
                isDirty: true
            })
            debouncedSave()
        },
        setWorkbar: (workbar: boolean) => {
            set({
                workbar,
                textStatus: 'تغييرات غير محفوظة',
                isDirty: true
            })
            debouncedSave()
        },

        setStatus: (status: PostStatus) => set({ status }),

        setTextStatus: (textStatus: string) => set({ textStatus }),

        setState: (state: Partial<FormState>) => set({
            ...state,
            lastSavedContent: state.content || get().lastSavedContent,
            isDirty: false
        }),

        addCategory: (category: string) => {
            const { categories } = get()
            if (!categories.includes(category.toLowerCase())) {
                set({
                    categories: [...categories, category.toLowerCase()],
                    categoryInput: '',
                    textStatus: 'تغييرات غير محفوظة',
                    isDirty: true
                })
                debouncedSave()
            }
        },

        removeCategory: (categoryToRemove: string) => {
            const { categories } = get()
            set({
                categories: categories.filter((cat: string) => cat !== categoryToRemove),
                textStatus: 'تغييرات غير محفوظة',
                isDirty: true
            })
            debouncedSave()
        },

        saveDraft: async () => {
            const state = get()
            if (!state.isDirty) return

            try {
                set({ textStatus: 'جاري الحفظ' })
                const response = await updateDraft(state)

                if (!response) {
                    set({ textStatus: 'فشل في الحفظ' })
                    return
                }

                set({
                    textStatus: 'تم الحفظ',
                    lastSavedContent: state.content,
                    isDirty: false
                })

                setTimeout(() => {
                    if (!get().isDirty) {
                        set({ textStatus: 'لايوجد تغييرات' })
                    }
                }, 3000)
            } catch (error) {
                console.error('Error saving draft:', error)
                set({ textStatus: 'فشل في الحفظ' })
            }
        },

        debouncedSaveDraft: () => {
            debouncedSave()
        }
    }
})