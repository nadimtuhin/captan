const shell = require('shelljs');
// const shell = { exec: () => ({ code: 1}), exit: () => {} };
const colors = require('colors');

function exec(command) {
  // console.log(colors.green(startMessage));
  console.log(colors.yellow(`running command: ${command}`));

  if (shell.exec(command).code !== 0) {
    // console.log(colors.red(errorMessage));
    shell.exit(1);
  }

  // console.log(colors.green(endMessage));
}

module.exports = {
  exec
};
