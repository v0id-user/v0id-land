'use client'

import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useCallback, useRef, useEffect, useState } from 'react'
import { Bold, Italic, Heading2, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Code, Quote } from 'lucide-react'
import toast from 'react-hot-toast'
import { useBlogFormStore } from '@/state/blog/form'
import { getPresignedUrl, uploadFile } from '@/lib/client/blog'

const EditorFloatingBubbleMenu = ({ editor }: { editor: Editor }) => {
    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 100,
                appendTo: document.body,
                interactive: true,
            }}
            className="bg-white shadow-lg rounded-lg border border-gray-200 flex overflow-hidden"
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 hover:bg-gray-100 transition-colors ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
            >
                <Bold className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 hover:bg-gray-100 transition-colors ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
            >
                <Italic className="w-4 h-4" />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 hover:bg-gray-100 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
            >
                <Heading2 className="w-4 h-4" />
            </button>
            <button
                onClick={() => {
                    const url = window.prompt('أدخل الرابط')
                    if (url) {
                        editor.chain().focus().toggleLink({ href: url }).run()
                    }
                }}
                className={`p-2 hover:bg-gray-100 transition-colors ${editor.isActive('link') ? 'bg-gray-100' : ''}`}
            >
                <LinkIcon className="w-4 h-4" />
            </button>
        </BubbleMenu>
    )
}

