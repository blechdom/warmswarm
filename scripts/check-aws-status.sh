#!/bin/bash

# AWS Deployment Status Check Script

AWS_REGION="us-west-1"
PROJECT_NAME="warmswarm"
STACK_NAME="warmswarm-infra-no-ssl"  # Change if using SSL stack

echo "🔍 Checking WarmSwarm AWS Deployment Status"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check CloudFormation Stack
echo "📦 CloudFormation Stack Status:"
aws cloudformation describe-stacks \
  --stack-name $STACK_NAME \
  --region $AWS_REGION \
  --query 'Stacks[0].StackStatus' \
  --output text 2>/dev/null || echo "   ❌ Stack not found or error accessing"
echo ""

# Check ECS Cluster
echo "🐳 ECS Cluster:"
aws ecs describe-clusters \
  --clusters ${PROJECT_NAME}-cluster \
  --region $AWS_REGION \
  --query 'clusters[0].status' \
  --output text 2>/dev/null || echo "   ❌ Cluster not found"
echo ""

# Check Backend Service
echo "📡 Backend Service Status:"
aws ecs describe-services \
  --cluster ${PROJECT_NAME}-cluster \
  --services ${PROJECT_NAME}-backend \
  --region $AWS_REGION \
  --query 'services[0].[status, runningCount, desiredCount]' \
  --output text 2>/dev/null || echo "   ❌ Service not found"

echo ""
echo "   Backend Tasks:"
aws ecs list-tasks \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-backend \
  --region $AWS_REGION \
  --query 'taskArns' \
  --output text 2>/dev/null | wc -w | xargs -I {} echo "      Running tasks: {}"

# Get task details
BACKEND_TASK=$(aws ecs list-tasks \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-backend \
  --region $AWS_REGION \
  --query 'taskArns[0]' \
  --output text 2>/dev/null)

if [ "$BACKEND_TASK" != "None" ] && [ -n "$BACKEND_TASK" ]; then
  echo "      Latest task status:"
  aws ecs describe-tasks \
    --cluster ${PROJECT_NAME}-cluster \
    --tasks $BACKEND_TASK \
    --region $AWS_REGION \
    --query 'tasks[0].[lastStatus, healthStatus, containers[0].lastStatus]' \
    --output text 2>/dev/null | xargs -I {} echo "         {}"
fi

echo ""

# Check Frontend Service
echo "🎨 Frontend Service Status:"
aws ecs describe-services \
  --cluster ${PROJECT_NAME}-cluster \
  --services ${PROJECT_NAME}-frontend \
  --region $AWS_REGION \
  --query 'services[0].[status, runningCount, desiredCount]' \
  --output text 2>/dev/null || echo "   ❌ Service not found"

echo ""
echo "   Frontend Tasks:"
aws ecs list-tasks \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-frontend \
  --region $AWS_REGION \
  --query 'taskArns' \
  --output text 2>/dev/null | wc -w | xargs -I {} echo "      Running tasks: {}"

# Get task details
FRONTEND_TASK=$(aws ecs list-tasks \
  --cluster ${PROJECT_NAME}-cluster \
  --service-name ${PROJECT_NAME}-frontend \
  --region $AWS_REGION \
  --query 'taskArns[0]' \
  --output text 2>/dev/null)

if [ "$FRONTEND_TASK" != "None" ] && [ -n "$FRONTEND_TASK" ]; then
  echo "      Latest task status:"
  aws ecs describe-tasks \
    --cluster ${PROJECT_NAME}-cluster \
    --tasks $FRONTEND_TASK \
    --region $AWS_REGION \
    --query 'tasks[0].[lastStatus, healthStatus, containers[0].lastStatus]' \
    --output text 2>/dev/null | xargs -I {} echo "         {}"
fi

echo ""

# Check Target Groups
echo "🎯 Target Group Health:"
echo "   Backend Target Group:"
BACKEND_TG_ARN=$(aws elbv2 describe-target-groups \
  --region $AWS_REGION \
  --query "TargetGroups[?TargetGroupName=='${PROJECT_NAME}-backend-tg'].TargetGroupArn" \
  --output text 2>/dev/null)

if [ -n "$BACKEND_TG_ARN" ]; then
  aws elbv2 describe-target-health \
    --target-group-arn $BACKEND_TG_ARN \
    --region $AWS_REGION \
    --query 'TargetHealthDescriptions[*].[Target.Id, TargetHealth.State, TargetHealth.Reason]' \
    --output text 2>/dev/null | while read line; do echo "      $line"; done
else
  echo "      ❌ Target group not found"
fi

echo ""
echo "   Frontend Target Group:"
FRONTEND_TG_ARN=$(aws elbv2 describe-target-groups \
  --region $AWS_REGION \
  --query "TargetGroups[?TargetGroupName=='${PROJECT_NAME}-frontend-tg'].TargetGroupArn" \
  --output text 2>/dev/null)

if [ -n "$FRONTEND_TG_ARN" ]; then
  aws elbv2 describe-target-health \
    --target-group-arn $FRONTEND_TG_ARN \
    --region $AWS_REGION \
    --query 'TargetHealthDescriptions[*].[Target.Id, TargetHealth.State, TargetHealth.Reason]' \
    --output text 2>/dev/null | while read line; do echo "      $line"; done
else
  echo "      ❌ Target group not found"
fi

echo ""

# Check Load Balancer
echo "⚖️  Load Balancer:"
aws elbv2 describe-load-balancers \
  --region $AWS_REGION \
  --query "LoadBalancers[?LoadBalancerName=='${PROJECT_NAME}-alb'].[DNSName, State.Code]" \
  --output text 2>/dev/null || echo "   ❌ Load balancer not found"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 To view logs:"
echo "   Backend:  aws logs tail /ecs/${PROJECT_NAME}-backend --follow --region $AWS_REGION"
echo "   Frontend: aws logs tail /ecs/${PROJECT_NAME}-frontend --follow --region $AWS_REGION"
echo ""


