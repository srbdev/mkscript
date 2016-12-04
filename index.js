#!/usr/bin/env node

const comm = require('commander');
const chalk = require('chalk');
const fs = require('fs');


let file = null;

const shebangs = {
  bash: '#!/bin/bash',
  node: '#!/usr/bin/env node',
  ruby: '#!/usr/bin/env ruby',
  python: '#!/usr/bin/env python'
};

const print = msg => console.log(msg);
const printSuccess = msg => console.log(chalk.cyan(msg));
const printError = msg => console.log(chalk.red(msg));

const successAndOut = msg => {
  printSuccess(msg);
  process.exit(0);
}

const write = (file, data, cb) => {
  fs.writeFile(file, data, err => {
    if (err) {
      printError(`Could not write to file ${ file }`);
      process.exit(1);
    }

    cb ? cb() : null;
  });
}

const chmod = (file, permission, cb) => {
  fs.chmod(file, permission, err => {
    if (err) {
      printError(`Could not chmod file ${ file } to ${ permission }`);
      process.exit(1);
    }

    cb ? cb() : null;
  });
}

const mks = (f, shebang) => {
  write(f, shebang, () => {
    chmod(f, '0744', () => successAndOut(`${ f } successfully created!`));
  });
}

comm
  .version('1.0.0')
  .arguments('<file>')
  .option('-t, --text', 'generate an empty text file')
  .option('-b, --bash', 'generate an executable bash script')
  .option('-n, --node', 'generate an executable node script')
  .option('-r, --ruby', 'generate an executable ruby script')
  .option('-p, --python', 'generate an executable python script')
  .action(f => file = f);

comm.parse(process.argv);

if (!file) {
  console.log(chalk.red('<file> is required'))
  comm.help();
}

if (comm.text)
  write(file, '', () => successAndOut(`${ file } successfully created!`));
else if (comm.bash)
  mks(file, shebangs.bash);
else if (comm.node)
  mks(file, shebangs.node);
else if (comm.ruby)
  mks(file, shebangs.ruby);
else if (comm.python)
  mks(file, shebangs.python);
