const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', 'utf8');

// Fix the bad assignments
content = content.replace(/Math\.round\(efficiency \* 100\) \/ 100 = 0;/g, 'efficiency = 0;');
content = content.replace(/Math\.round\(overallEfficiency \* 100 \* 100\) \/ 100 = 0;/g, 'overallEfficiency = 0;');
content = content.replace(/Math\.round\(correctedEfficiency \* 100 \* 100\) \/ 100 = 0;/g, 'correctedEfficiency = 0;');
content = content.replace(/effPercent = 0;/g, 'effPercent = 0;'); // just in case

// We also need to make sure the output reflects the forced 0.
// Actually, if we just do efficiency = 0, then Math.round(efficiency * 100) / 100 will correctly evaluate to 0!

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', content, 'utf8');
console.log("FIXED SYNTAX");
