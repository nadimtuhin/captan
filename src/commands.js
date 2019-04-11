const { exec } = require('./utils/shell');

function switchContext(context) {
  return exec(`kubectl config use-context ${context}`);
}

// function getCurrentGitBranch() {
//   // FIXME: add error handler if git branch not found
//   const res = exec('git symbolic-ref --short HEAD');

//   return res.stdout.trim();
// }

function buildDockerImage(dockerFile, localImageName, buildArgs) {
  let command = `docker build . -f ${dockerFile} -t ${localImageName}`;
  let branch = getCurrentGitBranch();

  if (buildArgs) command += ` --build-arg ${buildArgs}`;
  // if (branch) command += ` --build-arg GIT_BRACH=${branch}`;

  return exec(command);
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
