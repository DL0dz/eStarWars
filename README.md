eStarWars
====

## Prérequis

- Node.js : ^5.1.1.  Pour jouer avec les versions de node, vous pouvez utiliser
	[nvm](https://www.npmjs.com/package/nvm).
- Npm : ^3.3.12
- Nodemon : ^1.8.1 installé via npm au global.
- Mongodb : ^3.0.7

## Installation

Cloner l'appli et l'installer
```shell
git clone https://github.com/DL0dz/eStarWars.git
cd estarwars
git checkout develop
npm install
```

Créer un répertoire pour mongodb, exemple `data` et y lancer une instance de
mongodb.
```shell
mkdir data
mongod --dbpath=./data/
```

## Utilisation

Lancer la base, un brunch watch pour builder les assets, et le serveur nodemon.
```shell
mongod --dbpath=./data/
```
```shell
brunch w
```
```shell
npm run dev
```

Sur une machine windows ce sera plutôt :
```shell
set DEBUG=estarwars:* nodemon ./bin/www
```

Puis ouvrez votre browser sur [http://localhost:2187](http://localhost:2187)

## Développements

Chaque commit est vérifié par [eslint](http://eslint.org). Il est configuré avec
[les règles d'airbnb](https://github.com/airbnb/javascript). Nous suivons le
codestyle de ce guide.

Pour connaître les erreurs avant le commit, installer le linter sur votre
éditeur. Pour sublimeText : `SublimeLinter` + `SublimeLinter-contrib-eslint`

