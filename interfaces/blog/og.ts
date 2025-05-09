export interface OGImageParams {
    title: string;
    author: string;
}

export interface OGImageMetadata {
    url: string;
    width: number;
    height: number;
    alt: string;
}

export interface SocialMetadata {
    title: string;
    description: string;
    images: OGImageMetadata[];
}

export interface PostMetadata {
    title: string;
    description: string;
    openGraph: SocialMetadata;
    twitter: {
        card: 'summary' | 'summary_large_image';
    } & SocialMetadata;
    telegram?: {
        card: 'article';
    } & SocialMetadata;
} 