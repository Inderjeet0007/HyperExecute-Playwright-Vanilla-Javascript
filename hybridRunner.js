const { execSync } = require('child_process');

// Grab arguments passed from the YAML
const rawBrowser = process.argv[2];
const version = process.argv[3];
const testFile = process.argv[4];

// Map friendly names to actual config names
let actualBrowser = rawBrowser;

if (rawBrowser === 'safari') {
  actualBrowser = 'webkit';
} else if (rawBrowser === 'edge') {
  actualBrowser = 'MicrosoftEdge';
}

// Apply the 'pw-' prefix logic based on the mapped browser name
const needsPrefix = ['firefox', 'webkit', 'chromium'].includes(actualBrowser);
const prefix = needsPrefix ? 'pw-' : '';

// Construct the final project name
const projectName = `${prefix}${actualBrowser}:${version}@lambdatest`;

console.log(`\n Matrix Input: [${actualBrowser}][${version}] -> Routing to Project: [${projectName}]\n`);

// Execute the Playwright command
try {
  const cmd = `npx playwright test "${testFile}" --config=playwright.config.js --project="${projectName}"`;
  console.log(`> Executing: ${cmd}\n`);
  
  execSync(cmd, { stdio: 'inherit' });
} catch (error) {
  // Ensure the script fails if the test fails, so HyperExecute fails the job
  process.exit(1); 
}