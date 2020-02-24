/**
 * Script para añadir el nombre de la rama al inicio del mensaje al hacer un commit
 *
 */
const { spawnSync} = require('child_process');
const chalk = require('chalk');

// Obtiene el nombre de la rama activa
const child = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

if (child.error) {
  console.log(chalk.red('****************************************************'));
  console.log(chalk.red('Error obteniendo rama activa', child.error));
  console.log(chalk.red('****************************************************'));
  process.exit(1);
}

// Nombre de la rama
const branchName = child.stdout.toString().trim();

// Regex para comparar el nombre de la rama
const BRANCH_JIRA_NAME = /^(feat|fix)/;
const BRANCH_SUPPORT_NAME = /^(refactor|ci|style)\//;

if (!BRANCH_JIRA_NAME.test(branchName) && !BRANCH_SUPPORT_NAME.test(branchName)) {

  console.log(chalk.red('*********************************************************************************************************'));
  console.log(chalk.red(`La rama ${branchName} no cumple con los estandares de nomenclatura del proyecto ASSI`));
  console.log(chalk.red('*********************************************************************************************************'));
  process.exit(1);
}
