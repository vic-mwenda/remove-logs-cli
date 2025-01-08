# Log Remover

A language-agnostic tool for removing logging statements from your source code. Supports multiple programming languages and provides backup functionality.

## Features

- **Multi-Language Support**: 
  - JavaScript/TypeScript (.js, .jsx, .ts, .tsx)
  - Python (.py)
  - Java (.java)
  - C++ (.cpp, .hpp)

- **Safety Features**:
  - Creates automatic backups before modifications
  - Dry-run mode to preview changes
  - Restore functionality to revert changes
  - Backup cleanup utility

- **Smart Detection**:
  - Identifies language-specific logging patterns
  - Handles multiple logging frameworks
  - Ignores non-logging code

## Installation


npm install -g remove-logs-cli

## Or install locally in your project
npm install --save-dev remove-logs-cli


## Usage

### Remove Logging Statements

remove-logs remove --path ./your/code/path


### Restore from Backup

remove-logs restore --path ./your/code/path


## Command Options

### Remove Command
- `-d, --dry-run`: Preview changes without modifying files
- `-i, --ignore <paths>`: Additional paths to ignore (comma-separated)
- `-l, --languages <types>`: Filter specific languages (comma-separated)
- `-p, --path <directory>`: Target directory path (defaults to current directory)
- `-v, --verbose`: Enable verbose logging

### Restore Command
- `-p, --path <directory>`: Target directory path (defaults to current directory)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Create an issue for bug reports or feature requests
- Star the repository if you find it useful
- Follow the project for updates

## Acknowledgments

- Inspired by the need for clean production code
- Built with love for the developer community