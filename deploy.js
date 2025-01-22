import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import FtpDeploy from 'ftp-deploy'

const ftpDeploy = new FtpDeploy()

// Load environment variables from .env file

dotenv.config()

// Simulate __dirname in ES module scope

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define paths

const distDir = path.join(__dirname, 'dist')
const envFilePath = path.join(distDir, '.env')

// FTP configuration

const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  host: process.env.FTP_HOST,
  port: 21,
  localRoot: distDir,
  remoteRoot: process.env.FTP_REMOTE_ROOT,
  include: ['*', '**/*', '**/.env', '**/.htaccess'],
  deleteRemote: true,
  forcePasv: true,
}

// Function to update .env file content for production

async function updateEnvFileEnvironment(mode) {
  try {
    // Step 1: Read the .env file content

    const envContent = await fs.readFile(envFilePath, 'utf8')

    // Step 2: Modify the ENVIRONMENT variable based upon parameter

    const updateEnvToProduction = envContent.replace(
      /VITE_ENVIRONMENT\s*=\s*development/g,
      'VITE_ENVIRONMENT = production',
    )

    const updateEnvToDevelopment = envContent.replace(
      /VITE_ENVIRONMENT\s*=\s*production/g,
      'VITE_ENVIRONMENT = development',
    )

    // Step 3: Write the updated content back to the dist folder

    const distEnvFilePath = path.join(distDir, '.env')
    await fs.writeFile(
      distEnvFilePath,
      mode === 'production' ? updateEnvToProduction : updateEnvToDevelopment,
      'utf8',
    )

    console.log(
      `Modified .env file for ${mode === `production` ? `production for deployment` : `development for dist folder after deployment`}.`,
    )
  } catch (err) {
    console.error('Error updating .env file:', err)
  }
}

// Function to replace text in all HTML and CSS files in the specified directory

async function replaceTextInFiles(directory) {
  try {
    console.log('Directory being processed:', directory);

    if (!directory || typeof directory !== 'string') {
      throw new Error('Invalid directory path provided.');
    }

    const files = await fs.readdir(directory);

    // Loop through each file in the specified directory
    for (const file of files) {
      const filePath = path.join(directory, file);

      // Check if the file is a directory
      const stat = await fs.stat(filePath);

      // If it's a directory, skip it or handle files inside it without recursion
      if (stat.isDirectory()) {
        continue; // Skip subdirectories to avoid infinite loop
      } else if (file.endsWith('.html') || file.endsWith('.css')) {
        // If it's an HTML or CSS file, replace the text inside it
        console.log(`Processing ${filePath}...`);
        let content = await fs.readFile(filePath, 'utf8');

        // Get routingUrl and baseUrl from environment variables
        const routingUrl = process.env.VITE_PRODUCTION_ROUTE_URL;
        const baseUrl = process.env.VITE_PRODUCTION_BASE_URL;

        if (routingUrl && baseUrl) {
          // Replace all instances of routingUrl with baseUrl
          content = content.replace(new RegExp(routingUrl, 'g'), baseUrl);

          // Write the updated content back to the file
          await fs.writeFile(filePath, content, 'utf8');
          console.log(`Replaced "${routingUrl}" with "${baseUrl}" in ${filePath}.`);
        } else {
          console.log('routingUrl or baseUrl is not set in the environment variables.');
        }
      }
    }
  } catch (err) {
    console.error('Error replacing text in files:', err);
  }
}

// Function to replace text in the app.html file

async function replaceTextInAppHtml() {
  try {
    const appHtmlPath = path.join(distDir, 'app.html');
    const appHtmlContent = await fs.readFile(appHtmlPath, 'utf8');

    const routingUrl = process.env.VITE_PRODUCTION_ROUTE_URL;
    const baseUrl = process.env.VITE_PRODUCTION_BASE_URL;

    if (routingUrl && baseUrl) {
      // Replace all instances of routingUrl with baseUrl in app.html
      const updatedContent = appHtmlContent.replace(new RegExp(routingUrl, 'g'), baseUrl);

      // Write the updated content back to the app.html file
      await fs.writeFile(appHtmlPath, updatedContent, 'utf8');
      console.log('Replaced routing URL in app.html.');
    } else {
      console.log('routingUrl or baseUrl is not set in the environment variables.');
    }
  } catch (err) {
    console.error('Error replacing text in app.html:', err);
  }
}

;(async () => {
  try {

    // Update .env file for production and copy it to the `dist` root

    console.log('Updating .env file to production...')
    await updateEnvFileEnvironment('production')

    // Replace text in the app.html file

    console.log('Replacing text in app.html...')
    await replaceTextInAppHtml()

    // Replace text in all HTML and CSS files in the /dist/assets folder

    console.log('Replacing text in HTML and CSS files in assets...')
    const assetsDir = path.join(distDir, 'assets'); // Path to assets directory
    await replaceTextInFiles(assetsDir)

    // Deploy files to FTP

    console.log('Deploying files...')
    await ftpDeploy.deploy(config)
    console.log('Deployment finished successfully.')

    // Change .env in dist folder back to development after deployment

    updateEnvFileEnvironment('development')
  } catch (err) {
    console.error('Deployment failed: ', err)
  }
})()
