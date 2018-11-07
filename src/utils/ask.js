const inquirer = require('inquirer');

async function ask(question) {
  const answers = await inquirer.prompt([Object.assign(question, {
    name: 'question'
  })]);

  return answers.question;
}

module.exports = ask;
