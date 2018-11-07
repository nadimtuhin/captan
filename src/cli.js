#!/usr/bin/env node --harmony
const colors = require('colors');
const argv = require('yargs').argv;

const {
  getHelmCharts,
  readValuesFile
} = require('./utils/helm');
const {
  buildDockerImage,
  pushDockerImageInHarbor,
  deployInKubernetes
} = require('./commands');
const {
  getBuildEnvironment,
  getHelmChartLocation,
  getNamespace,
  getRemoteImageTag,
  getTasks
} = require('./questions');

async function main() {
  const chartLocation = await getHelmChartLocation(getHelmCharts());
  const tasks = await getTasks();

  const values = readValuesFile(chartLocation);

  let namespace;
  if (tasks.includes('deploy')) {
    namespace = await getNamespace(values);
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
  const deploymentName = values.deploymentName;
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
    console.log(colors.green('Deploying in ..'));
    deployInKubernetes(deploymentName, chartLocation, namespace, imageTag);
  }
}


main();
