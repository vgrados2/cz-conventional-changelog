const inquirer = require('inquirer');
const { spawnSync } = require('child_process');
const chalk = require('chalk');
const rightPad = require('right-pad');
const git = require('simple-git');

module.exports.newBranchGenerator = (options) => {
  // TIPOS DE RAMA PERMITIDOS (options.types)
  const choices = Object.keys(options.types).map((objectKey) => {
    const key = objectKey;
    const type = options.types[objectKey];
    return {
      name: rightPad(key + ':', 10) + ' ' + type.description,
      value: key
    };
  });

  inquirer.prompt([
    /** STEP 1: Selecionar el typo de rama a crear */
    {
      type: 'list',
      name: 'step_1',
      message: 'Seleccione el tipo de cambio que está por realizar: \n',
      choices: choices,
      default: 'refactor'
    },
    /** STEP 2: Ingresamos el nombre de la rama a crear */
    {
      type: 'input',
      name: 'step_2',
      message: 'Escriba un nombre para su rama:\n',
      validate: (subject) => {
        const filteredSubject = transformInput(subject);
        if (filteredSubject.length === 0) {
          return 'Nombre de la rama es requerido';
        } else if (filteredSubject.length < 5) {
          return 'El Minimo de caracteres permitido es 5';
        } else {
          return hasWhiteSpace(subject);
        }
      },
      transformer: (subject) => {
        const nameInput = transformInput(subject);
        const color =
          subject.length === 0 || subject.length < 5
            ? chalk.red
            : chalk.cyan;
        return color(nameInput);
      }
    },
    /** STEP 3: Consultamos si esta historia esta asociada a JIRA */
    {
      type: 'confirm',
      name: 'step_3',
      message: 'Esta rama esta asociada a una historia de JIRA?',
      default: false
    },
    /** STEP 4: Ingresamos el nombre de la historia cumpliendo con las validaciones correspondientes */
    {
      type: 'input',
      name: 'step_4',
      message: '(Ejemplo: "ASSIAC-123", "CAP-123".):\n',
      validate: (subject) => {
        const HISTORY_JIRA_FORMAT = /^(ASSIAC|CAP)-[0-9]{1,5}/;
        return !HISTORY_JIRA_FORMAT.test(subject)
          ? 'Formato de historia invalido'
          : hasWhiteSpace(subject);
      },
      transformer: (subject) => {
        return transformInput(subject);
      },
      when: (answers) => {
        return answers['step_3'];
      }
    }
  ]).then((answers) => {

    const currentBranch = getNameCurrentBranch();
    const historyJiraName = answers['step_3'] ? `${answers['step_4']}#`: '';
    const typeBranch = answers['step_1'];
    const newBranchName = `${typeBranch}/${historyJiraName}${answers['step_2']}`;
    createNewBranchGit(currentBranch, newBranchName);

  });

  function transformInput(input) {
    input = input.trim();
    return input.toUpperCase();
  }

  function hasWhiteSpace(value) {
    const inValid = /\s/;
    return inValid.test(value) ? 'No se permiten espacios en blanco' : true;
  }

  function getNameCurrentBranch() {
    const child = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    if (child) {
      return child.stdout.toString().trim();
    }
    return 'NOT_BRANCH';
  }

  function createNewBranchGit(currentBranch, newBranchName) {

    git().checkoutBranch(newBranchName, currentBranch, (err, data) => {
      if (!err) {
        console.log(chalk.yellow(`-------------------------------------------------------------`));
        console.log(chalk.yellow(`NOMBRE DE RAMA BASE: ${currentBranch}`));
        console.log(chalk.yellow(`NOMBRE DE RAMA GENERADA: ${newBranchName}`));
        console.log(chalk.yellow(`-------------------------------------------------------------`));
        console.log(chalk.green(`Proceso finalizado.`));
      }
    });
  }
};



