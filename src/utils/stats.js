class ProcessingStats {
  constructor() {
    this.processed = 0;
    this.modified = 0;
    this.skipped = 0;
    this.errors = [];
    this.startTime = Date.now();
  }

  addError(file, error) {
    this.errors.push({ file, error: error.message });
  }

  generateReport() {
    return {
      duration: (Date.now() - this.startTime) / 1000,
      processed: this.processed,
      modified: this.modified,
      skipped: this.skipped,
      errors: this.errors
    };
  }
}

module.exports = { ProcessingStats };
