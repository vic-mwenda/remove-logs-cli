const fs = require('fs');
const path = require('path');
const { ProcessingStats } = require('../utils/stats');
const { createProgressBar } = require('../utils/progress');
const { checkGitStatus } = require('../utils/git');
const { generateReport } = require('../reports/console');
const { loadConfig } = require('../config');
const { getSourceFiles } = require('../utils/filter');
const { removeLoggingStatements } = require('../patterns');
const chalk = require('chalk');

async function removeCommand(options) {
  const stats = new ProcessingStats();
  const config = loadConfig();
  const targetDir = options.path || process.cwd();
  
  const ignorePaths = [
    ...(config.ignore || []),
    ...(options.ignore ? options.ignore.split(',') : [])
  ];

  const selectedLanguages = options.languages ? 
    options.languages.split(',') : 
    config.languages;

  if (!options.dryRun && !checkGitStatus()) {
    console.log(chalk.yellow('Warning: Git working directory is not clean'));
  }

  console.log(chalk.blue('Scanning directory:'), targetDir);
  console.log(chalk.blue('Selected languages:'), selectedLanguages.join(', '));

  const sourceFiles = getSourceFiles(targetDir, {
    ignorePaths,
    languages: selectedLanguages
  });

  if (sourceFiles.length === 0) {
    console.log(chalk.yellow('No supported source files found.'));
    return;
  }

  console.log(chalk.green(`\nFound ${sourceFiles.length} source files`));
  
  const progress = createProgressBar();
  progress.start(sourceFiles.length, 0);

  for (const file of sourceFiles) {
    try {
      const relativePath = path.relative(targetDir, file);
      const code = fs.readFileSync(file, 'utf8');
      
      const transformedCode = await removeLoggingStatements(code, file);
      
      if (code !== transformedCode) {
        if (options.dryRun) {
          console.log(chalk.cyan(`\nWould modify: ${relativePath}`));
          if (options.verbose) {
            console.log(chalk.gray(transformedCode));
          }
        } else {
          const backupDir = path.join(targetDir, config.backupDir);
          const backupPath = path.join(backupDir, relativePath);
          
          fs.mkdirSync(path.dirname(backupPath), { recursive: true });
          fs.writeFileSync(backupPath, code);
          
          fs.writeFileSync(file, transformedCode);
        }
        stats.modified++;
      } else {
        stats.skipped++;
      }
      
      stats.processed++;
    } catch (error) {
      stats.addError(file, error);
    }
    
    progress.increment();
  }

  progress.stop();

  const report = generateReport(stats.generateReport());
  console.log('\n' + report);

  if (options.dryRun) {
    console.log(chalk.cyan('\nDry run completed. No files were modified.'));
  } else {
    console.log(chalk.green('\nProcessing completed successfully.'));
    if (stats.errors.length > 0) {
      console.log(chalk.yellow('\nSome files had errors. Check the report for details.'));
    }
  }
}

module.exports = { removeCommand };
