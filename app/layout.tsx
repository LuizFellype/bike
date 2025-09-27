import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { ApolloProviderWrapper } from "@/components/providers/apollo-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import PWAInstallPrompt from "@/components/pwa-install"


const APP_NAME = 'Magno Sport Bike - Gerenciar OS';
const APP_DEFAULT_TITLE = "Gerenciamento de Ordem de Serviços";
const APP_TITLE_TEMPLATE = "%s - Bask Santa";


export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: "Gerencie suas ordens de serviço de forma eficiente e organizada.",

  manifest: "/manifest.json",
  keywords: ["PWA", "React", "Next.js", "Starter Kit", "Components"],
  authors: [{ name: "v0" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_DEFAULT_TITLE,
    title: APP_DEFAULT_TITLE,
    description: "A comprehensive starter kit with PWA capabilities",
  },
  twitter: {
    card: "summary",
    title: APP_DEFAULT_TITLE,
    description: "A comprehensive starter kit with PWA capabilities",
  },
  icons: [
    {
      url: "/icons/favicon-16.png",
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
    },
    {
      url: "/icons/favicon-32.png",
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
    },
    { rel: "apple-touch-icon", url: "https://example.com/apple-icon.png" }
  ],
  other: { charSet: 'utf-8' }
}




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {


  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ApolloProviderWrapper>
          <QueryProvider>
            <Toaster />
            <Header />
            <main className="min-h-screen bg-slate-50">
              <PWAInstallPrompt />
              {children}
            </main>
          </QueryProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  )
}
