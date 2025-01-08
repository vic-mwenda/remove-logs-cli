const cliProgress = require('cli-progress');
const chalk = require('chalk');

function createProgressBar() {
  const bar = new cliProgress.SingleBar({
    format: `${chalk.cyan('Processing')} |${chalk.cyan('{bar}')}| {percentage}% || {value}/{total} files`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591'
  });

  return bar;
}

module.exports = { createProgressBar };
