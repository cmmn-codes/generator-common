var Generator = require('yeoman-generator');

const defaultConfig = {
  compilerOptions: {
    target: 'es2016',
    moduleResolution: 'node',
    module: 'commonjs',
    rootDir: '.',
    baseUrl: './',
    esModuleInterop: true,
    forceConsistentCasingInFileNames: true,
    strict: true,
    skipLibCheck: true,
  },
  exclude: ['node_modules/**'],
};

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option('composite');
    this.option('jsx');
    this.argument('outDir', { type: 'string', default: './dist/' });
    this.argument('rootDir', { type: 'string', default: './src/' });
  }

  async prompting() {
    if (!this.options.jsx) return;
    const answers = await this.prompt([
      {
        type: 'input',
        name: 'jsx',
        message: 'Type of JSX to generate',
        default: 'react',
      },
    ]);
    this.answers = answers;
  }

  addTsPackage() {
    this.log('Adding typescript dependency');
    const packages = ['typescript'];
    return this.addDevDependencies(packages);
  }

  writingConfig() {
    this.log('Generating typescript config file.');
    const config = defaultConfig;
    config.compilerOptions.rootDir = this.options.rootDir;
    config.compilerOptions.outDir = this.options.outDir;
    config.includes = [this.options.rootDir];
    if (this.options.composite) {
      this.log('  - including composite settings');
      config.compilerOptions.composite = true;
      config.compilerOptions.declarations = true;
      config.compilerOptions.declarationMap = true;
      config.compilerOptions.baseUrl = './';
    }
    if (this.options.jsx) {
      this.log('  - including jsx settings');
      config.compilerOptions.jsx = this.answers.jsx;
    }
    this.writeDestinationJSON('tsconfig.json', config);
  }
};
