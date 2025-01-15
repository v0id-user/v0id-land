'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

export default function BlogContent({ content }: { content: string }) {
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
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 hover:text-blue-800 underline',
                },
            }),
        ],
        content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none px-0 py-8',
            },
        },
    })

    return (
        <>
            <EditorContent editor={editor} />
            <style jsx global>{`
                .ProseMirror {
                    direction: rtl;
                }
                .ProseMirror > * + * {
                    margin-top: 0.75em;
                }
                
                .ProseMirror ul,
                .ProseMirror ol {
                    padding-right: 1.5em;
                    margin: 1em 0;
                }
                
                .ProseMirror ul li {
                    list-style-type: disc;
                }
                
                .ProseMirror ol li {
                    list-style-type: decimal;
                }
                
                .ProseMirror li {
                    margin: 0.5em 0;
                }
                
                .ProseMirror h1 {
                    font-size: 2em;
                    margin: 1em 0 0.5em;
                }
                
                .ProseMirror h2 {
                    font-size: 1.5em;
                    margin: 1em 0 0.5em;
                }
                
                .ProseMirror h3 {
                    font-size: 1.25em;
                    margin: 1em 0 0.5em;
                }

                .ProseMirror pre {
                    direction: ltr;
                    text-align: left;
                    background: #f5f5f5;
                    padding: 1em;
                    border-radius: 0.5em;
                }

                .ProseMirror blockquote {
                    border-right: 4px solid #e5e7eb;
                    border-left: none;
                    padding-right: 1rem;
                    padding-left: 0;
                    font-style: italic;
                    color: #666;
                }
            `}</style>
        </>
    )
} 