# AI Recipe Assistant

AI Recipe Assistant is a web application that brings the power of artificial intelligence to your culinary experience. This app helps you make the most out of the ingredients you have on hand, offering personalized meal suggestions, tailored meal plans, and much more.

## Live Site
https://dish-dive-ai.netlify.app/

## Features

- **Recipe Suggestions**: Input the ingredients you have, and the AI generates creative recipes you can cook with those items.
- **Meal Planning**: Get a full week's worth of meals based on your dietary preferences and calorie goals.
- **Nutritional Information**: Each recipe comes with detailed nutritional info about calories, protein, carbs, and more.
- **Recipe Modifications**: Modify any recipe to meet specific dietary needs (gluten-free, vegan, etc.).
- **AI Chat**: Ask questions about cooking techniques or ingredient substitutes with the built-in AI-powered chat assistant.

## Tech Stack

- **Frontend**: Next.js and Tailwind CSS
- **State Management**: Redux Toolkit with RTK Query
- **API**: OpenAI API for generating recipes, meal plans, and chat responses

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-recipe-assistant.git
   cd ai-recipe-assistant
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### Finding Recipes

1. Navigate to the "Recipes" page
2. Enter the ingredients you have
3. Select any dietary preferences or meal types
4. Click "Generate Recipes"
5. Browse through the AI-generated recipe suggestions

### Creating Meal Plans

1. Navigate to the "Meal Plans" page
2. Select the number of days for your meal plan
3. Set your calorie goal (if desired)
4. Choose any dietary preferences
5. Click "Generate Meal Plan"
6. View your personalized meal plan with breakfast, lunch, dinner, and snacks for each day

### Using the AI Chat

1. Navigate to the "Chat" page
2. Ask any cooking-related question
3. Get instant answers about cooking techniques, ingredient substitutions, and more

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for providing the API that powers the AI features
- Next.js and Tailwind CSS for the frontend framework and styling
- All contributors who have helped improve this project
