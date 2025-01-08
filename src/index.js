#!/usr/bin/env node
const { Command } = require('commander');
const { removeCommand } = require('./commands/remove');
const { restoreCommand } = require('./commands/restore');

const program = new Command();

program
  .name('remove-logs')
  .description('CLI tool to remove logging statements from source code')
  .version('1.0.0');

program
  .command('remove')
  .description('Remove logging statements from source files')
  .option('-d, --dry-run', 'Preview changes without modifying files')
  .option('-i, --ignore <paths>', 'Additional paths to ignore, comma-separated')
  .option('-l, --languages <types>', 'Filter specific languages, comma-separated')
  .option('-p, --path <directory>', 'Target directory path', process.cwd())
  .option('-v, --verbose', 'Enable verbose logging')
  .action(removeCommand);

program
  .command('restore')
  .description('Restore files from backups')
  .option('-p, --path <directory>', 'Target directory path', process.cwd())
  .action(restoreCommand);

program.parse();
