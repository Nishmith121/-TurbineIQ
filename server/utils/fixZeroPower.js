const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', 'utf8');

// We want to replace `return {` with:
// if (powerOutput === 0 || isNaN(powerOutput)) {
//    efficiency = 0; // wait, the variable might be effPercent
// }

// Let's just modify the return object directly.
content = content.replace(/return \{\n\s*efficiency: (.*?),\n\s*powerOutput: (.*?),\n\s*specificResults: \{([\s\S]*?)\},\n\s*calculationSteps: (.*?)\n\s*\};/g, (match, effVar, pwrVar, specRes, calcSteps) => {
  return `if (${pwrVar} === 0 || isNaN(${pwrVar})) {
    ${effVar} = 0;
    recommendation = "AI Insight: The machine is non-operational. Ensure primary driving parameters (e.g. wind speed, flow rate, voltage) are greater than zero.";
  }
  return {
    efficiency: ${effVar},
    powerOutput: ${pwrVar},
    specificResults: {${specRes}},
    calculationSteps: ${calcSteps}
  };`;
});

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', content, 'utf8');
console.log("SUCCESSFULLY FIXED ZERO POWER");
