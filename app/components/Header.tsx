'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-600 to-teal-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold flex items-center">
          <span className="mr-2">🍳</span>
          AI Recipe Assistant
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-green-200 transition-colors">
            Home
          </Link>
          <Link href="/recipes" className="hover:text-green-200 transition-colors">
            Recipes
          </Link>
          <Link href="/meal-plans" className="hover:text-green-200 transition-colors">
            Meal Plans
          </Link>
          <Link href="/chat" className="hover:text-green-200 transition-colors">
            AI Chat
          </Link>
        </nav>
      </div>
      
      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-green-700 px-4 py-2">
          <div className="flex flex-col space-y-2">
            <Link href="/" className="py-2 hover:text-green-200 transition-colors">
              Home
            </Link>
            <Link href="/recipes" className="py-2 hover:text-green-200 transition-colors">
              Recipes
            </Link>
            <Link href="/meal-plans" className="py-2 hover:text-green-200 transition-colors">
              Meal Plans
            </Link>
            <Link href="/chat" className="py-2 hover:text-green-200 transition-colors">
              AI Chat
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
} 