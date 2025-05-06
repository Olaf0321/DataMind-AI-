'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // 認証が必要なページのパス
  const protectedPaths = ['/dashboard'];
  // 認証済みユーザーがアクセスできないパス
  const authPaths = ['/login', '/signup'];

  useEffect(() => {
    if (!loading) {
      if (user && authPaths.includes(pathname)) {
        window.location.href = '/dashboard';
      } else if (!user && protectedPaths.includes(pathname)) {
        window.location.href = '/login';
      }
    }
  }, [user, loading, pathname]);

  if (loading) {
    return (
      <html lang="ja">
        <body className={inter.className}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="ja">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 