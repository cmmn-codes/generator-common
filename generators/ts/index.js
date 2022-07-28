var Generator = require('yeoman-generator');

const moduleSettings = {
  cjs: {
    module: 'commonjs',
    moduleResolution: 'node',
  },
  esm: {
    module: 'nodenext',
    moduleResolution: 'node16',
  },
};

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option('composite');
    this.argument('filePostfix', {
      type: 'string',
      required: false,
    });
    this.argument('extends', {
      type: 'string',
      required: false,
    });
    this.argument('module', { type: 'string', default: 'commonjs' });
    this.argument('target', { type: 'string', default: 'es2016' });
    this.argument('jsx', { type: 'string', required: false });
    this.argument('outDir', { type: 'string', default: './dist/' });
    this.argument('rootDir', { type: 'string', default: './src/' });
  }

  initializing() {
    const moduleTypes = Object.keys(moduleSettings);
    if (!moduleTypes.includes(this.options.module)) {
      throw new Error(
        `Expect module type to be one of: ${moduleTypes.join(', ')}`
      );
    }
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

  _getTsConfigSettings() {
    const moduleConfg = moduleSettings[this.options.module];
    return {
      includes: [this.options.rootDir],
      excludes: ['node_modules/**'],
      jsx: this.answers?.jsx ?? undefined,
      baseUrl: '.',
      rootDir: this.options.rootDir,
      outDir: this.options.outDir,
      declarations: true,
      composite: !!this.options.composite,
      declarationMap: !!this.options.composite,
      extending: this.options.extends || false,
      target: 'es2016',
      ...moduleConfg,
    };
  }

  writingConfig() {
    const postfix = this.options.filePostfix;
    const filename = `tsconfig${postfix ? '.' + postfix : ''}.json`;
    this.log('Generating typescript config file.');
    this.fs.copyTpl(
      this.templatePath('tsconfig.ejs'),
      this.destinationPath(filename),
      this._getTsConfigSettings()
    );
  }
};
