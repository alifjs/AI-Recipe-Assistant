import Header from './components/Header';
import Footer from './components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-teal-500 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Your AI-Powered Kitchen Companion
                </h1>
                <p className="text-xl mb-8">
                  Transform your cooking experience with personalized recipes, meal plans, and culinary advice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/recipes"
                    className="bg-white text-green-600 hover:bg-green-100 px-6 py-3 rounded-md font-semibold text-center transition-colors"
                  >
                    Find Recipes
                  </Link>
                  <Link
                    href="/meal-plans"
                    className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 px-6 py-3 rounded-md font-semibold text-center transition-colors"
                  >
                    Create Meal Plan
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-full max-w-md h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600&auto=format&fit=crop"
                    alt="Cooking with AI"
                    fill
                    className="object-cover rounded-lg shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              How AI Recipe Assistant Helps You
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-green-600 text-4xl mb-4">🥗</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Recipe Suggestions</h3>
                <p className="text-gray-600">
                  Input the ingredients you have, and get creative recipe ideas instantly. No more wasted food or boring meals.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-green-600 text-4xl mb-4">📅</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Meal Planning</h3>
                <p className="text-gray-600">
                  Get personalized weekly meal plans based on your dietary preferences and calorie goals.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-green-600 text-4xl mb-4">🍽️</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Recipe Modifications</h3>
                <p className="text-gray-600">
                  Adapt any recipe to fit your dietary needs, whether it's gluten-free, vegan, or low-carb.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
              How It Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Input Ingredients</h3>
                <p className="text-gray-600">
                  Tell us what ingredients you have available in your kitchen.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Set Preferences</h3>
                <p className="text-gray-600">
                  Specify any dietary preferences or restrictions you have.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">AI Generation</h3>
                <p className="text-gray-600">
                  Our AI creates personalized recipes or meal plans for you.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Start Cooking</h3>
                <p className="text-gray-600">
                  Follow the detailed instructions and enjoy your delicious meal!
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Cooking Experience?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Start creating personalized recipes and meal plans with the power of AI today.
            </p>
            <Link
              href="/recipes"
              className="bg-white text-green-600 hover:bg-green-100 px-8 py-3 rounded-md font-semibold inline-block transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
