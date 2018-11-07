const { exec } = require('./utils/shell');

function switchContext(context) {
  exec(`kubectl config use-context ${context}`);
}

function buildDockerImage(dockerFile, localImageName, environment) {
  exec(`docker build . -f ${dockerFile} --build-arg NODE_ENV=${environment} -t ${localImageName}`);
}

function pushDockerImageInHarbor(localImageName, remoteImageUrl) {
  exec(`docker tag ${localImageName} ${remoteImageUrl}`);
  exec(`docker push ${remoteImageUrl}`);
}

function deployInKubernetes(appName, chartLocation, namespace, imageTag) {
  exec(
    'helm upgrade' +
    ` --install ${appName} ` +
    chartLocation +
    ` --namespace ${namespace} ` +
    ` --set deploy.image.tag=${imageTag} `
  );
}

module.exports = {
  buildDockerImage,
  pushDockerImageInHarbor,
  deployInKubernetes,
  switchContext
};
