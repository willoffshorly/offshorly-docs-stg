import fs from 'fs/promises';
import getMdPaths from './getMdPaths.js'
import { exec } from 'child_process';
import path from 'path';

async function getAuthor(filePath : any) {
  const normalizedFilePath = path.normalize(filePath).replace(/\\/g, '/');
  // console.log(`Normalized file path: ${normalizedFilePath}`);
  
  return new Promise((resolve, reject) => {
      const command = `git log -1 --pretty=format:%ae -- "${normalizedFilePath}"`;
      // console.log(`Executing command: ${command}`);
      
      exec(command, async (error, stdout, stderr) => {
          if (error || !stdout.trim()) {
              console.error(`Error or no commit found: ${stderr || 'No previous commits'}`);
              
              // Fallback to git configuration email if no commit found
              const fallbackCommand = `git config user.email`;
              exec(fallbackCommand, (fallbackError, fallbackStdout, fallbackStderr) => {
                  if (fallbackError) {
                      console.error(`Error executing fallback command: ${fallbackStderr}`);
                      reject(fallbackStderr);
                  } else {
                      const fallbackEmail = fallbackStdout.trim();
                      // console.log(`Fallback email: ${fallbackEmail}`);
                      resolve(fallbackEmail);
                  }
              });
          } else {
              const authorEmail = stdout.trim();
              // console.log(`Command output: ${authorEmail}`);
              resolve(authorEmail);
          }
      });
  });
}

async function extractMdContent(filePath : any) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    let title = '';
    let description = '';
    let isReadingDescription = false;
    let emptyLineCount = 0;

    // console.log("--- Start of file processing ---");
    // console.log("Total lines:", lines.length);

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // console.log(`Line ${i + 1}:`, JSON.stringify(trimmedLine));

        if (!title && trimmedLine.startsWith('#')) {
            // Found the title
            title = trimmedLine.replace(/^#+\s*/, '').trim();
            // console.log("Title found:", title);
            isReadingDescription = true;
            continue;
        }

        if (isReadingDescription) {
            if (trimmedLine === '') {
                emptyLineCount++;
                if (emptyLineCount > 1 || description !== '') {
                    // console.log("Second empty line or end of description found");
                    break;
                }
            } else {
                emptyLineCount = 0;
                if (trimmedLine.startsWith('#')) {
                    // console.log("New heading found, ending description capture");
                    break;
                }
                description += (description ? ' ' : '') + trimmedLine;
                // console.log("Current description:", description);
            }
        }
    }

    // console.log("--- End of file processing ---");
    // console.log("Final title:", title);
    // console.log("Final description:", description);

    const author = await getAuthor(filePath);

    // console.log("=================================================================")

    return {
        title: title || null,
        description: description || null,
        author: author || null
    };
}


async function processMarkdownFiles(directory: any) {
  const mdFiles = await getMdPaths(directory, []);
  const filesData = [];

  for (const filePath of mdFiles) {
    console.log(`Processing file: ${filePath}`);
    const { title, description, author } = await extractMdContent(filePath);
    // Replace backslashes with forward slashes
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Determine the source based on the directory
    let source = "INTERNAL"; // Default source
    if (normalizedPath.includes('/ai_generated/')) {
      console.log("AI generated file found");
      source = "AI";
    } else if (normalizedPath.includes('/web_entry/')) {
      console.log("Web entry file found");
      source = "EXTERNAL";
    }

    filesData.push({
      title: title,
      desc: description,
      path: normalizedPath,
      author: author,
      source: source // Set source based on directory
    });
  }

  return filesData;
}

async function main() {
  const directory = "content"; // Replace with your directory path
  const apiKey = process.env.CODEBASE_KB_API_KEY;

  try {
    const filesData = await processMarkdownFiles(directory);
    const output = { files: filesData };
    
    const response = await fetch('https://kb-backend-dev.onrender.com/api/markdown', {   // https://kb-backend-ompt.onrender.com/api/code_snippet render
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // add API key here
      },
      body: JSON.stringify(output)
    });

    if (!response.ok) {
      throw new Error(`Failed to send data: ${response.statusText}`);
    }

    console.log('Data sent successfully.');
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
