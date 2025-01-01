export default function manifest() {
  return {
    name: '433tips',
    short_name: '433tips',
    description: 'Get expert sports betting predictions and tips on football, soccer, basketball, and more at 433Tips. Join us for winning insights and tips to boost your betting game.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0e1a',
    theme_color: '#0a0e1a',
    categories: ['sports', 'tips', 'predictions', 'betting', 'football', 'soccer', 'basketball'],
    
    icons: [
      {
        src:  '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src:  '/assets/logo.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src:  '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src:  '/assets/logo.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],

    // Splash screen settings
    // splash_pages: null,

  
    prefer_related_applications: false,

    lang: 'en',
    dir: 'ltr',


    related_applications: [],
    shortcuts: [
      {
        name: 'Football Tips',
        short_name: 'Football',
        description: 'View latest football predictions',
        url: '/page/football',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Other Sports',
        short_name: 'Other Sports',
        description: 'View other sports predictions such as tennis, basketball, and more',
        url: '/page/otherSport',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
      {
        name: 'Vi[] Tips',
        short_name: 'Vip',
        description: 'View VIP sports predictions',
        url: '/page/vip',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },
    ],

    screenshots: [
      {
        src: '/screenshots/banner.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Home Screen'
      }
    ]
  }
}