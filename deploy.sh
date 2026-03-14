#!/bin/bash

# BetMind AI Deployment Script
echo "🚀 Starting BetMind AI Deployment..."

# 1. Pull latest changes if using git
# git pull origin main

# 2. Build and restart services
echo "📦 Building production images..."
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Clean up unused images
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete! System is live."
