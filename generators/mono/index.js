var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts, features) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts, features);
  }

  initializing() {
    this._originalRoot = this._destinationRoot;
    this.log('Destination root', this._destinationRoot);
    this.composeWith(require.resolve('../app'), {
      private: true,
    });
    this.composeWith(require.resolve('../linting'));
    this.composeWith(require.resolve('../license'), {
      flavor: 'GNU_GLP',
    });
    this.composeWith(require.resolve('../gitignore'));
    this.composeWith(require.resolve('../ts'), {
      composite: true,
    });
    // create subpackages
    // -- server
    const serverRoot = this.destinationPath('server/');
    this.composeWith([require.resolve('../app')], {
      packageName: 'server',
      private: true,
      destinationRoot: serverRoot,
    });
    this.composeWith([require.resolve('../ts')], {
      destinationRoot: serverRoot,
      extending: '../tsconfig.json',
      composite: true,
      references: ['../common'],
    });
    this.composeWith([require.resolve('../express')], {
      destinationRoot: serverRoot,
      staticDir: '../../client/dist/',
    });

    // -- client
    const clientRoot = this.destinationPath('client/');
    this.composeWith([require.resolve('../app')], {
      destinationRoot: clientRoot,
      packageName: 'client',
      private: true,
    });
    this.composeWith([require.resolve('../ts')], {
      destinationRoot: clientRoot,
      extending: '../tsconfig.json',
      composite: true,
      jsx: 'react',
      references: ['../common'],
    });
    this.composeWith([require.resolve('../parcel')], {
      destinationRoot: clientRoot,
    });

    // -- common files
    const commonRoot = this.destinationPath('common/');
    this.composeWith([require.resolve('../app')], {
      destinationRoot: commonRoot,
      packageName: 'common',
      private: true,
      main: 'dist/index.js',
    });
    this.composeWith([require.resolve('../ts')], {
      destinationRoot: commonRoot,
      extending: '../tsconfig.json',
      composite: true,
    });
  }

  writingCommonIndex() {
    this.log('Create source files');
    this.log('Destination root', this._destinationRoot);
    const workspaces = ['client', 'server', 'common'];
    this.fs.copyTpl(
      this.templatePath('common-index.ts'),
      this.destinationPath('common/src/index.ts')
    );
  }

  writingConfig() {
    this.log('Create source files');
    this.log('Destination root', this._destinationRoot);
    const workspaces = ['client', 'server', 'common'];
    this.fs.extendJSON(this.destinationPath('package.json'), { workspaces });
  }
};
