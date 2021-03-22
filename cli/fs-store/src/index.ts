#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import { resolve } from 'path';
import program from 'commander';
import _ from 'lodash';
import { exit } from 'process';
import { UploadFile } from './commands/uploadFile';
import { ListFiles } from './commands/listFiles';
import { DeleteFile } from './commands/deleteFile';
import { FileServerService } from './services/fileServer';
import { LOG } from './config/logger';

function main() {
  clear();
  LOG.info(chalk.red(figlet.textSync('fs-cli', { horizontalLayout: 'full' })));

  program
    .version('0.0.1')
    .description('An awesome CLI for interacting with fs server')
    .option('-u, --upload <file>', 'Upload file to the server', String)
    .option('-l, --list', 'List files on the server')
    .option('-d, --delete <fileId>', 'Delete file from the server', String)
    .parse(process.argv);

  const userCommand = program.opts();

  if (
    _.isEmpty(userCommand) ||
    _.size(userCommand) > 1 ||
    process.argv.length > 4
  ) {
    program.outputHelp();
    exit(0);
  }

  LOG.info(`File Server = ${FileServerService.getHost()}`);
  LOG.info('To change host. Set FS_HOST in your shell environment.');
  delegateCommand(userCommand);
}

function delegateCommand(userCommand: program.OptionValues) {
  switch (_.keys(userCommand)[0]) {
    case 'list':
      new ListFiles().execute();
      break;
    case 'upload':
      new UploadFile().execute(resolve(process.cwd(), userCommand['upload']));
      break;
    case 'delete':
      new DeleteFile().execute(userCommand['delete']);
      break;
    default:
      program.outputHelp();
      break;
  }
}

main();
