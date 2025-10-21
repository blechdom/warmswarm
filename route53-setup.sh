#!/bin/bash

# Route 53 Setup Script
# This script creates the Route 53 record pointing to your ALB

set -e

# Configuration - UPDATE THESE VALUES
DOMAIN_NAME="warmswarm.org"  # e.g., warmswarm.com
HOSTED_ZONE_ID="Z03059661M7XJNX4GTN6R"  # Your Route 53 hosted zone ID

if [ -z "$DOMAIN_NAME" ] || [ -z "$HOSTED_ZONE_ID" ]; then
    echo "❌ Please update DOMAIN_NAME and HOSTED_ZONE_ID in this script"
    echo "To find your hosted zone ID:"
    echo "aws route53 list-hosted-zones --query 'HostedZones[?Name==\`$DOMAIN_NAME.\`].Id' --output text"
    exit 1
fi

# Get the ALB DNS name and hosted zone ID from CloudFormation
ALB_DNS=$(aws cloudformation describe-stacks \
    --stack-name warmswarm-ssl \
    --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
    --output text)

if [ -z "$ALB_DNS" ]; then
    echo "❌ Could not retrieve ALB DNS name. Make sure the CloudFormation stack is deployed successfully."
    exit 1
fi

# Get the ALB hosted zone ID (this is fixed for each region)
ALB_HOSTED_ZONE_ID="Z368ELLRRE2KJ0"  # us-west-1 ALB hosted zone ID

echo "🌐 Creating Route 53 alias record for $DOMAIN_NAME pointing to $ALB_DNS"

# Create the Route 53 alias record (required for apex domains)
cat > /tmp/route53-record.json << EOF
{
    "Changes": [
        {
            "Action": "UPSERT",
            "ResourceRecordSet": {
                "Name": "$DOMAIN_NAME",
                "Type": "A",
                "AliasTarget": {
                    "DNSName": "$ALB_DNS",
                    "EvaluateTargetHealth": false,
                    "HostedZoneId": "$ALB_HOSTED_ZONE_ID"
                }
            }
        }
    ]
}
EOF

aws route53 change-resource-record-sets \
    --hosted-zone-id $HOSTED_ZONE_ID \
    --change-batch file:///tmp/route53-record.json

echo "✅ Route 53 record created successfully!"
echo "Your application will be available at: http://$DOMAIN_NAME"
echo "Note: DNS propagation may take a few minutes."

# Clean up
rm /tmp/route53-record.json