const EditorSideToolbar = ({ editor, addImage }: { editor: Editor, addImage: () => void }) => {
    return (
        <div className="absolute left-0 top-8 -ml-12 flex flex-col gap-2 bg-white rounded-lg">
            <button
                type="button" // Prevent form submission
                onClick={addImage}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
                title="إضافة صورة"
            >
                <ImageIcon className="w-4 h-4" />
            </button>
            <button
                type="button" // Prevent form submission
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
                title="قائمة نقطية"
            >
                <List className="w-4 h-4" />
            </button>
            <button
                type="button" // Prevent form submission
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
                title="قائمة رقمية"
            >
                <ListOrdered className="w-4 h-4" />
            </button>
            <button
                type="button" // Prevent form submission
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('codeBlock') ? 'bg-gray-100' : ''}`}
                title="كود"
            >
                <Code className="w-4 h-4" />
            </button>
            <button
                type="button" // Prevent form submission
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
                title="اقتباس"
            >
                <Quote className="w-4 h-4" />
            </button>
        </div>
    )
}


export default function BlogEditor() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isMounted, setIsMounted] = useState(false)
    const store = useBlogFormStore()
    const lastContentRef = useRef(store.content)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                    HTMLAttributes: {
                        class: 'my-heading',
                    },
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'my-bullet-list',
                    },
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                    HTMLAttributes: {
                        class: 'my-ordered-list',
                    },
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg my-8',
                },
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800 underline',
                },
            }),
        ],
        content: store.content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[70vh] px-0 py-8',
            },
            handleDrop: (view, event, slice, moved) => {
                if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
                    const file = event.dataTransfer.files[0]
                    if (!file.type.startsWith('image/')) {
                        toast.error('يمكنك إسقاط الصور فقط')
                        return true
                    }
                    handleImageUpload(file)
                    return true
                }
                return false
            },
            handlePaste: (view, event) => {
                // Handle image paste
                if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
                    console.log('Image paste detected')
                    const file = event.clipboardData.files[0]
                    if (!file.type.startsWith('image/')) {
                        return false
                    }
                    handleImageUpload(file)
                    return true
                }

                if (event.clipboardData && event.clipboardData.getData('text')) {
                    console.log('Text paste detected')
                    //Get the text from the clipboard
                    const contentPasted = event.clipboardData.getData('text')

                    //Get the current content
                    const currentContent = store.getContent()

                    //Append the new content to the current content
                    const fullContent = currentContent + contentPasted

                    //Update the last content reference
                    //This will automatically format the content
                    lastContentRef.current = fullContent

                    //Update the content in the store
                    store.setContent(lastContentRef.current)
                    return true
                }
                return false
            },
        },
        onUpdate: ({ editor }) => {
            const content = editor.getHTML()
            if (content !== lastContentRef.current) {
                lastContentRef.current = content
                store.setContent(content)
            }
        },
    }, []) // Add empty dependency array to avoid re-renders

    useEffect(() => {
        // TODO: Make it sync with local first approach
        // TODO: Interface should be easy as we only going to use the form state and the id generated by the server
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (editor && store.content !== editor.getHTML()) {
            editor.commands.setContent(store.content)
            lastContentRef.current = store.content
        }
    }, [editor, store.content])

    const handleImageUpload = async (file: File) => {
        let insertedPos: number | null = null;

        try {
            if (!editor) {
                return;
            }

            // Validate file type and size
            if (!file.type.startsWith('image/')) {
                throw new Error('Invalid file type');
            }

            const MAX_SIZE = 5 * 1024 * 1024; // 5MB
            if (file.size > MAX_SIZE) {
                throw new Error('File size too large');
            }

            // Show preview immediately using FileReader
            const previewUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = (e) => reject(e);
                reader.readAsDataURL(file);
            });

            if (!previewUrl) {
                throw new Error('Failed to get preview URL');
            }

            // Insert preview image and store its position
            const { state } = editor;
            insertedPos = state.selection.from;
            editor.chain().focus().setImage({ src: previewUrl }).run();

            // Get presigned URL and upload
            const url = await getPresignedUrl(file);
            if (!url?.publicUrl) {
                throw new Error('Failed to get presigned URL');
            }

            // Upload the file if we have a presigned URL
            if (url.presignedUrl) {
                const uploadResponse = await uploadFile(file, url.presignedUrl);
                if (!uploadResponse) {
                    throw new Error('Failed to upload to S3');
                }
            }

            // Find and replace the preview image with the uploaded one
            editor.view.state.doc.nodesBetween(0, editor.view.state.doc.content.size, (node, pos) => {
                if (node.type.name === 'image' && node.attrs.src === previewUrl) {
                    editor.chain()
                        .setNodeSelection(pos)
                        .deleteSelection()
                        .setImage({ src: url.publicUrl })
                        .run();
                    return false;
                }
            });

            toast.success('تم وضع الصورة بنجاح');

        } catch (error) {
            console.error('Error uploading image:', error);
            
            // Clean up preview image if it exists
            if (editor && insertedPos !== null) {
                editor.view.state.doc.nodesBetween(0, editor.view.state.doc.content.size, (node, pos) => {
                    if (node.type.name === 'image' && pos >= insertedPos!) {
                        editor.chain()
                            .setNodeSelection(pos)
                            .deleteSelection()
                            .run();
                        return false;
                    }
                });
            }

            // Show appropriate error message
            const errorMessage = error instanceof Error ? error.message : 'حدث خطأ أثناء رفع الصورة';
            toast.error(errorMessage);
        }
    }

    const addImage = useCallback(() => {
        fileInputRef.current?.click()
    }, [])

    if (!editor || !isMounted) {
        return null
    }

    return (
        <div className="relative">
            {/* Floating Toolbar */}
            <EditorFloatingBubbleMenu editor={editor} />

            {/* Side Toolbar */}
            <EditorSideToolbar editor={editor} addImage={addImage} />

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                        handleImageUpload(file)
                    }
                    e.target.value = ''
                }}
            />

            <div className="relative bg-white rounded-lg">
                <EditorContent
                    editor={editor}
                />
                <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-transparent transition-colors duration-200 rounded-lg"
                    style={{
                        borderColor: 'var(--drag-color, transparent)',
                    }}
                />
            </div>

            <input
                type="hidden"
                name="content"
                value={editor.getHTML()}
            />

            {/* Custom styles using AI */}
            <style jsx global>{`
                .ProseMirror-selectednode {
                    outline: 2px solid #68cef8;
                }
                .ProseMirror {
                    > * + * {
                        margin-top: 0.75em;
                    }
                    
                    ul, ol {
                        padding-right: 1.5em;
                        margin: 1em 0;
                    }
                    
                    ul li {
                        list-style-type: disc;
                    }
                    
                    ol li {
                        list-style-type: decimal;
                    }
                    
                    li {
                        margin: 0.5em 0;
                    }
                    
                    h1 {
                        font-size: 2em;
                        margin: 1em 0 0.5em;
                    }
                    
                    h2 {
                        font-size: 1.5em;
                        margin: 1em 0 0.5em;
                    }
                    
                    h3 {
                        font-size: 1.25em;
                        margin: 1em 0 0.5em;
                    }
                }
                .ProseMirror[data-dragover="true"] + div {
                    --drag-color: #68cef8;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: "ابدأ الكتابة هنا...";
                    float: right;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
            `}</style>
        </div>
    )
}
