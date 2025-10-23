#!/bin/bash

# WarmSwarm Development Environment Status Script

echo "🔍 WarmSwarm Service Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check frontend
echo ""
echo "🎨 Frontend (Port 3333):"
if [ -f .pids/frontend.pid ]; then
    FRONTEND_PID=$(cat .pids/frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        echo "   ✅ Running (PID: $FRONTEND_PID)"
        echo "   🌐 URL: http://localhost:3333"
    else
        echo "   ❌ Not running (stale PID file)"
    fi
else
    # Check if something is running on the port
    if lsof -Pi :3333 -sTCP:LISTEN -t >/dev/null 2>&1; then
        PROC_PID=$(lsof -Pi :3333 -sTCP:LISTEN -t)
        echo "   ⚠️  Running but not tracked (PID: $PROC_PID)"
    else
        echo "   ❌ Not running"
    fi
fi

# Check backend
echo ""
echo "📡 Backend (Port 4444):"
if [ -f .pids/backend.pid ]; then
    BACKEND_PID=$(cat .pids/backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        echo "   ✅ Running (PID: $BACKEND_PID)"
        echo "   🌐 URL: http://localhost:4444"
    else
        echo "   ❌ Not running (stale PID file)"
    fi
else
    # Check if something is running on the port
    if lsof -Pi :4444 -sTCP:LISTEN -t >/dev/null 2>&1; then
        PROC_PID=$(lsof -Pi :4444 -sTCP:LISTEN -t)
        echo "   ⚠️  Running but not tracked (PID: $PROC_PID)"
    else
        echo "   ❌ Not running"
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""


