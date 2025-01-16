import { execSync } from 'child_process'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Load environment variables from .env file

dotenv.config()

// Simulate __dirname in ES module scope

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define paths

const distDir = path.join(__dirname, 'dist')
const backendDir = path.join(__dirname, 'backend')
const envFilePath = path.join(__dirname, '.env')
const plansFilePath = path.join(__dirname, 'marketing-plans-data.json')

;(async () => {
  try {
    // Step 1: Build the Vue.js app

    console.log('Building Vue.js app...')
    execSync('npm run build', { stdio: 'inherit' })

    // Step 2: Rename `index.html` to `app.html`

    console.log(`Copying index.html and renaming to ${process.env.APP_FILE}`)
    const indexHtmlPath = path.join(distDir, 'index.html')
    const appPhpPath = path.join(distDir, process.env.APP_FILE)

    if (fs.existsSync(indexHtmlPath)) {
      fs.renameSync(indexHtmlPath, appPhpPath)
    } else {
      throw new Error('index.html not found. Build process might have failed.')
    }

    // Step 3: Copy PHP files to the `dist` root

    console.log('Copying PHP files...')
    fs.copySync(backendDir, distDir, { overwrite: true })

    // Step 4: Copy .env file to the `dist` root

    console.log('Copying .env file...')
    fs.copySync(envFilePath, path.join(distDir, '.env'), { overwrite: true })

    // Step 5: Copy marketing-plans-data.json to the `dist` root

    console.log('Copying marketing-plans-data.json file...')
    if (fs.existsSync(plansFilePath)) {
      fs.copySync(plansFilePath, path.join(distDir, 'marketing-plans-data.json'), { overwrite: true })
    } else {
      console.warn('marketing-plans-data.json not found. Skipping...')
    }
  } catch (err) {
    console.error('Build full failed: ', err)
  }
})()
