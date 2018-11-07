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

async function getNamespace(values) {
  return await ask({
    type: 'list',
    message: 'Where do you want to deploy?',
    choices: values.namespaces //FIXME: validate
  });
}

async function getBuildEnvironment(values) {
  return await ask({
    type: 'list',
    message: 'What is the environment?',
    choices: values.environments //FIXME: validate
  });
}

async function getRemoteImageTag() {
  return await ask({
    type: 'input',
    message: 'Tag your release?'
  });
}

module.exports = {
  getHelmChartLocation,
  getTasks,
  getNamespace,
  getBuildEnvironment,
  getRemoteImageTag
};
