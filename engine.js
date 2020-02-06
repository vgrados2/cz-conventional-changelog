'format cjs';

const map = require('lodash.map');
const longest = require('longest');
const rightPad = require('right-pad');
const chalk = require('chalk');
const git = require('simple-git')

const filterSubject = function(subject) {
  subject = subject.trim();
  if (subject.charAt(0).toLowerCase() !== subject.charAt(0)) {
    subject =
      subject.charAt(0).toLowerCase() + subject.slice(1, subject.length);
  }
  while (subject.endsWith('.')) {
    subject = subject.slice(0, subject.length - 1);
  }
  return subject;
};

// This can be any kind of SystemJS compatible module.
// We use Commonjs here, but ES6 or AMD would do just
// fine.
module.exports = function(options) {
  const types = options.types;
  const length = longest(Object.keys(types)).length + 1;
  const choices = map(types, function(type, key) {
    return {
      name: rightPad(key + ':', length) + ' ' + type.description,
      value: key
    };
  });

  return {
    // When a user runs `git cz`, prompter will
    // be executed. We pass you cz, which currently
    // is just an instance of inquirer.js. Using
    // this you can ask questions and get answers.
    //
    // The commit callback should be executed when
    // you're ready to send back a commit template
    // to git.
    //
    // By default, we'll de-indent your commit
    // template and will keep empty lines.
    prompter: function(cz, commit) {
      // Let's ask some questions of the user
      // so that we can populate our commit
      // template.
      //
      // See inquirer.js docs for specifics.
      // You can also opt to use another input
      // collection library if you prefer.
      cz.prompt([
        {
          type: 'list',
          name: 'type',
          message: "Seleccione el tipo de cambio que está por realizar: \n",
          choices: choices,
          default: 'refactor',
        },
        {
          type: 'input',
          name: 'name',
          message: function() {
            return (
              'Escriba un nombre para su rama:\n'
            );
          },
          validate: function(subject) {
            const filteredSubject = filterSubject(subject);
            return filteredSubject.length === 0
              ? 'Nombre de la rama es requerido'
              : true;
          },
          transformer: function(subject) {
            const filteredSubject = filterSubject(subject);
            const color = subject.length === 0 ? chalk.red : chalk.green;
            return color('(' + filteredSubject.length + ') ' + subject);
          },
          filter: function(subject) {
            return filterSubject(subject);
          }
        },
        {
          type: 'confirm',
          name: 'jiraAffected',
          message: 'Esta rama esta asociada a una historia de JIRA?',
          default: !!options.defaultIssues
        },
        {
          type: 'input',
          name: 'jiraHistory',
          message: '(Ejemplo: "ASSIAC-123", "CAP-123".):\n',
          when: function(answers) {
            return answers.jiraAffected;
          },
          default: options.defaultIssues ? options.defaultIssues : undefined
        }
      ]).then(function(answers) {
        const wrapOptions = {
          trim: true,
          cut: false,
          newline: '\n',
          indent: '',
          width: options.maxLineWidth
        };
        // feature/CPV-3925#BUSQUEDA-RUC-REPORTES
        const jiraHistory = answers.jiraAffected ? `${answers.jiraHistory}#` : '';
        const branchName = `${answers.type}/${jiraHistory}${answers.name}`;

      });
    }
  };
};
