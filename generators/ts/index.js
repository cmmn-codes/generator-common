var Generator = require('yeoman-generator');

const defaultConfig = {
  "compilerOptions": {
    "target": "es2016",
    "moduleResolution": "node",
    "module": "commonjs",
    "rootDir": ".",
    "baseUrl": "./",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "exclude": ["node_modules/**"]
}


module.exports = class extends Generator {
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option('composite');
    this.option('jsx');
  }
  
  async prompting() {
    if (!this.options.jsx) return
    const answers = await this.prompt([
      {
        type: "input",
        name: "jsx",
        message: "Type of JSX to generate",
        default: 'react'
      },
    ]);
    this.answers = answers;
  }
  
  addTSPackage() {
    this.log('Adding typescript dependency');
    const packages = ['typescript'];
    return this.addDevDependencies(packages);
  }
  
  writingConfig() {
    this.log('Generating typescript config file.')
    const config = defaultConfig;
    if (this.options.composite) {
      this.log('  - including composite settings')
      config.compilerOptions.composite = true;
      config.compilerOptions.declarations = true;
      config.compilerOptions.declarationMap = true;
    }
    if (this.options.jsx) {
      this.log('  - including jsx settings')
      config.compilerOptions.jsx = this.answers.jsx;
    }
    this.writeDestinationJSON('tsconfig.json', config)
  }
};
