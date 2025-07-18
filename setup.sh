#!/bin/bash

echo "🚀 Setting up Chick-fil-A Employee Portal with Neon Backend"
echo "============================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Setup Backend
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -f .env ]; then
    echo "📝 Creating backend .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your Neon database credentials!"
fi

echo "📥 Installing backend dependencies..."
npm install

echo ""
echo "🏠 Setting up frontend..."
cd ..

if [ ! -f .env ]; then
    echo "📝 Frontend .env already exists"
fi

echo "📥 Installing frontend dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your Neon database URL"
echo "2. Run database migrations: cd backend && npm run migrate"
echo "3. Seed the database: cd backend && npm run seed"
echo "4. Start the backend: cd backend && npm run dev"
echo "5. Start the frontend: npm start"
echo ""
echo "📚 For detailed instructions, see backend/README.md"
