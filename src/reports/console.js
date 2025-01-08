const chalk = require('chalk');

function generateReport(stats) {
  const lines = [
    chalk.bold('\nProcessing Summary:'),
    `Duration: ${chalk.cyan(stats.duration.toFixed(2))}s`,
    `Total files processed: ${chalk.cyan(stats.processed)}`,
    `Files modified: ${chalk.green(stats.modified)}`,
    `Files skipped: ${chalk.yellow(stats.skipped)}`,
    `Errors encountered: ${chalk.red(stats.errors.length)}`
  ];

  if (stats.errors.length > 0) {
    lines.push(
      '',
      chalk.red('Errors:'),
      ...stats.errors.map(({ file, error }) => 
        chalk.gray(`- ${file}: ${error}`)
      )
    );
  }

  return lines.join('\n');
}

module.exports = { generateReport };
