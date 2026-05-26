const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', 'utf8');

// Fix const to let for efficiency variables
content = content.replace(/const efficiency =/g, 'let efficiency =');
content = content.replace(/const effPercent =/g, 'let effPercent =');
content = content.replace(/const overallEfficiency =/g, 'let overallEfficiency =');
content = content.replace(/const correctedEfficiency =/g, 'let correctedEfficiency =');

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', content, 'utf8');
console.log("FIXED CONST TO LET");
