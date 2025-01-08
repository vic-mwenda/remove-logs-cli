const fs = require('fs');
const path = require('path');
const { LANGUAGE_CONFIGS } = require('../config/languages');

function getSourceFiles(dir, options) {
  const files = [];
  const { ignorePaths, languages } = options;

  function getSupportedExtensions() {
    return languages
      .map(lang => LANGUAGE_CONFIGS[lang]?.extensions || [])
      .flat();
  }

  function isIgnored(filePath) {
    return ignorePaths.some(ignorePath => 
      filePath.includes(path.normalize(ignorePath))
    );
  }

  function traverse(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    const supportedExts = getSupportedExtensions();

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (isIgnored(fullPath)) continue;

      if (entry.isDirectory()) {
        traverse(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(fullPath).toLowerCase();
        if (supportedExts.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  traverse(dir);
  return files;
}

module.exports = { getSourceFiles };
