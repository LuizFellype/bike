import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { QueryProvider } from "@/components/providers/query-provider"
import { ApolloProviderWrapper } from "@/components/providers/apollo-provider"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "Service Order Management",
  description: "Manage your service orders efficiently",
  generator: "v0.app",
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
            <main className="min-h-screen bg-slate-50">{children}</main>
          </QueryProvider>
        </ApolloProviderWrapper>
      </body>
    </html>
  )
}
