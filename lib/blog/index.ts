import 'server-only'
import { BlogPostRequest, BlogPostResponse, BlogsResponse } from "@/interfaces/blog"
import { Post, PostStatus } from "@prisma/client"
import prisma from "@/lib/prisma"
import { getBlogPostByIdCache, setBlogPostByIdCache, getBlogListCache, setBlogListCache, getBlogPostCache, setBlogPostCache, invalidatePostCache, toPostWithSafeAuthor } from "@/lib/cache/blog/server"

interface DraftUpdateData {
    title?: string;
    content?: string;
    categories?: string[];
    signedWithGPG?: boolean;
    workbar?: boolean;
}

export async function getPostNoCache(id: string): Promise<Post | null> {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            categories: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
    return post
}

export async function getPost(id: string): Promise<Post | null> {
    // Try to get from cache first
    const cached = await getBlogPostByIdCache(id);
    if (cached) {
        return cached;
    }

    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            categories: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (post) {
        await setBlogPostByIdCache(id, toPostWithSafeAuthor(post));
    }

    return post;
}

export async function getPublishedPosts(): Promise<BlogsResponse[]> {
    // Try to get from cache first
    const cached = await getBlogListCache();
    if (cached) {
        return cached;
    }

    const posts = await prisma.post.findMany({
        where: {
            status: PostStatus.PUBLISHED
        },
        include: {
            author: {
                select: {
                    id: true,
                    name: true
                }
            },
            categories: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const blogPosts: BlogsResponse[] = posts.map(post => ({
        post: {
            id: post.id ?? "",
            title: post.title ?? "", 
            slug: post.slug ?? "",
            createdAt: post.createdAt.toISOString(),
            author: { name: post.author.name },
            categories: post.categories ?? [],
            signedWithGPG: post.signedWithGPG
        }
    }));

    await setBlogListCache(blogPosts);
    return blogPosts;
}

export async function getPostPublished(id: string): Promise<Post | null> {
    // Try to get from cache first
    const cached = await getBlogPostByIdCache(id);
    if (cached && cached.status === PostStatus.PUBLISHED) {
        return cached;
    }

    const post = await prisma.post.findUnique({
        where: { id, status: PostStatus.PUBLISHED },
        include: {
            categories: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (post) {
        await setBlogPostByIdCache(id, toPostWithSafeAuthor(post));
    }

    return post;
}

export async function getBlogPosts(authorId: string): Promise<BlogPostResponse[]> {
    const posts = await prisma.post.findMany({
        where: { authorId: authorId },
        include: {
            categories: true,
            author: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    })

    const blogPosts: BlogPostResponse[] = posts.map(post => ({
        title: post.title ?? "",
        slug: post.slug ?? "",
        id: post.id,
        author: post.authorId,
        content: post.content ?? "",
        status: post.status,
        categories: post.categories,
        signedWithGPG: post.signedWithGPG,
        workbar: post.workbar
    }))

    return blogPosts
}

export async function getPostPublishedBySlug(slug: string): Promise<Post | null> {
    try {
        // Try to get from cache first
        const cached = await getBlogPostCache(slug);
        if (cached && cached.status === PostStatus.PUBLISHED) {
            return cached;
        }

        const post = await prisma.post.findUnique({
            where: {
                slug: slug,
                status: PostStatus.PUBLISHED
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                categories: true
            }
        });

        if (post && post.status === PostStatus.PUBLISHED) {
            const safePost = toPostWithSafeAuthor(post);
            // We know it's published because we checked post.status
            await setBlogPostCache(slug, { ...safePost, status: PostStatus.PUBLISHED });
        }

        return post;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function initBlogPostDraft(data: BlogPostRequest): Promise<Post> {
    const post = await prisma.post.create({
        data: {
            authorId: data.author,
            title: data.title || '',
            content: data.content || '',
            signedWithGPG: data.signedWithGPG || false,
            workbar: data.includeWorkbar || false,
            status: data.status || PostStatus.DRAFT,
            slug: data.slug || '',
            categories: {
                connect: []
            }
        }
    });
    
    // Invalidate caches if it's a published post
    if (post.status === PostStatus.PUBLISHED) {
        await invalidatePostCache(post);
    }
    
    return post;
}

export async function updateBlogPostDraftUnpublished(data: DraftUpdateData, post: Post): Promise<Post> {
    // Create or get existing categories
    const normalizedCategories = data.categories ? [...new Set(data.categories.map(cat => cat.toLowerCase()))] : [];
    
    const categories = await Promise.all(
        normalizedCategories.map(async (name) => {
            return prisma.category.upsert({
                where: { name },
                create: { name },
                update: {} // No updates needed if exists
            });
        })
    );

    // Update the post with new data
    const updatedPost = await prisma.post.update({
        where: { id: post.id },
        data: {
            title: data.title,
            content: data.content,
            signedWithGPG: data.signedWithGPG,
            workbar: data.workbar,
            categories: {
                set: categories.map(cat => ({ id: cat.id }))
            },
            updatedAt: new Date()
        },
        include: {
            categories: true
        }
    });

    // Invalidate caches
    await invalidatePostCache(updatedPost);

    return updatedPost;
}

