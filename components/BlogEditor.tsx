'use client'

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { useCallback, useRef, useEffect, useState } from 'react'
import { Bold, Italic, Heading2, List, ListOrdered, Image as ImageIcon, Link as LinkIcon, Code, Quote } from 'lucide-react'
import toast from 'react-hot-toast'
import { useBlogFormStore } from '@/state/blog/form'

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
                    const file = event.clipboardData.files[0]
                    if (!file.type.startsWith('image/')) {
                        return false
                    }
                    handleImageUpload(file)
                    return true
                }

                // Handle text paste
                setTimeout(() => {
                    const content = editor?.getHTML();
                    if (content && content !== lastContentRef.current) {
                        lastContentRef.current = content
                        store.setContent(content)
                    }
                }, 10);

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
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (editor && store.content !== editor.getHTML()) {
            editor.commands.setContent(store.content)
            lastContentRef.current = store.content
        }
    }, [editor, store.content])

    const handleImageUpload = async (file: File) => {
        let lastImagePos: number | null = null;

        try {
            // Show preview immediately
            const reader = new FileReader()
            reader.onload = (e) => {
                if (editor && e.target?.result) {
                    // Store the position before inserting
                    lastImagePos = editor.state.selection.from;
                    editor.chain().focus().setImage({ src: e.target.result as string }).run()
                }
            }
            reader.readAsDataURL(file)

            // Calculate SHA-256 hash of file
            const arrayBuffer = await file.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

            // Get presigned URL from our API
            const response = await fetch('/api/s3/presign', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type,
                    fileSize: file.size,
                    hash: hash,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get presigned URL');
            }

            const data = await response.json();

            // If file already exists, just use the public URL
            if (data.exists) {
                if (editor) {
                    let lastImage = null
                    editor.state.doc.descendants((node) => {
                        if (node.type.name === 'image') {
                            lastImage = node
                        }
                        return false
                    })
                    
                    if (lastImage) {
                        editor.chain().focus().setImage({ src: data.publicUrl }).run()
                    }
                }
                toast.success('تم استخدام الصورة الموجودة')
                return;
            }

            // Upload to S3 using presigned URL
            const uploadResponse = await fetch(data.presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload to S3');
            }

            // Replace the base64 preview with the actual S3 URL
            if (editor) {
                let lastImage = null
                editor.state.doc.descendants((node) => {
                    if (node.type.name === 'image') {
                        lastImage = node
                    }
                    return false
                })
                
                if (lastImage) {
                    editor.chain().focus().setImage({ src: data.publicUrl }).run()
                }
            }

            toast.success('تم رفع الصورة بنجاح')
        } catch (error) {
            console.error('Error uploading image:', error)
            // Remove the image if upload failed
            if (editor && lastImagePos !== null) {
                editor.commands.deleteRange({
                    from: lastImagePos,
                    to: lastImagePos + 1
                })
            }
            toast.error('حدث خطأ أثناء رفع الصورة')
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

            {/* Side Toolbar */}
            <div className="absolute left-0 top-8 -ml-12 flex flex-col gap-2 bg-white rounded-lg">
                <button
                    onClick={addImage}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white"
                    title="إضافة صورة"
                >
                    <ImageIcon className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
                    title="قائمة نقطية"
                >
                    <List className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
                    title="قائمة رقمية"
                >
                    <ListOrdered className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('codeBlock') ? 'bg-gray-100' : ''}`}
                    title="كود"
                >
                    <Code className="w-4 h-4" />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={`p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 bg-white ${editor.isActive('blockquote') ? 'bg-gray-100' : ''}`}
                    title="اقتباس"
                >
                    <Quote className="w-4 h-4" />
                </button>
            </div>

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
