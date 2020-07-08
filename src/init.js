import fs from 'fs';
import path from 'path';
import { program } from 'commander';
import inquirer from 'inquirer';
import ncp from 'ncp';
import execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import chalk from 'chalk';

import { promisify } from 'util';

const jcliPath = path.join(process.cwd(), 'jcli.json');
const access = promisify(fs.access);
const copy = promisify(ncp);

async function initGit(targetDirectory) {
  const result = await execa('git', ['init'], {
    cwd: targetDirectory
  });

  if (result.failed) {
    return Promise.reject(new Error('Failed to initialize git'));
  }
}

const copyTemplateFiles = async (templateDirectory, targetDirectory) => {
  return copy(templateDirectory, targetDirectory, {
    clobber: false
  });
};

const initAction = async () => {
  const { componentDir, modelDir, serviceDir, graphQLDir } = program.opts();
  const questions = [
    {
      type: 'text',
      name: 'name',
      message: 'What is the name of the project? 🤔',
      default: path.basename(process.cwd())
    },
    {
      type: 'list',
      name: 'type',
      message: 'What type of project? 🛠',
      choices: ['React', 'Vue']
    }
  ];

  if (!componentDir) {
    questions.push({
      type: 'text',
      name: 'componentDir',
      message: 'Specify directory to store components 💡',
      default: '/src/components'
    });
  }

  if (!modelDir) {
    questions.push({
      type: 'text',
      name: 'modelDir',
      message: 'Specify directory to store objection models 🧱',
      default: '/src/models'
    });
  }

  if (!serviceDir) {
    questions.push({
      type: 'text',
      name: 'serviceDir',
      message: 'Specify directory to store services ⚙️',
      default: '/src/services'
    });
  }

  if (!graphQLDir) {
    questions.push({
      type: 'text',
      name: 'graphQLDir',
      message: 'Specify directory to store graphQL schemas 🚀',
      default: '/src/graphql'
    });
  }

  const answers = await inquirer.prompt(questions);
  const currentFileUrl = import.meta.url;
  const templateDir = path.resolve(
    new URL(currentFileUrl).pathname,
    '../../templates',
    answers.type.toLowerCase()
  );

  try {
    await access(templateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  const tasks = new Listr([
    {
      title: 'Copy project files',
      task: async (ctx, task) => {
        task.output = 'Copying files...';
        await copyTemplateFiles(templateDir, process.cwd())
      }
    },
    {
      title: 'Initialize git',
      task: async (ctx, task) => {
        task.output = 'Initializing Git repository...';
        await initGit(process.cwd())
      }
    },
    {
      title: 'Install dependencies',
      task: async (ctx, task) => {
        task.output = 'Installing dependencies...';
        await projectInstall({
          cwd: process.cwd()
        });
      }
    }
  ]);

  const config = {
    name: answers.name,
    componentDir: componentDir || answers.componentDir,
    modelDir: modelDir || answers.modelDir,
    serviceDir: serviceDir || answers.serviceDir,
    graphQLDir: graphQLDir || answers.graphQLDir
  };

  fs.writeFileSync(jcliPath, JSON.stringify(config, null, 2), 'utf8');
  await tasks.run();
  console.log('%s Project ready', chalk.green.bold('DONE'));
  process.exit(0);
};

export const cli = (args) => {
  program
    .option('-v, --verbose', 'Log verbose output')
    .option('-i, --install', 'Install dependencies')
    .option('-c, --componentDir [relativePath]', 'Set component directory')
    .option('-m, --modelDir [relativePath]', 'Set model directory')
    .option('-s, --serviceDir [relativePath]', 'Set service directory')
    .option('-g, --graphQLDir [relativePath]', 'Set graphQL directory')
    .action(initAction)
    .parse(args);
};
