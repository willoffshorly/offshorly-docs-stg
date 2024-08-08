import { execSync } from 'child_process';

async function getDeletedFiles(){
  try {
    // compare the current HEAD with the last commit on the main branch before the push
    const deletedFiles = execSync(
      'git diff --name-status origin/main...HEAD | grep "^D" | awk \'{print $2}\'',
    )
      .toString()
      .split('\n')
      .filter((filePath) => filePath.length > 0);
    return deletedFiles;
  } catch (error) {
    console.error('Error getting deleted files:', error);
    return [];
  }
}

async function sendDeletedFiles(deletedFiles: string[]){
  const endpoint = 'http://your-express-endpoint/delete-files';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deletedFiles }),
    });
    const data = await response.json();
    console.log('Response from server:', data);
  } catch (error) {
    console.error('Error sending deleted files:', error);
  }
}

async function run(){
  const deletedFiles = await getDeletedFiles();
  if (deletedFiles.length > 0) {
    await sendDeletedFiles(deletedFiles);
  } else {
    console.log('No deleted files found.');
  }
}

const deletedFilesOfDev = await getDeletedFiles();
console.log(deletedFilesOfDev);

