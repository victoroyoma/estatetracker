#!/usr/bin/env node

console.log('🚀 EstateTracker Enhanced Setup Script');
console.log('=====================================\n');

const fs = require('fs');
const path = require('path');

// Check if running in EstateTracker directory
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: package.json not found. Please run this script from the EstateTracker root directory.');
  process.exit(1);
}

// Read package.json to verify it's EstateTracker
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
console.log(`📦 Project: ${packageJson.name}`);
console.log(`📋 Version: ${packageJson.version}\n`);

// Installation steps
const steps = [
  {
    name: 'Installing Dependencies',
    command: 'npm install',
    description: 'Installing all required packages including testing and development dependencies'
  },
  {
    name: 'Running Tests',
    command: 'npm test',
    description: 'Running test suite to verify all components work correctly'
  },
  {
    name: 'Building Project',
    command: 'npm run build',
    description: 'Creating production build to verify everything compiles'
  }
];

async function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  
  const { spawn } = require('child_process');
  const [cmd, ...args] = command.split(' ');
  
  return new Promise((resolve, reject) => {
    const process = spawn(cmd, args, { 
      stdio: 'inherit',
      shell: true 
    });
    
    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} completed successfully\n`);
        resolve();
      } else {
        console.log(`❌ ${description} failed with code ${code}\n`);
        reject(new Error(`Command failed: ${command}`));
      }
    });
  });
}

async function setupProject() {
  try {
    console.log('🏗️  Starting EstateTracker Enhanced Setup...\n');
    
    for (const step of steps) {
      await runCommand(step.command, step.description);
    }
    
    console.log('🎉 Setup completed successfully!');
    console.log('\n📋 Next Steps:');
    console.log('1. Start development server: npm run dev');
    console.log('2. Run tests in watch mode: npm run test:watch');
    console.log('3. Check test coverage: npm run test:coverage');
    console.log('4. Build for production: npm run build');
    console.log('\n🔗 Useful Commands:');
    console.log('- npm run dev        # Start development server');
    console.log('- npm run test       # Run tests');
    console.log('- npm run lint       # Check code quality');
    console.log('- npm run preview    # Preview production build');
    console.log('\n📚 Documentation:');
    console.log('- README.md          # Project overview');
    console.log('- IMPROVEMENTS.md    # Enhancement details');
    console.log('\n🌟 EstateTracker is now ready for development!');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Ensure Node.js 18+ is installed');
    console.log('2. Clear npm cache: npm cache clean --force');
    console.log('3. Delete node_modules and package-lock.json, then retry');
    console.log('4. Check network connection for dependency downloads');
    process.exit(1);
  }
}

// Run setup
setupProject();
