# WarmSwarm AWS Deployment Guide

## Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Docker installed** and running
3. **Route 53 hosted zone** for your domain

## Deployment Steps

### 1. Deploy Infrastructure and Images

```bash
# Make scripts executable
chmod +x deploy.sh route53-setup.sh

# Deploy ECR repositories and push Docker images
./deploy.sh

# Deploy AWS infrastructure (VPC, ECS, RDS, ALB)
aws cloudformation deploy \
    --template-file infrastructure.yml \
    --stack-name warmswarm-infra \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides DomainName=yourdomain.com
```

### 2. Configure Route 53

1. Find your hosted zone ID:
```bash
aws route53 list-hosted-zones --query 'HostedZones[?Name==`yourdomain.com.`].Id' --output text
```

2. Edit `route53-setup.sh` and update:
   - `DOMAIN_NAME="yourdomain.com"`
   - `HOSTED_ZONE_ID="Z1234567890123"`

3. Run the Route 53 setup:
```bash
./route53-setup.sh
```

### 3. Verify Deployment

Your application should be available at `http://yourdomain.com` within a few minutes.

## Architecture Overview

- **Frontend**: Next.js app on ECS Fargate
- **Backend**: Node.js/Express API on ECS Fargate  
- **Database**: RDS PostgreSQL in private subnets
- **Load Balancer**: ALB with path-based routing
- **Storage**: ECR for Docker images

## Monitoring and Logs

View logs in CloudWatch:
- Frontend logs: `/ecs/warmswarm-frontend`
- Backend logs: `/ecs/warmswarm-backend`

## Updating Your Application

To deploy updates:

1. Rebuild and push new images:
```bash
./deploy.sh
```

2. Force ECS service update:
```bash
aws ecs update-service --cluster warmswarm-cluster --service warmswarm-frontend --force-new-deployment
aws ecs update-service --cluster warmswarm-cluster --service warmswarm-backend --force-new-deployment
```

## Cost Optimization

- RDS instance: `db.t3.micro` (free tier eligible)
- ECS tasks: 0.5 vCPU, 1GB RAM each
- Estimated cost: ~$30-50/month

## Troubleshooting

1. **Services not starting**: Check CloudWatch logs
2. **Database connection issues**: Verify security groups and RDS endpoint
3. **Load balancer 503 errors**: Check target group health in EC2 console