import React from 'react';
import { Metadata } from 'next';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'AI 助手 - 首页',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto py-4 flex flex-col w-full">
        <h1 className="text-3xl font-bold text-center mb-4 text-gray-800">
          欢迎使用AI助手
        </h1>
        <div className="flex-grow w-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
}
