import chalk from 'chalk';
import figlet from 'figlet';
import { program } from 'commander';

import pkg from '../package.json';

export const cli = (args) => {
  console.log(
    chalk.yellow(figlet.textSync('jCli', { horizontalLayout: 'full' }))
  );

  program
    .version(pkg.version)
    .addHelpCommand('help [command]', '⛑  Display help for a command')
    .command('init', '✨ Initialize new SaaS-Framework project')
    .alias('i')
    .command('component', '💡 Create new react component scaffolding')
    .alias('c')
    .command('model <model_name>', '🧱 Create new objection model scaffolding')
    .alias('m')
    .command('service <service_name>', '📡 Create new service scaffolding')
    .alias('s')
    .command('schema <schema_name>', '🧰 Create new GraphQL scaffolding')
    .alias('g')
    .parse(args);
};
