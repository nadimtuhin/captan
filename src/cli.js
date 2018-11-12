#!/usr/bin/env node --harmony

const colors = require('colors');
const argv = require('yargs').argv;

const getValues = require('./utils/getValues').getValues;
const { getNamespaces } = require('./utils/kubernetes');
const { getHelmCharts } = require('./utils/helm');
const {
  buildDockerImage,
  pushDockerImageInHarbor,
  deployInKubernetes
} = require('./commands');
const {
  getBuildEnvironment,
  getHelmChartLocation,
  selectKubernetesContext,
  getNamespace,
  getDeployment,
  getRemoteImageTag,
  getTasks
} = require('./questions');

async function main() {
  const chartLocation = await getHelmChartLocation(getHelmCharts());
  const tasks = await getTasks();

  const values = getValues(chartLocation);

  let namespaces, namespace, deployment, context;
  if (tasks.includes('deploy')) {
    context = await selectKubernetesContext(values.contexts);
    console.log(colors.green(`Switching to ${context} context`));

    try {
      namespaces = await getNamespaces(context);
    } catch (e) {
      namespaces = [];
    }

    namespace = await getNamespace(values.namespaces.concat(namespaces));
    deployment = await getDeployment(values.deployments);
  }

  let environment;
  if (tasks.includes('build-image')) {
    environment = await getBuildEnvironment(values);
  }

  let tag;
  if (tasks.length) {
    tag = await getRemoteImageTag();
  }

  const appName = values.appName;
  const dockerFile = values.dockerFile;
  const imageRepoUrl = values.deploy.image.repo;

  const imageTag = `${tag}-${environment}`;

  const localImageName = `${appName}/${environment}:live`;
  const remoteImageUrl = `${imageRepoUrl}:${imageTag}`;

  if (tasks.includes('build-image')) {
    console.log(colors.green(`Building docker image ${localImageName} ..`));
    buildDockerImage(dockerFile, localImageName, environment);

    console.log(colors.green(`Pushing docker image ${remoteImageUrl} ..`));
    pushDockerImageInHarbor(localImageName, remoteImageUrl);
  }

  if (tasks.includes('deploy')) {
    console.log(colors.green(`Deploying ${deployment} (${remoteImageUrl}) in ${context}|${namespace} from ${chartLocation}`));
    deployInKubernetes({
      context,
      deployment,
      chartLocation,
      namespace,
      imageTag
    });
  }
}


main();
