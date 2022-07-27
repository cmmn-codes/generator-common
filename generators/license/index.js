var Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const validLicenses = fs.readdirSync(path.join(__dirname, 'templates'));

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.argument('flavor', { type: 'string', default: 'MIT' });
    this.argument('copyrightHolder', {
      type: 'string',
      default: 'Common CMMN Pty Ltd',
    });
  }

  writingConfig() {
    if (!validLicenses.includes(this.options.flavor)) {
      throw new Error(
        `Template for license does not exist, choose one of ${validLicenses.join(
          ', '
        )}`
      );
    }
    this.fs.copyTpl(
      this.templatePath(this.options.flavor),
      this.destinationPath('LICENSE'),
      {
        year: new Date().getFullYear(),
        name: this.options.copyrightHolder,
      }
    );
  }
};
