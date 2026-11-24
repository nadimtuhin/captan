const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { getValues } = require('./getValues');

function writeChart(valuesYaml) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'captan-chart-'));
  fs.writeFileSync(path.join(dir, 'values.yaml'), valuesYaml);
  return dir;
}

const baseValues = [
  'appName: dashboard',
  'deployments:',
  '  - dashboard-deployment',
  'namespaces:',
  '  - dashboardv1'
].join('\n');

describe('getValues', function() {
  it('requires deploy.image.repo', function() {
    const chart = writeChart(baseValues);
    assert.throws(() => getValues(chart), /deploy\.image\.repo/);
  });

  it('returns the values when deploy.image.repo is set', function() {
    const chart = writeChart(baseValues + '\ndeploy:\n  image:\n    repo: registry.example.com/dashboard\n');
    const values = getValues(chart);
    assert.strictEqual(values.deploy.image.repo, 'registry.example.com/dashboard');
    assert.strictEqual(values.dockerFile, './Dockerfile');
  });
});
