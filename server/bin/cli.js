#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('Generating project...');

// Get the project name from the command line arguments
const projectName = process.argv[2];

// Clone the project template from GitHub
console.log('Cloning project template...');
const cloneCommand = `git clone https://github.com/Jibrilkala/create-mongo-express ${projectName}`;
try {
  execSync(cloneCommand);
  console.log('Project template cloned successfully.');
} catch (error) {
  console.error('Failed to clone project template:', error);
  process.exit(1);
}

// Change to the project directory
process.chdir(projectName);

// Install dependencies
console.log('Installing dependencies...');

// Fake loading animation for installing dependencies
const loadingInterval = setInterval(() => {
  process.stdout.write('.');
}, 300);

try {
  const npmInstall = spawnSync('npm', ['install']);
  if (npmInstall.status === 0) {
    clearInterval(loadingInterval);
    console.log('\nDependencies installed successfully.');

    // Update the package.json with the project name
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    packageJson.name = projectName;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  } else {
    clearInterval(loadingInterval);
    console.error('Failed to install dependencies:', npmInstall.error);
    process.exit(1);
  }
} catch (error) {
  clearInterval(loadingInterval);
  console.error('Failed to install dependencies:', error);
  process.exit(1);
}

// Ask for the MongoDB URI
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Generating project structure...');

// Fake loading animation for generating project structure
setTimeout(() => {
  console.log('Creating files and folders...');
}, 1000);

setTimeout(() => {
  console.log('Setting up configuration...');
}, 2000);

setTimeout(() => {
  rl.question('Enter the MongoDB URI: ', (mongoURI) => {
    rl.close();

    // Update the .env file with the MongoDB URI
    const envPath = path.join(process.cwd(), '.env');
    fs.appendFileSync(envPath, `\nDATABASE_URI=${mongoURI}`);

    console.log('Project generated successfully.');
    console.log(`cd to ${projectName}`);
    console.log(`npm run dev`);
  });
}, 3000);
