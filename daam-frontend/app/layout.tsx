import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import NextAuthSessionProvider from '@/providers/SessionProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Project DAAM - Decentralized Autonomous Asset Manager',
  description: 'AI-powered autonomous asset management on blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-gray-900`}>
        <NextAuthSessionProvider>
          {children}
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}
