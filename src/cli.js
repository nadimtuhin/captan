#!/usr/bin/env node --harmony

const inquirer = require('inquirer');
const colors = require('colors');
const argv = require('yargs').argv;

const {
  getHelmCharts,
  readValuesFile
} = require('./utils/kubernetes');

const {
  buildDockerImage,
  pushDockerImageInHarbor,
  deployInKubernetes
} = require('./commands');

async function main() {
  const answers1 = await inquirer.prompt([{
    type: 'list',
    name: 'chart',
    message: 'Choose helm chart location',
    choices: getHelmCharts()
  }]);

  const chartLocation = answers1.chart;
  const values = readValuesFile(chartLocation);

  const answers2 = await inquirer.prompt([{
    type: 'checkbox',
    name: 'tasks',
    message: 'What do you want to do',
    choices: [{ name: 'build-image' }, { name: 'deploy' }]
  }]);

  let answers3 = {};
  if (answers2.tasks.includes('deploy')) {
    answers3 = await inquirer.prompt([
      {
        type: 'list',
        name: 'namespace',
        message: 'Where do you want to deploy?',
        choices: values.namespaces //FIXME: validate
      },
    ]);
  }

  let answers4 = {};
  if (answers2.tasks.includes('build-image')) {
    answers4 = await inquirer.prompt([
      {
        type: 'list',
        name: 'env',
        message: 'What is the environment?',
        choices: values.environments //FIXME: validate
      }
    ])
  }

  let answers5 = {};
  if (answers2.tasks.length) {
    answers5 = await inquirer.prompt([
      {
        type: 'input',
        name: 'tag',
        message: 'Tag your release?'
      }
    ]);
  }

  const appName = values.appname;
  const namespace = answers3.namespace;
  const env = answers4.env;
  const imageTag = answers5.tag;

  const localImageName = `${appName}/${env}:live`;
  const imageRepoUrl = values.deploy.image.repo;
  const remoteImageUrl = `${imageRepoUrl}:${tag}`;

  if (answers2.tasks.includes('build-image')) {
    console.log(colors.green(`Building docker image ${localImageName} ..`));
    buildDockerImage(localImageName, env);

    console.log(colors.green(`Pushing docker image ${remoteImageUrl}..`));
    pushDockerImageInHarbor(localImage, remoteImageUrl);
  }

  if (answers2.tasks.includes('deploy')) {
    console.log(colors.green('Deploying in ..'));
    deployInKubernetes(appName, chartLocation, namespace, imageTag);
  }
}


main();
