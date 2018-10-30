#!/usr/bin/env node --harmony

const inquirer = require('inquirer');
const colors = require('colors');
const argv = require('yargs').argv;

const { exec } = require('./utils/shell');
const { getHelmCharts, readValuesFile } = require('./utils/kubernetes');


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

  const tag = answers5.tag;
  const namespace = answers3.namespace;
  const env = answers4.env;

  const imageUrl = values.deploy.image.repo;
  const remoteImage = `${imageUrl}:${tag}`;
  const localImage = `${values.appname}/${env}:live`;

  if (answers2.tasks.includes('build-image')) {
    console.log(colors.green(`Building docker image ${localImage} ..`));
    exec(`docker build . --build-arg NODE_ENV=${env} -t ${localImage}`);

    console.log(colors.green(`Pushing docker image ${remoteImage}..`));
    exec(`docker tag ${localImage} ${remoteImage}`);
    exec(`docker push ${remoteImage}`);
  }

  if (answers2.tasks.includes('deploy')) {
    console.log(colors.green('Deploying in ..'));
    exec(
      `helm upgrade` +
      ` --install ${values.appname} ` +
      chartLocation +
      ` --namespace ${namespace} ` +
      ` --set deploy.image.tag=${tag} `
    );
  }
}


main();
