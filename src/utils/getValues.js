const { readValuesFile } = require('../../lib/utils/helm');
const { getContexts } = require('../../lib/utils/kubernetes');

function getValues(chartLocation) {
  const defaultValues = {
    dockerFile: './DockerFile',
    environments: [],
    deployments: [],
    namespaces: [],
    contexts: getContexts().map(c => c.name)
  };

  const values = readValuesFile(chartLocation);

  return Object.assign({}, defaultValues, values);
}

module.exports = {
  getValues
};
