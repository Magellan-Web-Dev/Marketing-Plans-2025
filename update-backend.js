import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy index.php, .htaccess, .env, and includes folder from dist and overwrite corresponding files/folders in backend folder

const filesToCopy = ['build-full-test/index.php', 'build-full-test/.htaccess', 'build-full-test/includes'];
const destination = path.join(__dirname, 'backend');

(async () => {
  try {
    for (const file of filesToCopy) {
        const src = path.join(__dirname, file);
        const dest = path.join(destination, path.basename(file));

        console.log(`Copying ${src} to ${dest}`);
        await fs.copy(src, dest, { overwrite: true });
    }
    console.log('All files copied successfully!');
  } catch (error) {
      console.error('Error while copying files:', error);
  }
})();
