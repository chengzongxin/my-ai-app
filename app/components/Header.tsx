import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <Link href="/" className="text-xl font-semibold text-blue-600">
          AI助手
        </Link>
      </nav>
    </header>
  );
};

export default Header;
