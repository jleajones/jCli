import { program } from 'commander';

export const cli = (args) => {
  program
    .arguments('<componentName>')
    .option('-f, --functional', 'Creates a functional component')
    .option('-s, --useState', 'Include useState hook')
    .option('-e, --useEffect', 'Include useEffect hook')
    .action(function (componentName) {
      console.log(componentName);
      console.log(program.opts());
    })
    .parse(args);
};
