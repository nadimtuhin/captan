const { exec } = require('./shell');

function isDirty() {
  const result = exec('[[ -z $(git status -s) ]] || echo "----------"');
  return result.stdout.includes('---') ? true : false;
}

module.exports = { isDirty };
