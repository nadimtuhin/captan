const shell = require('shelljs');
// const shell = { exec: () => ({ code: 1}), exit: () => {} };
const colors = require('colors');

function exec(command, silent=false) {
  // console.log(colors.green(startMessage));
  !silent && console.log(colors.yellow(`running command: ${command}`));

  const result = shell.exec(command);
  if (result.code !== 0) {
    // console.log(colors.red(errorMessage));
    shell.exit(1);
  }

  // console.log(colors.green(endMessage));
  return result;
}

function execSilent(command) {
  return exec(command, true);
}

module.exports = {
  exec,
  execSilent
};
