var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }
  
  initializing() {
    this.composeWith([require.resolve('../app'), require.resolve('../gitignore'), require.resolve('../linting')]);
    this.composeWith([require.resolve('../ts')]);
  }
  
  addHelloWorldSourceFile() {
    this.log('Create source files');
    this.fs.copyTpl(
      this.templatePath('index.ts'),
      this.destinationPath('./src/index.ts')
    );
  }
  
  addPackageScripts() {
    this.log('Create source files');
    const scripts = {
      build: "tsc",
      dev: "tsc -w",
      lint: 'eslint src/.',
      'lint:fix': 'eslint --fix src/.',
      'prepublish': 'yarn lint',
      'preversion': 'yarn lint'
    }
    this.fs.extendJSON(this.destinationPath('package.json'), {scripts});
  }
  
  addPackageEntries() {
    this.log('Create source files');
    const scripts = {
      build: "tsc",
      dev: "tsc -w",
      lint: 'eslint src/.',
      'lint:fix': 'eslint --fix src/.',
      'prepublish': 'yarn lint',
      'preversion': 'yarn lint'
    }
    this.fs.extendJSON(this.destinationPath('package.json'), {main: './dist/index.js', types: './dist/index.d.ts'});
  }
};
