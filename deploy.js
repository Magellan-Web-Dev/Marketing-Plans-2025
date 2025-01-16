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

;(async () => {
  try {
    // Update .env file for production and copy it to the `dist` root

    console.log('Updating .env file to production...')
    await updateEnvFileEnvironment('production')

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
