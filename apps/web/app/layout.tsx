import { StoreProvider } from '@mc/store/providers/store-provider'
import '@mc/ui/globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import { cookies } from 'next/headers'
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
  const cookieStore = await cookies()
  const layout = cookieStore.get('react-resizable-panels:layout')

  let defaultLayout: number[] | undefined
  if (layout) {
    defaultLayout = JSON.parse(layout.value) as typeof defaultLayout
  }
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StoreProvider initialState={{ defaultLayout }}>
            {children}
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
