#!/usr/bin/env node
const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const chalk = require('chalk');
const git = require('simple-git');
const { spawnSync } = require('child_process');
const inquirer = require('inquirer');
const options = require('../commons/types');

const transformInput = function(input) {
  input = input.trim();
  return input.toUpperCase();
};

function hasWhiteSpace(value) {
  const inValid = /\s/;
  return inValid.test(value) ? 'No se permiten espacios en blanco' : true;
}


const types = options.types;
const length = longest(Object.keys(types)).length + 1;
const choices = map(types, function(type, key) {
  return {
    name: rightPad(key + ':', length) + ' ' + type.description,
    value: key
  };
});

inquirer.prompt([
  {
    type: 'list',
    name: 'type',
    message: 'Seleccione el tipo de cambio que está por realizar: \n',
    choices: choices,
    default: 'refactor'
  },
  {
    type: 'input',
    name: 'name',
    message: function() {
      return 'Escriba un nombre para su rama:\n';
    },
    validate: function(subject) {
      const filteredSubject = transformInput(subject);
      if (filteredSubject.length === 0) {
        return 'Nombre de la rama es requerido';
      } else if (filteredSubject.length < 5) {
        return 'El Minimo de caracteres permitido es 5';
      } else {
        return hasWhiteSpace(subject);
      }
    },
    transformer: function(subject) {
      const nameInput = transformInput(subject);
      const color =
        subject.length === 0 || subject.length < 5
          ? chalk.red
          : chalk.cyan;
      return color(nameInput);
    }
  },
  {
    type: 'confirm',
    name: 'jiraAffected',
    message: 'Esta rama esta asociada a una historia de JIRA?',
    default: false
  },
  {
    type: 'input',
    name: 'jiraHistory',
    message: '(Ejemplo: "ASSIAC-123", "CAP-123".):\n',
    validate: function(subject) {
      const HISTORY_JIRA_FORMAT = /^(ASSIAC|CAP)-[0-9]{1,5}/;
      return !HISTORY_JIRA_FORMAT.test(subject)
        ? 'Formato de historia invalido'
        : hasWhiteSpace(subject);
    },
    transformer: function(subject) {
      return transformInput(subject);
    },
    when: function(answers) {
      return answers.jiraAffected;
    }
  }
]).then(function(answers) {
  const child = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  const activeBranchName = child.stdout.toString().trim();
  const jiraHistory = answers.jiraAffected
    ? `${answers.jiraHistory}#`
    : '';
  const branchName = `${answers.type}/${jiraHistory}${answers.name}`;
  git().checkoutBranch(branchName, activeBranchName, (err, data) => {
    if (!err) {
      console.log(
        chalk.yellow(
          `-------------------------------------------------------------`
        )
      );
      console.log(
        chalk.yellow(`NOMBRE DE RAMA BASE: ${activeBranchName}`)
      );
      console.log(chalk.yellow(`NOMBRE DE RAMA GENERADA: ${branchName}`));
      console.log(
        chalk.yellow(
          `-------------------------------------------------------------`
        )
      );
      console.log(chalk.green(`proceso finalizado.`));
    }
  });
});

