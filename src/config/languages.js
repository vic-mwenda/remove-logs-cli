const LANGUAGE_CONFIGS = {
    javascript: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'],
      patterns: [
        {
          type: 'CallExpression',
          match: (node) => 
            node.callee.type === 'MemberExpression' &&
            node.callee.object.name === 'console' &&
            ['log', 'debug', 'info', 'trace'].includes(node.callee.property.name)
        }
      ],
      parser: {
        name: '@babel/parser',
        options: {
          sourceType: 'module',
          plugins: ['jsx', 'typescript', 'decorators-legacy', 'classProperties']
        }
      }
    },
    python: {
      extensions: ['.py'],
      patterns: [
        {
          type: 'CallExpression',
          match: (node) =>
            (node.callee.type === 'Identifier' && node.callee.name === 'print') ||
            (node.callee.type === 'MemberExpression' && 
             node.callee.object.name === 'logging' &&
             ['debug', 'info', 'warning', 'error'].includes(node.callee.property.name))
        }
      ],
      parser: {
        name: '@babel/parser',
        options: { sourceType: 'module' }
      }
    },
    java: {
      extensions: ['.java'],
      patterns: [
        {
          type: 'CallExpression',
          match: (node) =>
            node.callee.type === 'MemberExpression' &&
            ['System.out.println', 'System.out.print', 'logger.info', 'logger.debug'].some(pattern => 
              node.callee.property.name === pattern.split('.').pop())
        }
      ],
      parser: {
        name: '@babel/parser',
        options: { sourceType: 'module' }
      }
    },
    php: {
      extensions: ['.php'],
      patterns: [
        {
          type: 'CallExpression',
          match: (node) => {
            const isErrorLog = node.callee.type === 'Identifier' && 
              ['error_log', 'print_r', 'var_dump', 'var_export'].includes(node.callee.name);
            
            const isEcho = node.callee.type === 'Identifier' && 
              ['echo', 'print'].includes(node.callee.name);
              
            const isLogger = node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'Logger' &&
              ['debug', 'info', 'warning', 'error'].includes(node.callee.property.name);
              
            return isErrorLog || isEcho || isLogger;
          }
        }
      ],
      parser: {
        name: '@babel/parser',
        options: { sourceType: 'module' }
      }
    },
    kotlin: {
      extensions: ['.kt', '.kts'],
      patterns: [
        {
          type: 'CallExpression',
          match: (node) => {
            const isPrintln = node.callee.type === 'Identifier' && 
              ['println', 'print'].includes(node.callee.name);
              
            const isLogger = node.callee.type === 'MemberExpression' &&
              (node.callee.object.name === 'Log' || node.callee.object.name === 'Logger') &&
              ['d', 'debug', 'i', 'info', 'w', 'warn', 'e', 'error'].includes(node.callee.property.name);
              
            return isPrintln || isLogger;
          }
        }
      ],
      parser: {
        name: '@babel/parser',
        options: { sourceType: 'module' }
      }
    },
    csharp: {
      extensions: ['.cs'],
      patterns: [
        {
          type: 'CallExpression',
          match: (node) => {
            const isConsole = node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'Console' &&
              ['WriteLine', 'Write', 'Debug'].includes(node.callee.property.name);
              
            const isDebug = node.callee.type === 'MemberExpression' &&
              node.callee.object.name === 'Debug' &&
              ['WriteLine', 'Write', 'Log'].includes(node.callee.property.name);
              
            const isLogger = node.callee.type === 'MemberExpression' &&
              (node.callee.object.name === '_logger' || node.callee.object.name === 'Logger') &&
              ['LogDebug', 'LogInformation', 'LogWarning', 'LogError'].includes(node.callee.property.name);
              
            return isConsole || isDebug || isLogger;
          }
        }
      ],
      parser: {
        name: '@babel/parser',
        options: { sourceType: 'module' }
      }
    }
  };

module.exports = { LANGUAGE_CONFIGS };
