const inquirer = require('inquirer');
const semver = require('semver');
const chalk = require('chalk');
const fs = require('fs-extra');
const figlet = require('figlet');
const path = require('path');

const { exec } = require('child_process');
const packageJsonPath = path.resolve(__dirname, '../package.json');
const distPath = path.resolve(__dirname, '../dist');
const appPath = path.join(distPath, 'dev');
const srcPath = path.resolve(__dirname, '../src');
const appPackageJsonPath = path.join(appPath, 'package.json');

const questions = [
  {
    type: "input",
    name: "version",
    message: "input the packages version:",
    validate: function (version) {
      return semver.valid(version) ? true : "version is not validated";
    }
  },
//   {
//     type: "input",
//     name: "resourceVersion",
//     message: "input the resource version:",
//   },
//   {
//     type: "rawlist",
//     name: "userType",
//     message: "Choose the type",
//     choices: ["teacher", "student"]
//   },
//   {
//     type: "rawlist",
//     name: "env",
//     message: "Choose the env",
//     choices: ["test", "uat", "prod"]
//   },
//   {
//     type: "confirm",
//     name: "clean",
//     message: "保留缓存？"
//   },
//   {
//     type: "confirm",
//     name: "npm",
//     message: "保留npm？"
//   }
];

console.log(`
  CPU: ${chalk.red('90%')}
  RAM: ${chalk.green('40%')}
  DISK: ${chalk.yellow('70%')}
`);

start()
  .then(res => console.log(chalk.green('success')))
  .catch(err => console.log(chalk.red(err)));

async function start() {
  console.log(chalk.green(figlet.textSync('start')))
  // const answer = await inquirer.prompt(questions);
  const answer = { version: '1.0.0' }
  // console.log('answer', answer);
  // await clear();
  // await copy();
  // await rewritePackageJson(answer);
  // await npmInstall();
  // console.log('install done');
  // delRedundant();
  await buildPackageJson(answer);
  await build();
}
function npmInstall() {
  console.log('npm install')
  return new Promise(function (resolve, reject) {
    try {
      exec(
        'npm install --production',
        { cwd: appPath },
        (err, stdout, stderr) => {
          if (err) {
            reject(err);
          }
          console.log(stdout);
          console.log(stderr);
          resolve();
        }
      )
    } catch(err) {
      reject(err);
    }
  });
}

function build() {
  console.log('start rebuild');
  const rebuild = require('electron-rebuild').default;
  console.log('rebuild', rebuild);
  return rebuild({
    // buildPath: appPath,
    buildPath: srcPath,
    electronVersion: '16.0.5',
  })
}
function clear() {
  console.log('clean');
  return new Promise(function (resolve, reject) {
    if (fs.existsSync(appPath)) {
      fs.removeSync(appPath);
      resolve();
    }
    resolve()
  });
}
async function copy() {
  console.log('copy');
  await fs.copy(path.resolve(__dirname, '../src'), appPath, {
    filter: src => src.indexOf('node_modules') === -1,
  })
}
async function rewritePackageJson (answer) {
  console.log('rewrite package.json');
  const { dependencies, agora_electron } = await fs.readJson(packageJsonPath);
  const packageJson = {
    version: answer.version,
    dependencies,
    main: path.join(appPath, 'app.js'),
    agora_electron,
  }
  await fs.writeJson(appPackageJsonPath, packageJson)
}
function delRedundant() {
  console.log('delete redundant files');
  fs.removeSync(path.join(appPath, '.npmrc'));
  fs.removeSync(path.join(appPath, 'package-lock.json'));
}

async function buildPackageJson(answer) {
  console.log('build package.json');
  const srcPackageJsonPath = path.join(srcPath, 'package.json');
  const { dependencies, agora_electron, main } = await fs.readJson(packageJsonPath);
  const packageJson = {
    version: answer.version,
    dependencies,
    agora_electron,
    main,
  }
  await fs.writeJson(srcPackageJsonPath, packageJson)
}