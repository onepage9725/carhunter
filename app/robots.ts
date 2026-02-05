import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.byride.my'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin93193913/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
