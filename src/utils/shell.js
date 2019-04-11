const shell = require('shelljs');
// const shell = { exec: () => ({ code: 1}), exit: () => {} };
const colors = require('colors');

function exec(command) {
  // console.log(colors.green(startMessage));
  console.log(colors.yellow(`running command: ${command}`));

  const result = shell.exec(command);
  if (result.code !== 0) {
    // console.log(colors.red(errorMessage));
    shell.exit(1);
  }

  // console.log(colors.green(endMessage));
  return result;
}

module.exports = {
  exec
};
