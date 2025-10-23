#!/bin/bash

# WarmSwarm Development Environment Shutdown Script

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project root
cd "$PROJECT_ROOT"

echo "🛑 Stopping WarmSwarm development environment..."

# Function to kill process and its children
kill_process_tree() {
    local pid=$1
    local sig=${2:-TERM}
    
    if [ -n "$pid" ] && ps -p $pid > /dev/null 2>&1; then
        # Get all child processes
        local children=$(pgrep -P $pid)
        
        # Kill children first
        for child in $children; do
            kill_process_tree $child $sig
        done
        
        # Kill the parent process
        kill -$sig $pid 2>/dev/null
        echo "   Stopped process $pid"
    fi
}

# Stop frontend
if [ -f .pids/frontend.pid ]; then
    FRONTEND_PID=$(cat .pids/frontend.pid)
    echo "🎨 Stopping frontend (PID: $FRONTEND_PID)..."
    kill_process_tree $FRONTEND_PID
    rm .pids/frontend.pid
else
    echo "⚠️  Frontend PID file not found"
fi

# Stop backend
if [ -f .pids/backend.pid ]; then
    BACKEND_PID=$(cat .pids/backend.pid)
    echo "📡 Stopping backend (PID: $BACKEND_PID)..."
    kill_process_tree $BACKEND_PID
    rm .pids/backend.pid
else
    echo "⚠️  Backend PID file not found"
fi

# Cleanup any remaining node processes on our ports
echo "🧹 Cleaning up any remaining processes on ports 3333 and 4444..."
lsof -ti:3333 | xargs kill -9 2>/dev/null || true
lsof -ti:4444 | xargs kill -9 2>/dev/null || true

echo ""
echo "✅ All services stopped!"
echo ""


