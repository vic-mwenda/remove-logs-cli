const fs = require('fs');
const path = require('path');
const { LANGUAGE_CONFIGS } = require('./languages');

function loadConfig() {
  const configFiles = [
    '.removelogsrc',
    '.removelogsrc.json',
    '.removelogsrc.js',
    'package.json'
  ];

  for (const file of configFiles) {
    const configPath = path.join(process.cwd(), file);
    
    if (fs.existsSync(configPath)) {
      let config = {};
      
      if (file === 'package.json') {
        const packageJson = require(configPath);
        config = packageJson.removeLogs || {};
      } else {
        config = require(configPath);
      }

      return {
        ignore: ['node_modules', 'dist', 'build', ...config.ignore || []],
        backupDir: config.backupDir || 'backups',
        languages: config.languages || Object.keys(LANGUAGE_CONFIGS),
        patterns: config.patterns || {}
      };
    }
  }

  return {
    ignore: ['node_modules', 'dist', 'build'],
    backupDir: 'backups',
    languages: Object.keys(LANGUAGE_CONFIGS),
    patterns: {}
  };
}

module.exports = { loadConfig };