#!/bin/bash

echo "🚀 Starting AI Receptionist servers..."
echo ""

# Kill any existing processes
echo "🛑 Stopping existing servers..."
pkill -f "next dev" 2>/dev/null
pkill -f "node server/backend.js" 2>/dev/null

# Wait a moment
sleep 1

echo "✅ Starting servers with concurrently..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo ""

# Start both servers
npm run dev:all

