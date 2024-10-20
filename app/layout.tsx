import React from 'react';
import { Metadata } from 'next';
import "./globals.css";

export const metadata: Metadata = {
  title: 'AI 助手 - 智能对话平台',
  description: '使用先进的AI技术，为您提供智能对话服务',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="max-w-7xl mx-auto px-4 w-full">{children}</body>
    </html>
  );
}
