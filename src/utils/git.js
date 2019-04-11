const { exec } = require('./shell');

function isDirty() {
  const result = exec('[[ -z $(git status -s) ]] || echo "modified"');
  return result.stdout.includes('modified') ? true : false;
}

module.exports = { isDirty };
