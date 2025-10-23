#!/bin/bash

# WarmSwarm Development Environment Startup Script

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

echo "🐝 Starting WarmSwarm development environment..."

# Create directories if they don't exist
mkdir -p .pids logs backend/logs

# Start backend server
echo "📡 Starting backend server on port 4444..."
cd backend && npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo $BACKEND_PID > .pids/backend.pid
echo "   Backend PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 2

# Start frontend server
echo "🎨 Starting frontend server on port 3333..."
npm run dev > logs/frontend.log 2>&1 &
FRONTEND_PID=$!
echo $FRONTEND_PID > .pids/frontend.pid
echo "   Frontend PID: $FRONTEND_PID"

# Wait a moment for services to initialize
sleep 3

echo ""
echo "✅ All services started!"
echo ""
echo "📊 Service URLs:"
echo "   Frontend:  http://localhost:3333"
echo "   Backend:   http://localhost:4444"
echo ""
echo "📝 Logs:"
echo "   Frontend:  tail -f logs/frontend.log"
echo "   Backend:   tail -f logs/backend.log"
echo ""
echo "🛑 To stop all services, run: ./scripts/stop-dev.sh"
echo ""

