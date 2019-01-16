# captan
kubernetes deployment helper


## features
[x] supports deploying to multiple namespaces and clusters
[x] supports multiple deployments
[ ] add support for inline arguments, for example
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

```yaml
# hack/app-helm-chart/values.yaml
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
