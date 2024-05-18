import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from '@/context/ThemeProvider';
import { ReactQueryProvider } from '@/context/ReactQueryProvider';


const inter = Inter( {subsets: ['latin']} )

export const metadata = {
  title: 'Clubblit',
  description: 'Club funding made easy',
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider>
      <html lang="en">
          <body className={inter.className}>
            <ThemeProvider attribute="class">
              <ReactQueryProvider>
                  <Toaster position="top-right" reverseOrder={false} />
                  <main>{children}</main>
              </ReactQueryProvider>
            </ThemeProvider>
          </body>
      </html>
    </ClerkProvider>
  )
}