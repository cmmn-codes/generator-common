var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts, features) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts, features);
  }

  initializing() {
    this.composeWith(require.resolve('../linting'), {
      arguments: {
        react: true,
      },
    });
  }

  addDependenciesToPackage() {
    this.log('Adding express dependencies');
    const packages = ['react', 'react-dom'];
    return this.addDependencies(packages);
  }

  addDevDependenciesToPackage() {
    this.log('Adding express dev dependencies');
    const packages = [
      'parcel',
      '@parcel/transformer-typescript-tsc',
      '@types/react',
      '@types/react-dom',
    ];
    return this.addDevDependencies(packages);
  }

  writingPackageSettings() {
    const packageSettings = {
      source: 'src/index.html',
      browserslist: '> 0.5%, last 2 versions, not dead',
    };
    this.fs.extendJSON(this.destinationPath('./package.json'), packageSettings);
  }

  writingPackageScripts() {
    const scripts = {
      dev: 'parcel',
      build: 'parcel build',
      lint: 'eslint src/.',
      'lint:fix': 'eslint --fix src/.',
    };
    this.fs.extendJSON(this.destinationPath('./package.json'), { scripts });
  }

  writingFiles() {
    this.fs.copyTpl(
      this.templatePath('index.tsx'),
      this.destinationPath('./src/index.tsx')
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('./src/index.html'),
      { title: 'Common Parcel' }
    );
  }
};
