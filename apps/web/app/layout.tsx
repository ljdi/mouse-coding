import { getDefaultSizeMap } from '@/utils'
import { StoreProvider } from '@mc/store/providers/store-provider'
import '@mc/ui/globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mouse Coding',
  description: 'Mouse Coding',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultSizeMap = await getDefaultSizeMap()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider initialState={{ defaultSizeMap }}>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
