# Flash Cards - Smart Study Assistant

A modern web application that helps students learn and memorize information more efficiently by automatically generating flashcards from PDF study materials using AI.

## Features

- 📚 Upload PDF study materials to automatically generate flashcards
- 🤖 AI-powered content extraction and summarization
- 🔄 Interactive flashcard interface with flip animations
- 📊 Track your learning progress
- 📱 Responsive design for both desktop and mobile
- 🔒 Secure user authentication
- 💾 Persistent storage of flashcard sets

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS, Framer Motion
- **File Handling**: React Dropzone

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- PostgreSQL database
- OpenAI API key

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the environment variables in `.env`:
   - `NEXTAUTH_URL`: Your application URL (e.g., http://localhost:3000)
   - `NEXTAUTH_SECRET`: A secure random string
   - Email provider settings for authentication
   - `OPENAI_API_KEY`: Your OpenAI API key

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Sign in using your email
2. Upload a PDF study material
3. Wait for the AI to process and generate flashcards
4. Start studying with the generated flashcards
5. Track your progress and review difficult cards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
