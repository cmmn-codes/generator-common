var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  initializing() {
    this.composeWith([require.resolve('../app')], {
      arguments: { module: true },
    });
    this.composeWith([
      require.resolve('../gitignore'),
      require.resolve('../linting'),
    ]);

    this.composeWith([require.resolve('../ts')], {
      arguments: {
        filePostfix: 'base',
        module: 'cjs',
        outDir: './dist/',
        rootDir: './src/',
      },
    });
    // TODO: have ts generator remove inherited values unless explicitly set
    this.composeWith([require.resolve('../ts')], {
      arguments: {
        filePostfix: 'build.esm',
        module: 'esm',
        outDir: './dist/esm/',
        rootDir: './src/',
        extends: './tsconfig.base.json',
      },
    });
    this.composeWith([require.resolve('../ts')], {
      arguments: {
        filePostfix: 'build.cjs',
        module: 'cjs',
        outDir: './dist/cjs/',
        rootDir: './src/',
        extends: './tsconfig.base.json',
      },
    });
    this.composeWith([require.resolve('../ts')], {
      arguments: {
        module: 'cjs',
        outDir: './dist/',
        rootDir: './src/',
        noEmit: true,
      },
    });
  }

  addBuildDependencies() {
    this.addDevDependencies(['rimraf']);
  }

  addPackageScripts() {
    this.log('Create source files');
    const scripts = {
      build:
        'rimraf ./dist && tsc -p tsconfig.build.cjs.json && tsc -p tsconfig.build.esm.json && node scripts/post-build.js',
      dev: 'tsc -p tsconfig.build.esm.json -w',
      lint: 'eslint src/.',
      'lint:fix': 'eslint --fix src/.',
      prepublishOnly: 'yarn lint && yarn test && yarn build',
      preversion: 'yarn lint && yarn test && yarn build',
    };
    this.fs.extendJSON(this.destinationPath('package.json'), { scripts });
  }

  addPackageEntries() {
    this.log('Create source files');
    this.fs.extendJSON(this.destinationPath('package.json'), {
      main: 'dist/cjs/index.js',
      module: 'dist/esm/index.js',
      types: 'dist/esm/index.d.ts',
    });
  }

  writeHelloWorldSourceFile() {
    this.log('Create source files');
    this.fs.copyTpl(
      this.templatePath('index.ts'),
      this.destinationPath('./src/index.ts')
    );
  }

  writePostBuildScriptFile() {
    this.log('Create source files');
    this.fs.copyTpl(
      this.templatePath('post-build.js'),
      this.destinationPath('./scripts/post-build.js')
    );
  }
};
