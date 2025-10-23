#!/bin/bash

# WarmSwarm Development Environment Restart Script

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root
cd "$PROJECT_ROOT"

echo "🔄 Restarting WarmSwarm development environment..."
echo ""

# Stop services
./scripts/stop-dev.sh

# Wait a moment
sleep 2

# Start services
./scripts/start-dev.sh


