const isArray = require('lodash/isArray');
const { readValuesFile } = require('./helm');
const { getContexts } = require('./kubernetes');

function getValues(chartLocation) {
  const defaultValues = {
    dockerFile: './DockerFile',
    buildArgs: [],
    contexts: getContexts().map(c => c.name)
  };

  let values = readValuesFile(chartLocation);
  values = Object.assign({}, defaultValues, values);

  if(!values.appName) {
    throw Error('appName is required in values.appName');
  }

  if(!values.deployments) {
    throw Error('deployment names is required in values.deployments');
  }

  if(!isArray(values.deployments)) {
    throw Error('values.deployments has to be an array of strings');
  }

  if(!values.namespaces) {
    throw Error('namespaces is required in values.namespaces');
  }

  if(!isArray(values.namespaces)) {
    throw Error('values.namespaces has to be an array of strings');
  }

  return values;
}

module.exports = {
  getValues
};
