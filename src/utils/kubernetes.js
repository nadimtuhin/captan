const fs = require('fs');
const colors = require('colors');
const yaml = require('js-yaml');

const { getDirectories } = require('./fs');

function getHelmCharts() {
  try {
    return getDirectories('hack');
  } catch (e) {
    console.log(colors.red('no hack/helmcharts found'));
    process.exit(1);
  }
}

function readValuesFile(chartLocation) {
  const chartValuesFile = `${chartLocation}/values.yaml`;

  try {
    return yaml.safeLoad(fs.readFileSync(chartValuesFile, 'utf8'));
  } catch (e) {
    console.log(`Failed to find/parse chart file ${chartValuesFile}`);
    process.exit(1);
  }
}

module.exports = {
  getHelmCharts,
  readValuesFile
};
