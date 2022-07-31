var Generator = require('yeoman-generator');
require('lodash').extend(
  Generator.prototype,
  require('yeoman-generator/lib/actions/install')
);

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.env.options.nodePackageManager = 'yarn';
    this.argument('packageName', { type: 'string', required: false });
    this.option('private');
    this.option('module');
  }

  async prompting() {
    if (this.options.packageName) {
      this.answers = { name: this.options.packageName };
      return;
    }
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description',
        default: '',
      },
    ]);
    this.answers = answers;
  }

  writing() {
    this.log('writing default package.json');
    const pkgJson = {
      name: this.answers.name,
      version: '1.0.0',
      description: this.answers.description || '',
      private: !!this.options.private,
      author: '',
      license: 'MIT',
    };
    if (this.options.module) {
      pkgJson.type = 'module';
    }

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }
};
