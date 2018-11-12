# captan
kubernetes deployment helper


## features
- supports deploying to multiple namespaces and clusters
- supports deploying to multiple deployments

``sh

captan 
    --chart ./hack/app
    --build
    --appname dashboard 
    --build-args NODE_ENV=development
    --deploy
    --deployment dashboard-deployment
    --namespace dashboard-staging
    --cluster dashboard-prod
    
``
