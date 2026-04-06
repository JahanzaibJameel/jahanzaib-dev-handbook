# Deployment Strategies

Deployment strategies define how you release your applications to production. Choosing the right strategy ensures reliable releases, minimal downtime, and quick rollback capabilities.

## 🎯 What are Deployment Strategies?

Deployment strategies are approaches to release new versions of your application while maintaining service availability and minimizing risk.

### Why Deployment Strategies Matter

- **Zero Downtime**: Keep your application available during updates
- **Risk Mitigation**: Reduce impact of failed deployments
- **User Experience**: Seamless transitions for users
- **Rollback Capability**: Quick recovery from issues
- **Progressive Delivery**: Gradual feature rollout

## 🚀 Modern Deployment Platforms

### Vercel - Frontend Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Link to existing project
vercel link

# Deploy specific directory
vercel --prod dist/
```

### Railway - Backend Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Deploy backend
railway up

# Deploy with Dockerfile
railway up --dockerfile
```

### Render - Full-Stack Deployment

```yaml
# render.yaml
services:
  # Web service
  - type: web
    name: my-app-frontend
    env: node
    rootDir: frontend
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: API_URL
        value: https://my-app-backend.onrender.com
        sync: false
        
  # API service
  - type: web
    name: my-app-backend
    env: node
    rootDir: backend
    buildCommand: npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        value: postgresql://user:pass@my-db:5432/myapp
        sync: false
      - key: REDIS_URL
        value: redis://my-redis:6379
        sync: false
```

### AWS Amplify - React Native & Web

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
    discard:
      - '**/*.map'
```

## 🔄 Deployment Strategies

### Blue-Green Deployment

Blue-Green deployment maintains two identical production environments. Only one serves live traffic at any time.

```mermaid
graph TD
    A[Developer Push] --> B[Build New Version]
    B --> C[Deploy to Blue Environment]
    C --> D[Health Check Blue]
    D --> E[Switch Traffic to Blue]
    E --> F[Monitor Blue Performance]
    F --> G{Performance OK?}
    G -->|Yes|H[Keep Green for Rollback]
    G -->|No|I[Switch Back to Green]
    I --> J[Blue becomes Production]
    H --> K[Green becomes Staging]
```

#### Implementation

```yaml
# .github/workflows/blue-green.yml
name: Blue-Green Deployment

on:
  push:
    branches: [main]

jobs:
  deploy-blue-green:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Configure AWS CLI
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to Blue
        run: |
          # Deploy new version to blue environment
          aws s3 sync ./build/ s3://blue-bucket --delete
          aws cloudfront create-invalidation --distribution-id BLUE_DISTRIBUTION_ID --paths "/*"
          
      - name: Health Check Blue
        run: |
          # Wait for blue to be healthy
          timeout 300s bash -c '
            until curl -f https://blue.yourapp.com/health; do
              sleep 5
            done
          '
          
      - name: Switch Traffic
        run: |
          # Update Route53 to point to blue
          aws route53 change-resource-record-sets \
            --hosted-zone-id YOUR_ZONE_ID \
            --change-batch '{
              "Comment": "Switch to blue deployment",
              "Changes": [{
                "Action": "UPSERT",
                "ResourceRecordSet": {
                  "Name": "yourapp.com",
                  "Type": "A",
                  "AliasTarget": {
                    "DNSName": "blue-bucket.s3.amazonaws.com",
                    "EvaluateTargetHealth": true
                  }
                }
              }]
            }'
```

### Canary Deployment

Canary deployment releases new versions to a small subset of users before full rollout.

```mermaid
graph TD
    A[New Version Ready] --> B[Deploy to Canary]
    B --> C[Route 5% Traffic to Canary]
    C --> D[Monitor Canary Metrics]
    D --> E{Canary Healthy?}
    E -->|Yes|F[Gradually Increase Traffic]
    E -->|No|G[Rollback to Stable]
    F --> H[100% Traffic to New Version]
    H --> I[Canary becomes Production]
```

#### Implementation

```yaml
# .github/workflows/canary.yml
name: Canary Deployment

on:
  push:
    branches: [main]

jobs:
  canary-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy Canary
        run: |
          # Deploy canary version
          kubectl apply -f canary-deployment.yaml
          
      - name: Monitor Canary
        run: |
          # Monitor canary performance
          timeout 900s bash -c '
            for i in {1..10}; do
              error_rate=$(kubectl get canary-metrics | jq ".errorRate")
              latency=$(kubectl get canary-metrics | jq ".p95Latency")
              
              if (( $(echo "$error_rate" | bc -l) > 1 )); then
                echo "Canary error rate too high: $error_rate%"
                exit 1
              fi
              
              if (( $(echo "$latency" | bc -l) > 500 )); then
                echo "Canary latency too high: ${latency}ms"
                exit 1
              fi
              
              sleep 60
            done
          '
          
      - name: Promote Canary
        if: success()
        run: |
          # Promote canary to production
          kubectl patch service production-service -p '{"spec":{"selector":{"version":"canary"}}}'
          
      - name: Rollback if Failed
        if: failure()
        run: |
          # Rollback to stable version
          kubectl rollout undo deployment/production
```

### Rolling Deployment

Rolling deployment updates instances gradually without downtime.

```mermaid
graph TD
    A[Start Rolling Update] --> B[Update 25% of Instances]
    B --> C[Health Check Updated]
    C --> D[Update Next 25%]
    D --> E[Continue Until 100%]
    E --> F[All Instances Updated]
```

#### Implementation

```yaml
# kubernetes/rolling-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: my-app
        image: myapp:latest
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 15
          periodSeconds: 20
