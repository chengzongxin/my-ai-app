'use client';

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendMessage, Message } from '../utils/api';

const hotTopics = [
  "介绍一下人工智能",
  "解释量子计算",
  "如何学习编程",
  "气候变化的影响",
  "未来的工作趋势"
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      setInput('');

      try {
        const aiResponse = await sendMessage([...messages, userMessage]);
        const aiMessage: Message = { role: 'assistant', content: aiResponse };
        setMessages(prevMessages => [...prevMessages, aiMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        // 可以在这里添加错误处理逻辑，比如显示一个错误消息给用户
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTopicClick = (topic: string) => {
    setInput(topic);
    handleSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-2">热门话题：</h2>
        <div className="flex flex-wrap gap-2">
          {hotTopics.map((topic, index) => (
            <button
              key={index}
              onClick={() => handleTopicClick(topic)}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[calc(100vh-300px)] p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.role === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {message.role === 'user' ? (
                <p>{message.content}</p>
              ) : (
                <ReactMarkdown
                  className="prose prose-sm max-w-none dark:prose-invert"
                  components={{
                    h1: ({...props}) => <h1 className="text-2xl font-bold my-4" {...props} />,
                    h2: ({...props}) => <h2 className="text-xl font-semibold my-3" {...props} />,
                    h3: ({...props}) => <h3 className="text-lg font-medium my-2" {...props} />,
                    p: ({...props}) => <p className="my-2" {...props} />,
                    ul: ({...props}) => <ul className="list-disc list-inside my-2" {...props} />,
                    ol: ({...props}) => <ol className="list-decimal list-inside my-2" {...props} />,
                    li: ({...props}) => <li className="my-1" {...props} />,
                    a: ({...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                    blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                    pre: ({ ...props }) => (
                      <div className="overflow-auto my-2 bg-gray-800 p-2 rounded">
                        <pre {...props} className="text-gray-100" />
                      </div>
                    ),
                    code: ({ className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || '');
                      return className && match ? (
                        <code className={`${className} text-gray-100 block p-2`} {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className="bg-gray-200 text-gray-800 px-1 rounded" {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="输入您的问题..."
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-2 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isLoading ? '发送中...' : '发送'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
