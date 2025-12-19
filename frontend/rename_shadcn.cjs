const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src/components/ui');
const singleWordRegex = /^[A-Z][a-z0-9]*\.vue$/;

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (singleWordRegex.test(file)) {
      renameComponent(dir, file);
    }
  });
}

function renameComponent(dir, oldFilename) {
  const baseName = path.basename(oldFilename, '.vue');
  const newFilename = `Ui${oldFilename}`;
  const oldPath = path.join(dir, oldFilename);
  const newPath = path.join(dir, newFilename);

  console.log(`Renaming ${oldFilename} -> ${newFilename}`);
  fs.renameSync(oldPath, newPath);

  // Update sibling files (index.js, other .vue files)
  const siblings = fs.readdirSync(dir);
  siblings.forEach(sibling => {
    // Skip directories
    if (fs.statSync(path.join(dir, sibling)).isDirectory()) return;

    const siblingPath = path.join(dir, sibling);
    let content = fs.readFileSync(siblingPath, 'utf8');
    
    // Regex to match imports from the old file
    // Matches: from './Name.vue', from "./Name.vue"
    // Also handling potential lack of extension if configured (though usually .vue is explicit in Vue)
    // And import ... from './Name'
    const importRegex = new RegExp(`from\\s+['"]\\.\\/${baseName}(\\.vue)?['"]`, 'g');
    
    if (importRegex.test(content)) {
      console.log(`  Updating references in ${sibling}`);
      const newContent = content.replace(importRegex, (match) => {
        const quote = match.includes("'") ? "'" : '"';
        const hasExt = match.includes('.vue');
        return `from ${quote}./Ui${baseName}${hasExt ? '.vue' : ''}${quote}`;
      });
      fs.writeFileSync(siblingPath, newContent, 'utf8');
    }
  });
}

console.log('Starting Shadcn component renaming...');
if (fs.existsSync(uiDir)) {
  processDir(uiDir);
} else {
  console.error(`Directory not found: ${uiDir}`);
}
console.log('Done.');