```

### A/B Testing Deployment

A/B testing deploys different versions to different user segments for comparison.

```yaml
# .github/workflows/ab-testing.yml
name: A/B Testing Deployment

on:
  push:
    branches: [main]

jobs:
  ab-test-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        
      - name: Deploy Version A
        run: |
          # Deploy version A to 50% of users
          vercel --prod --name version-a
          
      - name: Deploy Version B
        run: |
          # Deploy version B to 50% of users
          vercel --prod --name version-b
          
      - name: Configure Traffic Split
        run: |
          # Use feature flags or load balancer
          curl -X POST "https://api.vercel.com/v1/traffic" \
            -H "Authorization: Bearer ${{ secrets.VERCEL_TOKEN }}" \
            -d '{
              "projectId": "${{ secrets.VERCEL_PROJECT_ID }}",
              "rules": [
                {
                  "source": {
                    "type": "header",
                    "value": "version-a"
                  },
                  "destination": {
                    "type": "url",
                    "value": "https://version-a.vercel.app"
                  },
                  "weight": 50
                },
                {
                  "source": {
                    "type": "header",
                    "value": "version-b"
                  },
                  "destination": {
                    "type": "url",
                    "value": "https://version-b.vercel.app"
                  },
                  "weight": 50
                }
              ]
            }'
```

## 🌍 Multi-Environment Deployment

### Environment Configuration

```javascript
// config/environments.js
const environments = {
  development: {
    apiUrl: 'http://localhost:3001',
    databaseUrl: 'postgresql://localhost:5432/myapp_dev',
    redisUrl: 'redis://localhost:6379',
    logLevel: 'debug',
    enableMockData: true
  },
  
  staging: {
    apiUrl: 'https://staging-api.myapp.com',
    databaseUrl: process.env.STAGING_DATABASE_URL,
    redisUrl: process.env.STAGING_REDIS_URL,
    logLevel: 'info',
    enableMockData: false
  },
  
  production: {
    apiUrl: 'https://api.myapp.com',
    databaseUrl: process.env.PRODUCTION_DATABASE_URL,
    redisUrl: process.env.PRODUCTION_REDIS_URL,
    logLevel: 'error',
    enableMockData: false
  }
};

const currentEnv = environments[process.env.NODE_ENV] || environments.development;
module.exports = currentEnv;
```

### Environment-Specific Builds

```json
// package.json
{
  "scripts": {
    "build:dev": "NODE_ENV=development npm run build",
    "build:staging": "NODE_ENV=staging npm run build",
    "build:prod": "NODE_ENV=production npm run build",
    "deploy:dev": "npm run build:dev && npm run deploy:dev-env",
    "deploy:staging": "npm run build:staging && npm run deploy:staging-env",
    "deploy:prod": "npm run build:prod && npm run deploy:prod-env"
  }
}
```

## 🔧 Infrastructure as Code (IaC)

### Terraform Deployment

```hcl
# terraform/main.tf
provider "aws" {
  region = var.aws_region
}

# S3 bucket for static assets
resource "aws_s3_bucket" "static_assets" {
  bucket = "my-app-static-${var.environment}"
  acl    = "private"
  
  versioning {
    enabled = true
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.static_assets.bucket_domain_name
    origin_id   = aws_s3_bucket.static_assets.id
  }
  
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  
  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = aws_s3_bucket.static_assets.id
    compress              = true
    viewer_protocol_policy = "redirect-to-https"
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn = var.ssl_certificate_arn
    ssl_support_method       = "sni-only"
  }
  
  aliases = var.domain_names
}

# ECS service for backend
resource "aws_ecs_service" "backend" {
  name            = "my-app-backend-${var.environment}"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 2
  
  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name    = "backend"
    container_port   = 3000
  }
}
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
        version: v1
    spec:
      containers:
      - name: my-app
        image: myapp:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: LoadBalancer
```

## 📊 Monitoring & Observability

### Health Checks

```javascript
// health/healthCheck.js
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.APP_VERSION,
    checks: {
      database: checkDatabase(),
      redis: checkRedis(),
      external_apis: checkExternalAPIs()
    }
  };
  
  const isHealthy = Object.values(health.checks).every(check => check.status === 'ok');
  
  res.status(isHealthy ? 200 : 503).json(health);
});

function checkDatabase() {
  try {
    // Check database connection
    return { status: 'ok', responseTime: '15ms' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function checkRedis() {
  try {
    // Check Redis connection
    return { status: 'ok', responseTime: '5ms' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

function checkExternalAPIs() {
  try {
    // Check external API connectivity
    return { status: 'ok', responseTime: '100ms' };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}
```

### Performance Monitoring

```javascript
// monitoring/performance.js
const prometheus = require('prom-client');

// Custom metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to track metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const labels = {
      method: req.method,
      route: req.route || req.path,
      status_code: res.statusCode.toString()
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });
  
  next();
};

module.exports = { metricsMiddleware, httpRequestDuration, httpRequestTotal };
```

## 🔧 Best Practices

### Deployment Checklist

```markdown
## Pre-Deployment Checklist
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] Security scan passed
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations prepared
- [ ] Backup strategy in place
- [ ] Rollback plan documented

## Post-Deployment Checklist
- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Load balancer updated
- [ ] DNS propagated
- [ ] SSL certificates valid
- [ ] Error rates within threshold
- [ ] Response times acceptable
- [ ] User analytics tracking
```

### Security Considerations

```yaml
# Security headers in deployment
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
    - hosts:
        - yourapp.com
      secretName: yourapp-tls
  rules:
    - host: yourapp.com
      http:
        paths:
          - path: /api
            backend:
              serviceName: my-app-backend
              servicePort: 3000
```

---

**Next Up**: Learn about Environment Management! 🌍
