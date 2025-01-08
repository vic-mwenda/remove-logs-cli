const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const path = require('path');
const { LANGUAGE_CONFIGS } = require('../config/languages');

async function removeLoggingStatements(code, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const langConfig = Object.values(LANGUAGE_CONFIGS)
    .find(config => config.extensions.includes(ext));

  if (!langConfig) {
    throw new Error(`Unsupported file type: ${ext}`);
  }

  const ast = parse(code, langConfig.parser.options);

  traverse(ast, {
    CallExpression(path) {
      if (langConfig.patterns.some(pattern => pattern.match(path.node))) {
        path.remove();
      }
    }
  });

  const output = generate(ast, {
    retainLines: true,
    compact: false
  });

  return output.code;
}

module.exports = { removeLoggingStatements };
