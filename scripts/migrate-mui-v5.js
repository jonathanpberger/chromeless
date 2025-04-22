/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const fs = require('fs');
const path = require('path');

// Define the component mapping from MUI v4 to MUI v5
const componentMapping = {
  '@material-ui/core/': '@mui/material/',
  '@material-ui/icons/': '@mui/icons-material/',
  '@material-ui/lab/': '@mui/lab/',
  '@material-ui/core/styles': '@mui/material/styles',
  
  // More specific components if needed
  '@material-ui/core/colors/': '@mui/material/colors/',
};

// Define a recursive function to search and replace in each file
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;
    
    // Replace imports
    Object.keys(componentMapping).forEach(oldImport => {
      const newImport = componentMapping[oldImport];
      const regex = new RegExp(`import\\s+(.+?)\\s+from\\s+['"]${oldImport}(.+?)['"]`, 'g');
      
      newContent = newContent.replace(regex, (match, importNames, componentName) => {
        return `import ${importNames} from '${newImport}${componentName}'`;
      });
    });
    
    // Replace some common className with sx prop
    newContent = newContent.replace(/className={classes\.([a-zA-Z0-9]+)}/g, 'sx={classes.$1}');
    
    // Replace withStyles with styled
    newContent = newContent.replace(/withStyles\(styles\)\(([^)]+)\)/g, 'styled($1)(styles)');
    
    // Save the modified content back to the file if changes were made
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing file ${filePath}:`, error);
    return false;
  }
}

// Function to recursively find all .js files in a directory
function findJsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsFiles(filePath, fileList);
    } else if (file.endsWith('.js')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Find all JavaScript files in the components directory
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const componentFiles = findJsFiles(componentsDir);
let updatedCount = 0;

// Process each file
componentFiles.forEach(file => {
  const updated = processFile(file);
  if (updated) {
    updatedCount++;
  }
});

console.log(`Migration completed. Updated ${updatedCount} out of ${componentFiles.length} files.`);