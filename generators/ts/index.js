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
  constructor(args, opts, features) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts, features);
    this.option('composite');
    this.option('noEmit');
    this.argument('filePostfix', {
      type: 'string',
      required: false,
    });
    this.argument('extends', {
      type: 'string',
      required: false,
    });
    this.argument('module', { type: 'string', required: false });
    this.argument('target', { type: 'string', required: false });
    this.argument('jsx', { type: 'string', required: false });
    this.argument('outDir', { type: 'string', required: false });
    this.argument('rootDir', { type: 'string', required: false });
    this.argument('references', { type: 'array', required: false });
  }

  initializing() {
    const moduleTypes = Object.keys(moduleSettings);
    if (this.options.module && !moduleTypes.includes(this.options.module)) {
      throw new Error(
        `Expect module type to be one of: ${moduleTypes.join(', ')}`
      );
    }
  }

  addTsPackage() {
    this.log('Adding typescript dependency');
    const packages = ['typescript'];
    return this.addDevDependencies(packages);
  }

  _getTsConfigSettings() {
    let {
      extending,
      noEmit,
      target,
      jsx,
      composite,
      outDir = './dist',
      rootDir = './src',
      module,
      references,
    } = this.options;
    let compilerOptions = {};
    if (!extending) {
      noEmit = !!noEmit;
      module = module || 'cjs';
      target = target || 'es2016';
      compilerOptions = {
        declaration: true,
        esModuleInterop: true,
        forceConsistentCasingInFileNames: true,
        strict: true,
        skipLibCheck: true,
        sourceMap: true,
        baseUrl: '.',
      };
    }
    const tsConfig = {
      compilerOptions,
    };
    if (target) {
      compilerOptions.target = target;
    }
    if (module) {
      const moduleConfig = moduleSettings[module];
      compilerOptions.moduleResolution = moduleConfig.moduleResolution;
      compilerOptions.module = moduleConfig.module;
    }
    if (extending) {
      tsConfig.extends = extending;
    }
    tsConfig.exclude = ['node_modules/**'];
    if (noEmit !== undefined) {
      compilerOptions.noEmit = noEmit;
    }
    if (composite) {
      compilerOptions.declaration = true;
      compilerOptions.composite = true;
      compilerOptions.declarationMap = true;
      if (references) {
        tsConfig.references = references.map((path) => ({
          path,
        }));
      }
    }

    if (rootDir) {
      tsConfig.include = [rootDir];
      compilerOptions.rootDir = rootDir;
      compilerOptions.baseUrl = rootDir;
    }
    if (outDir) {
      compilerOptions.outDir = outDir;
    }
    if (jsx) {
      compilerOptions.jsx = jsx;
    }

    return tsConfig;
  }

  writingConfig() {
    const postfix = this.options.filePostfix;
    const filename = `tsconfig${postfix ? '.' + postfix : ''}.json`;
    this.log('Generating typescript config file.');
    this.fs.writeJSON(
      this.destinationPath(filename),
      this._getTsConfigSettings()
    );
  }
};
