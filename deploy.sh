#!/bin/bash

# BetMind AI Enhanced Deployment Script
set -e # Exit on error

echo "----------------------------------------------------"
echo "🚀 Starting AI Sport Deployment: $(date)"
echo "----------------------------------------------------"

# 1. Verification
if [ ! -f "docker-compose.prod.yml" ]; then
    echo "❌ Error: docker-compose.prod.yml not found!"
    exit 1
fi

# 2. Pull latest changes (handled by GitHub Action, but good as a backup)
# echo "📥 Pulling latest changes..."
# git pull origin main

# 3. Build and restart services
echo "📦 Building and starting production containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Clean up unused images to save disk space
echo "🧹 Cleaning up old images..."
docker image prune -f

# 5. Health Check
echo "🔍 Performing health checks..."
sleep 5 # Wait for services to start

SERVICES=("backend-api" "admin-panel" "ai-engine")
for service in "${SERVICES[@]}"; do
    if docker ps | grep -q "$service"; then
        echo "✅ Service $service is UP"
    else
        echo "❌ Error: Service $service failed to start!"
        docker-compose -f docker-compose.prod.yml logs "$service" | tail -n 20
    fi
done

echo "----------------------------------------------------"
echo "🎉 Deployment complete at $(date)!"
echo "----------------------------------------------------"
