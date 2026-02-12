import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SocialLinker - AI驱动的社交连接平台',
  description: '基于 SecondMe 的智能社交连接应用',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
