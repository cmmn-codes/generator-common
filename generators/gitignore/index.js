var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts, features) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts, features);
  }

  writingConfig() {
    this.fs.copyTpl(
      this.templatePath('default.ejs'),
      this.destinationPath('.gitignore')
    );
  }
};
