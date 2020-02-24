/**
 * Script para añadir el nombre de la rama al inicio del mensaje al hacer un commit
 *
 */
const fs = require('fs');
const { spawnSync} = require('child_process');
// Ruta al mensaje del commit
const pathMsg = '.git/COMMIT_EDITMSG';
// Mensaje del commit
const message = fs.readFileSync(pathMsg, 'utf8').trim();
// Nombre de Usuario en Git
const name = spawnSync('git', ['config', '--global', '--get', 'user.name']);

// Obtiene el nombre de la rama activa
const child = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

if (child.error) {
  console.log('Error obteniendo rama activa...', child.error);
  process.exit(1);
}
// Nombre de la rama
const branchName = child.stdout.toString('utf8').trim().split('#')[0];

// Actualiza el mensaje del commit con el nombre de la rama delante
fs.writeFile(pathMsg, `${branchName}: ${message} ${getName()}`,  (err) => {
  if(err) {
    console.log('Error escribiendo el mensaje del commit', err);
    process.exit(1);
  }
  process.exit(0);
});
function getName() {
  const authorName = name.stdout.toString('utf8').trim().split('#')[0];
  return authorName ? `(Author: ${authorName})` : '';
}
