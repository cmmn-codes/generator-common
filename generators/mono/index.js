var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  initializing() {
    this.composeWith(require.resolve('../app'), { private: true });
    this.composeWith([require.resolve('../app')], {
      destinationRoot: this.destinationRoot('server/'),
      args: { packageName: 'server', private: true },
    });
    this.composeWith([require.resolve('../app')], {
      destinationRoot: this.destinationRoot('client/'),
      arguments: { packageName: 'client', private: true },
    });
    this.composeWith([require.resolve('../library')], {
      destinationRoot: this.destinationRoot('common/'),
      arguments: { packageName: 'common', private: true },
    });
  }

  addPackageEntries() {
    this.log('Create source files');
    const workspaces = ['client', 'server', 'common'];
    this.fs.extendJSON(this.destinationPath('package.json'), { workspaces });
  }
};
