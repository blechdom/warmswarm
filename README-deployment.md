# WarmSwarm AWS Deployment Guide

## Prerequisites

1. **AWS CLI configured** with appropriate permissions
2. **Docker installed** and running
3. **Route 53 hosted zone** for your domain

## Deployment Steps

### 1. Find Your Hosted Zone ID

First, find your Route 53 hosted zone ID:
```bash
aws route53 list-hosted-zones --query 'HostedZones[?Name==`warmswarm.org.`].Id' --output text
```

### 2. Update Configuration Files

Edit `route53-setup.sh` and update:
- `DOMAIN_NAME="warmswarm.org"`
- `HOSTED_ZONE_ID="YOUR_ZONE_ID_HERE"`

Make scripts executable:
```bash
chmod +x deploy.sh route53-setup.sh
```

### 3. Deploy Infrastructure (HTTP-only version)

**Note**: Due to SSL certificate validation issues, deploy the HTTP-only version first:

```bash
# Deploy AWS infrastructure without SSL
aws cloudformation deploy \
    --template-file infrastructure-no-ssl.yml \
    --stack-name warmswarm-infra-no-ssl \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides DomainName=warmswarm.org HostedZoneId=YOUR_ZONE_ID_HERE
```

### 4. Build and Push Docker Images

```bash
# Deploy ECR repositories and push Docker images
./deploy.sh
```

### 5. Configure DNS

Run the Route 53 setup to create the DNS record:
```bash
./route53-setup.sh
```

### 6. Verify Deployment

Your application should be available at `http://warmswarm.org` within a few minutes after DNS propagation.

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

## SSL Setup (Optional)

Once the HTTP version is working, you can add SSL by deploying the full infrastructure:

```bash
aws cloudformation deploy \
    --template-file infrastructure.yml \
    --stack-name warmswarm-infra \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides DomainName=warmswarm.org HostedZoneId=YOUR_ZONE_ID_HERE
```

## Cost Optimization

- RDS instance: `db.t3.micro` (free tier eligible)
- ECS tasks: 0.5 vCPU, 1GB RAM each
- Estimated cost: ~$30-50/month

## Troubleshooting

1. **Services not starting**: Check CloudWatch logs
2. **Database connection issues**: Verify security groups and RDS endpoint
3. **Load balancer 503 errors**: Check target group health in EC2 console
4. **SSL certificate issues**: Ensure domain nameservers point to Route 53

## Cleanup

To delete all resources:
```bash
aws cloudformation delete-stack --stack-name warmswarm-infra-no-ssl
```