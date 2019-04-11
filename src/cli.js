#!/usr/bin/env node --harmony

const colors = require('colors');
const exec = require('./utils/shell').exec;
const argv = require('yargs').argv;

const getValues = require('./utils/getValues').getValues;
const { getNamespaces } = require('./utils/kubernetes');
const { getHelmCharts } = require('./utils/helm');
const {
  buildDockerImage,
  pushDockerImageInHarbor,
  getKubernetesDeploymentCommand
} = require('./commands');
const {
  getBuildArgs,
  getHelmChartLocation,
  selectKubernetesContext,
  getNamespace,
  getDeployment,
  getRemoteImageTag,
  getTasks,
  confirmDeploy
} = require('./questions');

async function main() {
  const chartLocation = await getHelmChartLocation(getHelmCharts());

  let values;
  try {
    values = getValues(chartLocation);
  } catch(e) {
    console.log(colors.red(e));
    process.exit(1);
  }

  const tasks = await getTasks();

  let namespaces, namespace, deployment, context;
  if (tasks.includes('deploy')) {
    context = await selectKubernetesContext(values.contexts);

    try {
      namespaces = await getNamespaces(context);
    } catch (e) {
      namespaces = [];
    }

    namespace = await getNamespace(values.namespaces.concat(namespaces));
    deployment = await getDeployment(values.deployments);
  }

  let buildArgs;
  if (values.buildArgs.length && tasks.includes('build-image')) {
    buildArgs = await getBuildArgs(values.buildArgs);
  }

  let imageTag;
  if (tasks.length) {
    imageTag = await getRemoteImageTag();
  }

  const appName = values.appName;
  const dockerFile = values.dockerFile;
  const imageRepoUrl = values.deploy.image.repo;

  const localImageName = `${appName}:live`;
  const remoteImageUrl = `${imageRepoUrl}:${imageTag}`;

  if (tasks.includes('build-image')) {
    console.log(colors.yellow('-----------------------------------------'));
    console.log(colors.green(`Building docker image ${localImageName} ..`));
    buildDockerImage(dockerFile, localImageName, buildArgs);

    console.log(colors.green(`Pushing docker image ${remoteImageUrl} ..`));
    pushDockerImageInHarbor(localImageName, remoteImageUrl);
  }

  if (tasks.includes('deploy')) {
    const command = getKubernetesDeploymentCommand({
      context,
      deployment,
      chartLocation,
      namespace,
      imageTag
    });

    console.log(colors.yellow('-----------------------------------------'));
    console.log(colors.red('The following command will be ran to deploy'));
    console.log(colors.white(`$ ${command}`));

    try {
      const deploy = await confirmDeploy();
      if(deploy !== 'deploy') throw Error("Deployment cancelled");
      const message = `Deploying ${deployment} (${remoteImageUrl}) in ${context}|${namespace} from ${chartLocation}`;
      console.log(colors.green(message));
      exec(command);
    } catch (e) {
      console.log(colors.red(e));
    }
  }
}

if(require('./utils/git').isDirty()) {
  const message = 'there are uncommited files in repository please commit before proceeding';
  console.log(colors.red(message));
  throw new Error(message);
}

main();
