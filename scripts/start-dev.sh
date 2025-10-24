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
(cd backend && npm run dev > ../logs/backend.log 2>&1) &
BACKEND_PID=$!
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
echo "🔍 Verifying services started..."

# Check if processes are still running
BACKEND_RUNNING=false
FRONTEND_RUNNING=false

if ps -p $BACKEND_PID > /dev/null 2>&1; then
    BACKEND_RUNNING=true
    echo "✅ Backend process running (PID: $BACKEND_PID)"
else
    echo "❌ Backend process died! Check logs/backend.log"
    tail -20 logs/backend.log 2>/dev/null || echo "   (No log file found)"
fi

if ps -p $FRONTEND_PID > /dev/null 2>&1; then
    FRONTEND_RUNNING=true
    echo "✅ Frontend process running (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend process died! Check logs/frontend.log"
    tail -20 logs/frontend.log 2>/dev/null || echo "   (No log file found)"
fi

# Check if ports are actually listening (with retries)
echo ""
echo "🔍 Checking ports..."

# Function to wait for port to be listening
wait_for_port() {
    local port=$1
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        # Use ss to check if port is listening (more reliable than lsof)
        if ss -ltn | grep -q ":$port "; then
            return 0
        fi
        sleep 1
        attempt=$((attempt + 1))
    done
    return 1
}

if wait_for_port 3333; then
    echo "✅ Frontend listening on port 3333"
else
    echo "❌ Nothing listening on port 3333 after 10 seconds!"
    FRONTEND_RUNNING=false
fi

if wait_for_port 4444; then
    echo "✅ Backend listening on port 4444"
else
    echo "❌ Nothing listening on port 4444 after 10 seconds!"
    BACKEND_RUNNING=false
fi

echo ""

# Final status
if [ "$BACKEND_RUNNING" = true ] && [ "$FRONTEND_RUNNING" = true ]; then
    echo "✅ All services started successfully!"
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
else
    echo "❌ Some services failed to start!"
    echo ""
    echo "📝 Check logs for details:"
    if [ "$BACKEND_RUNNING" = false ]; then
        echo "   Backend:   tail -f logs/backend.log"
    fi
    if [ "$FRONTEND_RUNNING" = false ]; then
        echo "   Frontend:  tail -f logs/frontend.log"
    fi
    echo ""
    exit 1
fi

