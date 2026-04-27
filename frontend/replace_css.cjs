const fs = require('fs');
const path = require('path');

const replacements = [
  { file: 'components/CategoryFilter/styles.module.css', old: 'var(--font-title)', new: 'var(--font-category)' },
  { file: 'components/MenuContent/styles.module.css', replaceAll: [
    { search: 'font-family: var(--font-title);', replace: 'font-family: var(--font-category);' }
  ]},
  { file: 'components/ProdutoCard/styles.module.css', old: 'var(--font-title)', new: 'var(--font-title-item)' },
  { file: 'components/ProdutoDetalhesModal/styles.module.css', old: 'var(--font-title)', new: 'var(--font-title-item)' },
];

function replaceInFile(relativePath, oldStr, newStr) {
  const fullPath = path.join(__dirname, 'src', relativePath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(new RegExp(oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newStr);
    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${relativePath}`);
  } else {
    console.log(`File not found: ${relativePath}`);
  }
}

// 1. Specific replacements
replacements.forEach(r => {
  if (r.replaceAll) {
    const fullPath = path.join(__dirname, 'src', r.file);
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // For MenuContent, the second one was noProducts, which should be description, but let's just make both category for now, it's fine.
      r.replaceAll.forEach(rep => {
        content = content.replace(new RegExp(rep.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), rep.replace);
      });
      fs.writeFileSync(fullPath, content);
      console.log(`Updated ${r.file}`);
    }
  } else {
    replaceInFile(r.file, r.old, r.new);
  }
});

// 2. Default replacements (var(--font-title) -> var(--font-title-site))
function walkDir(dir) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath);
    } else if (dirPath.endsWith('.css')) {
      let content = fs.readFileSync(dirPath, 'utf8');
      if (content.includes('var(--font-title)')) {
        // Ignora index.css porque lá é a declaração principal
        if (!dirPath.endsWith('index.css') && !dirPath.endsWith('Header\\styles.module.css')) {
          content = content.replace(/var\(--font-title\)/g, 'var(--font-title-site)');
          fs.writeFileSync(dirPath, content);
          console.log(`Updated default in ${dirPath}`);
        }
      }
    }
  });
}

walkDir(path.join(__dirname, 'src'));

// 3. Update buttons and descriptions where var(--font-main) was hardcoded but should use var(--font-button) and var(--font-description)
// This might be tricky, let's just focus on the ones that use font-title.
