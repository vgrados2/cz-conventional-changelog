/**
 * Script para añadir el nombre de la rama al inicio del mensaje al hacer un commit
 *
 */
const { spawnSync, exec } = require('child_process');


// Obtiene el nombre de la rama activa
const child = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD']);

if (child.error) {
  console.log('Error obteniendo rama activa', child.error);
  process.exit(1);
}

const branchName = child.stdout.toString().trim();
console.warn('*** BRANCH NAME LERNA ***');
console.warn(branchName);
console.warn('*************************');
// exec("lerna changed --json", (error, stdout, stderr) => {
//   if (error) {
//     console.log(`error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.log(`${stderr}`);
//     console.log(`${stdout}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });

exec("lerna version patch --yes", (error, stdout, stderr) => {
  if (error) {
    console.warn('*** ERROR LERNA UPGRADE VERSION ***');
    console.log(`error: ${error.message}`);
    console.warn('***********************************');
    return;
  }
  if (stderr) {
    console.warn('*** SUCCESS LERNA UPGRADE VERSION ***');
    console.log(`${stderr}`);
    console.log(`${stdout}`);
    console.warn('*************************************');
    return;
  }
  console.log(`stdout: ${stdout}`);
});
// exec("lerna publish from-git --yes", (error, stdout, stderr) => {
//   if (error) {
//     console.log(`error: ${error.message}`);
//     return;
//   }
//   if (stderr) {
//     console.log(`${stderr}`);
//     console.log(`${stdout}`);
//     return;
//   }
//   console.log(`stdout: ${stdout}`);
// });
