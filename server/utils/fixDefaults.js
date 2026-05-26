const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', 'utf8');

// Insert parseParam helper at the top
if (!content.includes('function parseParam')) {
  content = `
function parseParam(val, def) {
  if (val === undefined || val === null) return def;
  if (val === '') return 0;
  const num = Number(val);
  return isNaN(num) ? def : num;
}
` + content;
}

// Replace || defaults with parseParam
content = content.replace(/const (\w+) = params\.(\w+) \|\| ([\d\.]+);/g, 'const $1 = parseParam(params.$2, $3);');

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', content, 'utf8');
console.log("SUCCESSFULLY FIXED DEFAULTS");
