#!/bin/bash

# AWS Deployment Script for WarmSwarm
# Run this script to deploy your application to AWS

set -e

# Configuration
AWS_REGION="us-west-1"  # Change this to your preferred region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
PROJECT_NAME="warmswarm"

echo "🚀 Starting AWS deployment for $PROJECT_NAME"
echo "AWS Region: $AWS_REGION"
echo "AWS Account: $AWS_ACCOUNT_ID"

# Step 1: Create ECR repositories
echo "📦 Creating ECR repositories..."
aws ecr describe-repositories --repository-names "$PROJECT_NAME-frontend" --region $AWS_REGION || \
aws ecr create-repository --repository-name "$PROJECT_NAME-frontend" --region $AWS_REGION

aws ecr describe-repositories --repository-names "$PROJECT_NAME-backend" --region $AWS_REGION || \
aws ecr create-repository --repository-name "$PROJECT_NAME-backend" --region $AWS_REGION

# Step 2: Login to ECR
echo "🔑 Logging into ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

# Step 3: Build and push frontend image
echo "🏗️ Building and pushing frontend image..."
docker build -t $PROJECT_NAME-frontend .
docker tag $PROJECT_NAME-frontend:latest $ECR_REGISTRY/$PROJECT_NAME-frontend:latest
docker push $ECR_REGISTRY/$PROJECT_NAME-frontend:latest

# Step 4: Build and push backend image
echo "🏗️ Building and pushing backend image..."
docker build -t $PROJECT_NAME-backend ./backend
docker tag $PROJECT_NAME-backend:latest $ECR_REGISTRY/$PROJECT_NAME-backend:latest
docker push $ECR_REGISTRY/$PROJECT_NAME-backend:latest

echo "✅ Docker images pushed successfully!"
echo "Frontend image: $ECR_REGISTRY/$PROJECT_NAME-frontend:latest"
echo "Backend image: $ECR_REGISTRY/$PROJECT_NAME-backend:latest"

echo "📋 Next steps:"
echo "1. Run: aws cloudformation deploy --template-file infrastructure.yml --stack-name warmswarm-infra --capabilities CAPABILITY_IAM"
echo "2. Update Route 53 record with the ALB DNS name from CloudFormation outputs"