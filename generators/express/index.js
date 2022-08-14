var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts, features) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts, features);
    this.argument('staticDir', { type: 'string', required: false });
  }

  addDependenciesToPackage() {
    this.log('Adding express dependencies');
    const packages = ['express', 'helmet', 'body-parser', 'dotenv'];
    return this.addDependencies(packages);
  }

  addDevDependenciesToPackage() {
    this.log('Adding express dev dependencies');
    const packages = [
      '@types/node',
      '@types/express',
      'concurrently',
      'nodemon',
    ];
    return this.addDevDependencies(packages);
  }

  writingPackageScripts() {
    const scripts = {
      start: 'node dist/index.js',
      build: 'tsc -b',
      'build:watch': 'tsc -b --watch --preserveWatchOutput',
      dev: 'yarn build && concurrently "yarn build:watch" "nodemon dist/index.js"',
      lint: 'eslint src/.',
      'lint:fix': 'eslint --fix src/.',
    };
    this.fs.extendJSON(this.destinationPath('./package.json'), { scripts });
  }

  writingFiles() {
    this.fs.copyTpl(
      this.templatePath('index.ts.ejs'),
      this.destinationPath('./src/index.ts'),
      { staticDir: this.options.staticDir }
    );
    this.fs.copyTpl(
      this.templatePath('nodemon.config.json'),
      this.destinationPath('./nodemon.json')
    );
  }
};
