import { useEffect } from 'react';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    canonicalUrl?: string;
}

/**
 * SEO component that updates document head meta tags.
 * Since this is a SPA (not SSR), we dynamically set meta tags.
 */
export default function SEOHead({
    title = 'ShopSphere — Premium E-Commerce Marketplace',
    description = 'Discover premium products on ShopSphere. Electronics, fashion, and lifestyle products with unbeatable deals.',
    keywords = 'e-commerce, online shopping, electronics, clothing, marketplace',
    ogTitle,
    ogDescription,
    ogImage = '/og-image.png',
    ogUrl,
    canonicalUrl,
}: SEOHeadProps) {
    useEffect(() => {
        // Update title
        document.title = title;

        // Update meta tags
        const setMeta = (name: string, content: string, property = false) => {
            const attr = property ? 'property' : 'name';
            let el = document.querySelector(`meta[${attr}="${name}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        setMeta('description', description);
        setMeta('keywords', keywords);
        setMeta('og:title', ogTitle || title, true);
        setMeta('og:description', ogDescription || description, true);
        setMeta('og:image', ogImage, true);
        setMeta('og:type', 'website', true);
        if (ogUrl) setMeta('og:url', ogUrl, true);

        // Canonical
        if (canonicalUrl) {
            let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', 'canonical');
                document.head.appendChild(link);
            }
            link.setAttribute('href', canonicalUrl);
        }
    }, [title, description, keywords, ogTitle, ogDescription, ogImage, ogUrl, canonicalUrl]);

    return null;
}
