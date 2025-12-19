const fs = require('fs');
const path = require('path');

const uiDir = path.join(__dirname, 'src/components/ui');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDir(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.vue')) {
      fixImports(filePath, dir);
    }
  });
}

function fixImports(filePath, dir) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // Regex to find relative imports/exports
  // Capture group 1: quote (' or ")
  // Capture group 2: path (starting with ./)
  // Capture group 3: quote matches group 1 (not enforced by regex here easily without backreference)
  const importRegex = /(from\s+)(['"])((\.\/)([^'"]+))(['"])/g;
  
  const newContent = content.replace(importRegex, (match, p1, quote1, fullPath, dotSlash, relativePath, quote2) => {
    // p1: "from "
    // quote1: " or '
    // fullPath: "./Button.vue"
    // dotSlash: "./"
    // relativePath: "Button.vue"
    
    // Check if file exists
    const absolutePath = path.resolve(dir, fullPath);
    if (fs.existsSync(absolutePath)) {
      return match; // File exists, no change
    }

    // Check if adding 'Ui' prefix helps
    // relativePath could be "Button.vue" or "Button"
    const dirName = path.dirname(relativePath); // usually "."
    const baseName = path.basename(relativePath);
    
    // Try Ui + baseName
    const newBaseName = `Ui${baseName}`;
    const newRelativePath = dirName === '.' ? newBaseName : path.join(dirName, newBaseName);
    const newFullPath = `${dotSlash}${newRelativePath}`;
    const newAbsolutePath = path.resolve(dir, newFullPath);

    // Also check extensions if missing
    // If original was "Button", and "UiButton.vue" exists.
    if (fs.existsSync(newAbsolutePath)) {
      console.log(`Fixing in ${path.basename(filePath)}: ${fullPath} -> ${newFullPath}`);
      changed = true;
      return `${p1}${quote1}${newFullPath}${quote2}`;
    }
    
    // Try adding .vue if missing
    if (!newAbsolutePath.endsWith('.vue')) {
        const withVue = newAbsolutePath + '.vue';
        if (fs.existsSync(withVue)) {
            const newRelWithVue = newFullPath + '.vue';
            console.log(`Fixing in ${path.basename(filePath)}: ${fullPath} -> ${newRelWithVue}`);
            changed = true;
            return `${p1}${quote1}${newRelWithVue}${quote2}`;
        }
    }

    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, newContent, 'utf8');
  }
}

console.log('Fixing imports...');
if (fs.existsSync(uiDir)) {
  processDir(uiDir);
}
console.log('Done.');
