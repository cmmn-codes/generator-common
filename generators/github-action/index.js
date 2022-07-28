var Generator = require('yeoman-generator');
var _ = require('lodash');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async prompting() {
    const answers = await this.prompt([
      {
        question: 'What would you like to call this action?',
        type: 'string',
        name: 'actionName',
        default: 'tests',
      },
    ]);
    if (!answers.actionName.trim()) {
      throw new Error('expect non-empty string for action name');
    }
    this.options.actionName = answers.actionName;
  }

  writingConfig() {
    this.fs.copyTpl(
      this.templatePath('action.ejs'),
      this.destinationPath(
        `.github/workflows/${_.kebabCase(this.options.actionName)}.yml`
      ),
      this.options
    );
  }
};
