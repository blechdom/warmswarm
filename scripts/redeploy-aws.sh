#!/bin/bash

# Quick redeploy script for AWS

set -e

AWS_REGION="us-west-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
PROJECT_NAME="warmswarm"

echo "🚀 Redeploying WarmSwarm to AWS"
echo ""

# Login to ECR
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Build and push frontend image
echo ""
echo "🏗️  Building frontend image..."
docker build -t $PROJECT_NAME-frontend .
echo "📤 Pushing frontend image..."
docker tag $PROJECT_NAME-frontend:latest $ECR_REGISTRY/$PROJECT_NAME-frontend:latest
docker push $ECR_REGISTRY/$PROJECT_NAME-frontend:latest

# Build and push backend image
echo ""
echo "🏗️  Building backend image..."
docker build -t $PROJECT_NAME-backend ./backend
echo "📤 Pushing backend image..."
docker tag $PROJECT_NAME-backend:latest $ECR_REGISTRY/$PROJECT_NAME-backend:latest
docker push $ECR_REGISTRY/$PROJECT_NAME-backend:latest

# Force update frontend service
echo ""
echo "🔄 Forcing frontend service update..."
aws ecs update-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service ${PROJECT_NAME}-frontend \
  --force-new-deployment \
  --region $AWS_REGION \
  --output text > /dev/null

# Force update backend service
echo "🔄 Forcing backend service update..."
aws ecs update-service \
  --cluster ${PROJECT_NAME}-cluster \
  --service ${PROJECT_NAME}-backend \
  --force-new-deployment \
  --region $AWS_REGION \
  --output text > /dev/null

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "⏱️  Services will take 2-5 minutes to update."
echo "   Monitor progress: ./scripts/check-aws-status.sh"
echo "   View logs: aws logs tail /ecs/${PROJECT_NAME}-frontend --follow --region $AWS_REGION"
echo ""


