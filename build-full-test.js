import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

// Resolve the directory name in ES modules

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Utility to copy files and folders recursively (fs-extra handles this)

async function copyFolder(src, dest) {
  try {
    await fs.copy(src, dest, { overwrite: true })
  } catch (err) {
    console.error(`Error copying folder: ${err.message}`)
    throw err
  }
}

// Utility to replace text in all files in a folder recursively

async function replaceTextInFiles(folder, searchText, replaceText) {
  const entries = await fs.readdir(folder, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(folder, entry.name)

    if (entry.isDirectory()) {
      // Recurse into subdirectories
      await replaceTextInFiles(fullPath, searchText, replaceText)
    } else {
      // Read file, replace text, and write back
      const content = await fs.readFile(fullPath, 'utf8')
      const updatedContent = content.replace(new RegExp(searchText, 'g'), replaceText)
      await fs.writeFile(fullPath, updatedContent, 'utf8')
    }
  }
}

;(async () => {
  const srcFolder = path.join(__dirname, 'dist')
  const destFolder = path.join(__dirname, 'build-full-test')
  const searchText = '/applications/apps/client_use/marketing_plans/'
  const replaceText = '/'

  try {
    // Step 1: Create the "build-full-test" folder and ensure it exists

    await fs.ensureDir(destFolder)

    // Step 2: Copy files and folders from "dist" to "build-full-test"

    console.log(`Copying files from "${srcFolder}" to "${destFolder}"...`)
    await copyFolder(srcFolder, destFolder)

    // Step 3: Replace text in all files in the "build-full-test" folder

    console.log(`Replacing "${searchText}" with "${replaceText}" in all files...`)
    await replaceTextInFiles(destFolder, searchText, replaceText)

    // Step 4: Delete the "dist" folder

    console.log(`Deleting the source folder "${srcFolder}"...`)
    await fs.remove(srcFolder)

    console.log('Operation completed successfully.')
  } catch (error) {
    console.error('An error occurred:', error)
  }
})()
