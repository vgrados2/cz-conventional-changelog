# ibk-conventions (@assi/ibk-conventions)

Esta libreria esta desarrollada para externalizar las valicaciones y reglas que tenemos dentro
de cada proyecto.

## Como utilizarla

```shell
npm i @assi/ibk-conventions -D
```
### Las convenciones que se tienen actualmente son las siguientes

| Modulos del Proyecto          | Description                                                                       |
| ------------------------------| --------------------------------------------------------------------------------- |
| ibk-conventions-git           | Validaciones y configuraciones para la creacion de commits y ramas.               |
| ibk-conventions-tslint        | Validaciones de tslint para los distintos proyectos.                              |
| ibk-conventions-versioning    | Scripts para el versionado automatico de librerias.                               |

---
### GUIA PARA (*ibk-conventions-git*)

Para la utilizacion de este modulo se exponen 3 scripts (BIN) los cuales funcionan con **husky**

* **cn-ibk-branch-generate:** Genera una nueva rama con las conveciones de ASSI
* **cn-branch-validator:** Valida si el nombre de la rama cumple con las convenciones de ASSI
* **cn-commit-normalize:** Renombra el commit generado con las convenciones de ASSI

> No se requiere instalar **husky** ya que esta libreria ya lo tiene preinstalado.

Para configurar este modulo en su proyecto:

* En su proyecto cree un archivo con el nombre **.huskyrc.js**

Este archivo contendra lo siguiente:

```js
module.exports = {
  'hooks': {
    "prepare-commit-msg": "cn-branch-validator && cn-commit-normalize",
    "pre-push": "cn-branch-validator && npm run lint"
  }
};
```

De esta forma en el *prepare-commit-msg*: validaremos la rama y normalizaremos el nuevo commit generado. y antes de
hacer el push de nuestra rama validaremos que la rama cumpla con las convenciones de ASSI.

---
## GUIA PARA (*ibk-conventions-tslint*)

Este modulo permite terner un unico archivo tslint el cual podamos insertar en cada uno de los proyectos, las validaciones de
tslint son distintas por tipo de framework.

Para configurar este modulo en su proyecto:

* En el archivo **tslint.json** que se encuentra en la raiz del proyecto realize la siguiente configuracion.

Para un proyecto de angular (ibk-tslint-angular.json):

```json
{
  "extends": "@assi/ibk-conventions/modules/ibk-conventions-tslint/ibk-tslint-angular.json"
}

```

De esta forma las validaciones se inyectaran en su proyecto.

---

## GUIA PARA (*ibk-conventions-versioning*)

Este modulo tiene la finalidad de versionar automaticamente los modulos del proyecto donde se utilizara, realizando
el versionamiento del package.json del modulo y generando un tag git con la version que corresponde.

```shell
# Este modulo requiere intalar lerna globalmente

npm i lerna@3.20.2 -g
```

Para configurar este modulo en su proyecto:

* En su proyecto cree un archivo con el nombre **lerna.json**

```json

{
  "packages": [
    "projects/*"
  ],
  "version": "independent",
  "command": {
    "publish": {
      "message": "VERSION GENERADA",
      "registry": "http://localhost:4873/"
    }
  }
}

```

Donde:
* **packages**: Directorio donde se encuentran los proyectos a versionar.
* **message**: Mensaje que se utilizara al generar el commit para el tag.
* **registry**: Registry a donde se publicaran los paquetes.

Para utilizar lerga ejecute el siguiente script (BIN) **cn-versioning-lerna** o agregelo
en su packag.json en la seccion de **scripts** de la siguiente manera:

```json
{
  "scripts": {
    "start": "ng serve",
    "publish:lerna": "cn-versioning-lerna"
  }
}
```

> Para la ejecucion de lerna, no se debe tener cambios pendientes en su proyecto de trabajo
> no olvide commitear todos sus cambios.
