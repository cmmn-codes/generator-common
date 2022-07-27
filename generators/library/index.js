var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    
    // Next, add your custom code
  }
  
  initializing() {
    this.composeWith([require.resolve('../app'), require.resolve('../gitignore'), require.resolve('../linting'), require.resolve('../ts')]);
  }
};
