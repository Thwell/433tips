const DOMAIN = 'https://www.433tips.com'
const DEFAULT_PRIORITY = 0.8
const HIGH_PRIORITY = 1.0

const createSitemapEntry = (
  path,
  changeFreq = 'monthly',
  priority = DEFAULT_PRIORITY
) => ({
  url: `${DOMAIN}${encodeURI(path)}`.replace(/&/g, '&amp;'),
  lastModified: new Date(),
  changeFrequency: changeFreq,
  priority,
})

const authRoutes = [
  '/authentication/login',
  '/authentication/verification',
  '/authentication/signup',
  '/authentication/reset',
  '/authentication/resetCode',
].map(path => createSitemapEntry(path, 'yearly', 0.8))

const mainRoutes = [
  createSitemapEntry('/', 'always', HIGH_PRIORITY),
  createSitemapEntry('/page/dashboard', 'always', 0.9),
  createSitemapEntry('/page/dashboard/?card=link', 'always', 0.9),
]

const sportRoutes = [
  createSitemapEntry('/page/football', 'always', 0.9),
  createSitemapEntry('/page/football?date', 'always', 0.9),
  createSitemapEntry('/page/otherSport', 'always', 0.9),
  createSitemapEntry('/page/otherSport?date', 'always', 0.9),
]

const vipRoutes = [
  createSitemapEntry('/page/vip', 'always', 0.9),
  createSitemapEntry('/page/vip?date', 'always', 0.9),
  createSitemapEntry('/page/vip/[slug]?date', 'always', 0.9),
]

const paymentRoutes = [
  createSitemapEntry('/page/payment', 'yearly', 0.9),
  createSitemapEntry('/page/payment/[slug]', 'yearly', 0.9),
  createSitemapEntry('/page/payment/[slug]?plan=standard&amp;price=100&amp;currency=USD', 'yearly', 0.9),
  createSitemapEntry('/page/payment/manual', 'yearly', 0.9),
]

const staticRoutes = [
  createSitemapEntry('/page/contact', 'monthly', 0.9),
  createSitemapEntry('/page/settings', 'weekly', 0.9),
  createSitemapEntry('/page/about', 'yearly', 0.8),
  createSitemapEntry('/page/terms', 'yearly', 0.9),
]

const getDynamicRoutes = async () => {
  return []
}

export default async function sitemap() {
  const dynamicRoutes = await getDynamicRoutes()

  return [
    ...authRoutes,
    ...mainRoutes,
    ...sportRoutes,
    ...vipRoutes,
    ...paymentRoutes,
    ...staticRoutes,
    ...dynamicRoutes,
  ]
}