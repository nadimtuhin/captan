const { exec } = require('./utils/shell');

function buildDockerImage(localImageName, environment) {
  exec(`docker build . --build-arg NODE_ENV=${environment} -t ${localImageName}`);
}

function pushDockerImageInHarbor(localImageName, remoteImageUrl) {
  exec(`docker tag ${localImageName} ${remoteImageUrl}`);
  exec(`docker push ${remoteImageUrl}`);
}

function deployInKubernetes(appName, chartLocation, namespace, imageTag) {
  exec(
    `helm upgrade` +
    ` --install ${appName} ` +
    chartLocation +
    ` --namespace ${namespace} ` +
    ` --set deploy.image.tag=${imageTag} `
  );
}

module.exports = {
  buildDockerImage,
  pushDockerImageInHarbor,
  deployInKubernetes
};
