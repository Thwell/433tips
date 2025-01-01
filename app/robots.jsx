export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/page/football',
          '/page/otherSport',
          '/page/about',
          '/page/terms',
          '/page/contact',
        ],
        disallow: [
          '/authentication/*',
          '/page/dashboard/*',
          '/page/settings/*',
          '/api/*',
          '/page/payment/*',
          '/page/vip/*',
          '/*?*', // Disallow URLs with query parameters
          '/*.json$', // Disallow JSON files
          '/private/',
        ],
        crawlDelay: 2
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/']  
      },
      {
        userAgent: 'CCBot',
        disallow: ['/']  
      }
    ],
    sitemap: 'https://www.433tips.com/sitemap.xml',
    host: 'https://www.433tips.com'
  }
}