const fs = require('fs');
const path = require('path');
const { ProcessingStats } = require('../utils/stats');
const { createProgressBar } = require('../utils/progress');
const { checkGitStatus } = require('../utils/git');
const { generateReport } = require('../reports/console');
const { loadConfig } = require('../config');
const chalk = require('chalk');

async function restoreCommand(options) {
  const stats = new ProcessingStats();
  const config = loadConfig();
  const targetDir = options.path || process.cwd();
  const backupDir = path.join(targetDir, config.backupDir);

  if (!fs.existsSync(backupDir)) {
    console.log(chalk.yellow('No backup directory found at:', backupDir));
    return;
  }

  if (!options.dryRun && !checkGitStatus()) {
    console.log(chalk.yellow('Warning: Git working directory is not clean'));
  }

  console.log(chalk.blue('Scanning backup directory:'), backupDir);

  function findBackupFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        results = results.concat(findBackupFiles(fullPath));
      } else {
        results.push(fullPath);
      }
    }
    return results;
  }

  const backupFiles = findBackupFiles(backupDir);

  if (backupFiles.length === 0) {
    console.log(chalk.yellow('No backup files found.'));
    return;
  }

  console.log(chalk.green(`\nFound ${backupFiles.length} backup files`));

  const progress = createProgressBar();
  progress.start(backupFiles.length, 0);

  for (const backupFile of backupFiles) {
    try {
      const relativePath = path.relative(backupDir, backupFile);
      const targetFile = path.join(targetDir, relativePath);

      if (options.dryRun) {
        console.log(chalk.cyan(`\nWould restore: ${relativePath}`));
        if (options.verbose) {
          const content = fs.readFileSync(backupFile, 'utf8');
          console.log(chalk.gray(content));
        }
      } else {
        fs.mkdirSync(path.dirname(targetFile), { recursive: true });
        
        fs.copyFileSync(backupFile, targetFile);

        if (options.cleanup) {
          fs.unlinkSync(backupFile);
          
          let dir = path.dirname(backupFile);
          while (dir !== backupDir) {
            if (fs.readdirSync(dir).length === 0) {
              fs.rmdirSync(dir);
              dir = path.dirname(dir);
            } else {
              break;
            }
          }
        }

        stats.modified++;
      }

      stats.processed++;
    } catch (error) {
      stats.addError(backupFile, error);
    }

    progress.increment();
  }

  progress.stop();

  const report = generateReport(stats.generateReport());
  console.log('\n' + report);

  if (options.dryRun) {
    console.log(chalk.cyan('\nDry run completed. No files were restored.'));
  } else {
    console.log(chalk.green('\nRestore completed successfully.'));
    if (stats.errors.length > 0) {
      console.log(chalk.yellow('\nSome files had errors. Check the report for details.'));
    }
    if (options.cleanup) {
      console.log(chalk.green('Backup files have been cleaned up.'));
    }
  }
}

module.exports = { restoreCommand };