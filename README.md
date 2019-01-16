# captan
kubernetes deployment helper


## features
- supports deploying to multiple namespaces and clusters
- supports deploying to multiple deployments

```sh

captan 
    --chart ./hack/app
    --build
    --appname dashboard 
    --build-args NODE_ENV=development
    --deploy
    --deployment dashboard-deployment
    --namespace dashboard-staging
    --cluster dashboard-prod
    
```

## Usage guide

```values.yaml
appName: dashboard

deployments:
  - dashboard-deployment
  - feature1-dashboard-deployment
  - feature2-dashboard-deployment

namespaces:
  - dashboardv1
  - dashboardv2

buildArgs:
  - NODE_ENV=development
  - NODE_ENV=staging
  - NODE_ENV=production

dockerFile: ./Dockerfile
```
