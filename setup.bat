@echo off
echo 🚀 Setting up Chick-fil-A Employee Portal with Neon Backend
echo ============================================================

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

:: Setup Backend
echo.
echo 📦 Setting up backend...
cd backend

if not exist .env (
    echo 📝 Creating backend .env file...
    copy .env.example .env
    echo ⚠️  Please update backend\.env with your Neon database credentials!
)

echo 📥 Installing backend dependencies...
call npm install

echo.
echo 🏠 Setting up frontend...
cd ..

if not exist .env (
    echo 📝 Frontend .env already exists
)

echo 📥 Installing frontend dependencies...
call npm install

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update backend\.env with your Neon database URL
echo 2. Run database migrations: cd backend ^&^& npm run migrate
echo 3. Seed the database: cd backend ^&^& npm run seed
echo 4. Start the backend: cd backend ^&^& npm run dev
echo 5. Start the frontend: npm start
echo.
echo 📚 For detailed instructions, see backend\README.md

pause
