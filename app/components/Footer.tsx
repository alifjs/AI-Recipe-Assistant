'use client';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">AI Recipe Assistant</h3>
            <p className="text-gray-300">
              Your personal kitchen companion powered by artificial intelligence.
              Get personalized recipes, meal plans, and cooking advice.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Recipe Suggestions</li>
              <li>Meal Planning</li>
              <li>Nutritional Information</li>
              <li>Recipe Modifications</li>
              <li>AI Chat Assistant</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <p className="text-gray-300">
              Have questions or feedback? We'd love to hear from you!
            </p>
            <p className="text-gray-300 mt-2">
              Email: info@airecipeassistant.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AI Recipe Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 