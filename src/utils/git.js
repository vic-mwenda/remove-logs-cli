const { execSync } = require('child_process');
const chalk = require('chalk');

function checkGitStatus() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    
    const status = execSync('git status --porcelain').toString().trim();
    
    if (status) {
      console.log(chalk.yellow('Git working directory has uncommitted changes:'));
      console.log(chalk.gray(status));
      return false;
    }
    
    return true;
  } catch (error) {
    console.log(chalk.gray('Not a git repository. Proceeding without git checks.'));
    return true;
  }
}

module.exports = { checkGitStatus };
