var Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const validLicenses = fs.readdirSync(path.join(__dirname, 'templates'));

module.exports = class extends Generator {
  constructor(args, opts, features) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts, features);
    this.argument('flavor', { type: 'string', default: 'MIT' });
    this.argument('copyrightHolder', {
      type: 'string',
      default: 'Common CMMN Pty Ltd',
    });
  }

  initializing() {
    if (!validLicenses.includes(this.options.flavor)) {
      throw new Error(
        `Template for license does not exist, choose one of ${validLicenses.join(
          ', '
        )}`
      );
    }
  }

  writingToPackage() {
    const packagePath = this.destinationRoot('./package.json');
    if (!this.fs.exists(packagePath)) return;
    this.fs.extendJSON(packagePath, { license: this.options.license });
  }

  writingConfig() {
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
