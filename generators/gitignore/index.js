var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  writingConfig() {
    this.fs.copyTpl(
      this.templatePath('default.ejs'),
      this.destinationPath('.gitignore')
    );
  }
};
