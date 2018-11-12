const confirmDeploy = require('./questions').confirmDeploy;
const { exec } = require('./utils/shell');

function switchContext(context) {
  exec(`kubectl config use-context ${context}`);
}

function buildDockerImage(dockerFile, localImageName, buildArgs) {
  exec(`docker build . -f ${dockerFile} --build-arg ${buildArgs} -t ${localImageName}`);
}

function pushDockerImageInHarbor(localImageName, remoteImageUrl) {
  exec(`docker tag ${localImageName} ${remoteImageUrl}`);
  exec(`docker push ${remoteImageUrl}`);
}

function getKubernetesDeploymentCommand({ context, deployment, chartLocation, namespace, imageTag }) {
  return 'helm upgrade' +
    ` --kube-context ${context}` +
    ` --install ${deployment}` +
    ' ' + chartLocation +
    ` --namespace ${namespace}` +
    ` --set deploy.image.tag=${imageTag}`;
}

module.exports = {
  buildDockerImage,
  pushDockerImageInHarbor,
  getKubernetesDeploymentCommand,
  switchContext
};
