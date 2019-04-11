const { execSilent } = require('./shell');

function isDirty() {
  const result = execSilent('[[ -z $(git status -s) ]] || echo "----------"');
  return result.stdout.includes('---') ? true : false;
}

module.exports = { isDirty };
