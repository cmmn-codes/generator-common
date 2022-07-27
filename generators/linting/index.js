var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option('react');
    this.option('jest', {default: false});
    this.option('typescript', {default: true});
    this.option('prettier', {default: true});
  }
  
  addDependenciesToPackage() {
    this.log('Adding linting dev dependencies')
    const packages = ['eslint'];
    if (this.options.prettier) {
      this.log('  - including prettier')
      packages.push('prettier', 'eslint-config-prettier', 'eslint-plugin-prettier');
    }
    if (this.options.typescript) {
      this.log('  - including typescript')
      packages.push('@typescript-eslint/eslint-plugin', '@typescript-eslint/parser');
    }
    if (this.options.jest) {
      this.log('  - including jest')
      packages.push('eslint-plugin-jest');
    }
    if (this.options.react) {
      this.log('  - including react')
      packages.push('eslint-plugin-react')
    }
    return this.addDevDependencies(packages);
  }
  
  writingEslintConfig() {
    this.log('Generating .eslintrc.json')
    const plugins = ["@typescript-eslint",
      "react",
      "prettier"]
    const extensions = [
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "plugin:react/recommended",
      "prettier"
    ]
    this.fs.copyTpl(
      this.templatePath('eslint.json.ejs'),
      this.destinationPath('.eslintrc.json'),
      {plugins, extensions}
    );
  }
  
  writingPrettierConfig() {
    if (!this.options.prettier) return
    this.log('Generating .prettierrc.json')
    const config = {
      "semi": true,
      "singleQuote": true
    }
    
    this.fs.extendJSON(this.destinationPath('.prettierrc.json'), config)
  }
};
