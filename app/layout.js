import { Toaster } from 'sonner';
import Script from "next/script";
import "@/app/styles/global.css";
import {
  PoppinsBlack,
  PoppinsBold,
  PoppinsExtraBold,
  PoppinsExtraLight,
  PoppinsLight,
  PoppinsMedium,
  PoppinsRegular,
  PoppinsSemiBold,
  PoppinsThin,
} from "@/app/fonts/font";

const SITE_URL = "https://www.433tips.com";
const BANNER_URL = "https://raw.githubusercontent.com/DarknessMonarch/433tip/refs/heads/master/public/assets/banner.png";

export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "433Tips - Sports Betting Predictions & Tips",
    template: "%s | 433Tips"
  },
  applicationName: "433Tips",
  description: "Get expert sports betting predictions and tips on football, soccer, basketball, and more at 433Tips. Join us for winning insights and tips to boost your betting game.",
  authors: [{ name: "433Tips", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "433Tips",
    "sports betting",
    "betting predictions",
    "football tips",
    "soccer predictions",
    "basketball betting",
    "betting strategies",
    "sports analysis",
    "betting odds",
    "expert predictions",
    "vip tips",
    "betting tips",
    "sports predictions"
  ],

  openGraph: {
    type: "website",
    locale: "en_US",
    title: "433Tips - Sports Betting Predictions & Tips",
    description: "Get expert sports betting predictions and tips on football, soccer, basketball, and more at 433Tips. Join us for winning insights and tips to boost your betting game.",
    url: SITE_URL,
    siteName: "433Tips",
    images: [{
      url: BANNER_URL,
      width: 1200,
      height: 630,
      alt: "433Tips Banner"
    }]
  },

  twitter: {
    card: "summary_large_image",
    title: "433Tips - Sports Betting Predictions & Tips",
    description: "Expert sports betting predictions and tips",
    images: [BANNER_URL],
    creator: "@433Tips"
  },

  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    }
  },

  verification: {
    google: "",
    yandex: "",
  },

  alternates: {
    canonical: SITE_URL,
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    shortcut: "/favicon.ico"
  },

  theme: {
    color: "#0a0e1a"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PayPal SDK */}
        <Script
          id="paypal-sdk"
          strategy="lazyOnload"
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}`}
        />

        {/* Google Analytics */}
        <Script
          id="ga-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-47C54HY3HD"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-47C54HY3HD', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body
        className={`
          ${PoppinsBlack.variable}
          ${PoppinsBold.variable} 
          ${PoppinsExtraBold.variable}
          ${PoppinsExtraLight.variable}
          ${PoppinsLight.variable} 
          ${PoppinsMedium.variable} 
          ${PoppinsRegular.variable} 
          ${PoppinsSemiBold.variable}
          ${PoppinsThin.variable}
          min-h-screen bg-[#0a0e1a]
        `}
      >
        <Toaster
          position="top-center"
          richColors={true}
          toastOptions={{
            style: {
              background: "#09122eff",
              border: "1px solid #1c2b4b",
              color: "#6cd7ffff",
              borderRadius: "15px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}