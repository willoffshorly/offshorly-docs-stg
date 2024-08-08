import { execSync } from 'child_process';


async function getDeletedFiles(){
  try {
    // compare the current HEAD with the last commit on the main branch before the push
    const diffOutput = execSync(
      'git diff --name-status origin/main...HEAD',
    ).toString();
    const deletedFiles = diffOutput
      .split('\n')
      .filter((line) => line.startsWith('D'))
      .map((line) => line.split('\t')[1])
      .filter((filePath) => filePath.length > 0);
    return { deleted: deletedFiles };
  } catch (error) {
    console.error('Error getting deleted files:', error);
    return { deleted: [] };
  }
}

async function sendDeletedFiles(deletedFiles: any) {
  const endpoint = 'http://your-express-endpoint/delete-files';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deletedFiles),
    });
    const data = await response.json();
    console.log('Response from server:', data);
  } catch (error) {
    console.error('Error sending deleted files:', error);
  }
}

async function run() {
  const deletedFiles = await getDeletedFiles();
  if (deletedFiles.deleted.length > 0) {
    await sendDeletedFiles(deletedFiles);
  } else {
    console.log('No deleted files found.');
  }
}

// run(); // Start the process

// For debugging purposes, you can call getDeletedFiles separately and log the result
getDeletedFiles().then(deletesFile => console.log(deletesFile));
