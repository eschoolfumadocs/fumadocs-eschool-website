import fs from 'fs';
import path from 'path';

const contentDir = 'd:/UBIG/Project/05. eSchool-docs/content';

function findAllFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      findAllFiles(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

const allFiles = findAllFiles(contentDir);
const mdxFiles = allFiles.filter(f => f.endsWith('.mdx'));
const jsonFiles = allFiles.filter(f => f.endsWith('meta.json'));

const issues = [];

for (const file of mdxFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const iconMatch = content.match(/icon:\s*(.*)/);
  if (!iconMatch) {
    issues.push({ file, issue: 'Missing icon field' });
  } else {
    const icon = iconMatch[1].trim();
    if (!icon || icon === '' || icon === '""' || icon === "''") {
      issues.push({ file, issue: 'Empty icon field' });
    } else if (icon[0] !== icon[0].toUpperCase()) {
      issues.push({ file, issue: `Icon not PascalCase: ${icon}` });
    }
  }
}

for (const file of jsonFiles) {
  try {
    const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
    if (!content.icon) {
      issues.push({ file, issue: 'Missing icon in meta.json' });
    } else if (content.icon[0] !== content.icon[0].toUpperCase()) {
      issues.push({ file, issue: `Icon not PascalCase in meta.json: ${content.icon}` });
    }
  } catch (e) {
    issues.push({ file, issue: 'Invalid JSON' });
  }
}

if (issues.length === 0) {
  console.log('Success: All files have PascalCase icons!');
} else {
  console.log(`Found ${issues.length} issues:`);
  issues.forEach(i => console.log(`${path.relative(contentDir, i.file)}: ${i.issue}`));
}
