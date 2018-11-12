const ask = require('./utils/ask');

async function getHelmChartLocation(chartLocations) {
  return await ask({
    type: 'list',
    message: 'Choose helm chart location',
    choices: chartLocations
  });
}

async function getTasks() {
  return await ask({
    type: 'checkbox',
    message: 'What do you want to do',
    choices: [{ name: 'build-image' }, { name: 'deploy' }]
  });
}

async function selectKubernetesContext(contexts) {
  return await ask({
    type: 'list',
    message: 'Select a context',
    choices: contexts //FIXME: validate
  });
}

async function getNamespace(namespaces) {
  return await ask({
    type: 'list',
    message: 'Which namespace do you want to deploy?',
    choices: namespaces //FIXME: validate
  });
}

async function getDeployment(deployments) {
  return await ask({
    type: 'list',
    message: 'Select your deployment?',
    choices: deployments //FIXME: validate
  });
}

async function getBuildArgs(buildArgs) {
  return await ask({
    type: 'list',
    message: 'Select docker build args?',
    choices: buildArgs //FIXME: validate
  });
}

async function getRemoteImageTag() {
  return await ask({
    type: 'input',
    message: 'Tag your release?'
  });
}

async function confirmDeploy() {
  return await ask({
    type: 'input',
    message: 'Write "deploy" to initiate deployment'
  });
}

module.exports = {
  getHelmChartLocation,
  getTasks,
  selectKubernetesContext,
  getNamespace,
  getDeployment,
  getBuildArgs,
  getRemoteImageTag,
  confirmDeploy
};
