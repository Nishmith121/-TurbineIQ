const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', 'utf8');

// We are going to replace the AI Recommendation logic in all 8 functions to use an array of possible optimizations,
// calculate their delta (impact), and then sort and pick the highest impact one.

// 1. Wind Turbine
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";[\s\S]*?  return \{/m, `  let opts = [];
  
  if (pitchAngle > 0) {
    const testPitch = pitchAngle - 1;
    const testCp = Math.max(0.1, 0.48 - (testPitch * 0.015) - (tsrDeviation * 0.15));
    const delta = (testCp * 100) - efficiency;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Decreasing Pitch Angle by 1° will improve aerodynamic lift, increasing efficiency by +\${Math.round(delta*10)/10}%.\` });
  }
  
  if (Math.abs(tipSpeedRatio - 7) > 0.5) {
    const testCp = Math.max(0.1, 0.48 - pitchPenalty);
    const delta = (testCp * 100) - efficiency;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Your Tip Speed Ratio (\${tipSpeedRatio}) is suboptimal. Adjusting it closer to 7.0 will maximize your power coefficient, boosting efficiency by +\${Math.round(delta*10)/10}%.\` });
  }
  
  if (rotorDiameter < 50) {
    opts.push({ delta: 0.1, text: \`AI Insight: Increasing rotor diameter will exponentially increase swept area and power output.\` }); // Fallback power insight
  }
  
  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

  return {`);

// 2. Steam Turbine
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";[\s\S]*?  return \{/m, `  let opts = [];
  
  if (inletTemp < 600) {
    const potEff = (1 - (condTempK / (600 + 273.15))) * isentropicEff * 0.9;
    const delta = (potEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Increasing Inlet Temperature to 600°C would increase Carnot efficiency, boosting overall efficiency by +\${Math.round(delta*10)/10}%.\` });
  }
  
  if (condPressure > 0.03) {
    const potCondK = 24 + 273.15; // roughly 24C at 0.03 bar
    const potEff = (1 - (potCondK / tempK)) * isentropicEff * 0.9;
    const delta = (potEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Lowering condenser pressure creates a stronger vacuum, extracting more work and boosting efficiency by +\${Math.round(delta*10)/10}%.\` });
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

  return {`);

// 3. Gas Turbine
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";[\s\S]*?  return \{/m, `  let opts = [];
  
  if (pr < 25) {
    const potEff = (1 - (1 / Math.pow(25, (gamma - 1) / gamma))) * compEff * turbEff;
    const delta = (potEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Increasing Compressor Pressure Ratio to 25 will significantly boost thermal efficiency by +\${Math.round(delta*10)/10}%.\` });
  }
  
  if (tTurb < 1800) {
    // Turbine temp affects power directly more than efficiency in this simple model, but we assign a delta for ranking
    const potPower = airMassFlow * cpAir * (1800 - tIn) * efficiency;
    const pwrGain = (potPower - powerOutput) / powerOutput * 100;
    opts.push({ delta: pwrGain * 0.1, text: \`AI Insight: Increasing Turbine Inlet Temperature expands the gas further, producing \${Math.round(pwrGain)}% more work per kg of air.\` });
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

  return {`);

// 4. Hydro Turbine
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";[\s\S]*?  return \{/m, `  let opts = [];
  
  if (Math.abs(vaneOpening - 88) > 5) {
    const testDev = Math.abs(88 - 88) / 88;
    let testEff = 0.95 - (testDev * 0.3);
    const delta = (testEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: A Guide Vane Opening of 88% is optimal for preventing cavitation, which would increase efficiency by +\${Math.round(delta*10)/10}%.\` });
  }
  
  if (head < 200) {
    const potPower = rho * g * flowRate * 200 * efficiency;
    const pwrGain = (potPower - powerOutput) / powerOutput * 100;
    opts.push({ delta: pwrGain * 0.05, text: \`AI Insight: Increasing Water Head exponentially increases kinetic energy, boosting power output by \${Math.round(pwrGain)}%.\` });
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

  return {`);

// 5. Motor
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";\n  if \(params\.powerFactor < 0\.95\) \{\n    recommendation = "AI Insight: Improving your Power Factor \(e\.g\., via capacitor banks\) will significantly reduce stator current and copper losses\.";\n  \} else if \(params\.statorResistance > 0\.3\) \{\n    recommendation = "AI Insight: Rewinding the motor with thicker wire to reduce Stator Resistance will exponentially drop I²R thermal losses\.";\n  \}/m, `  let opts = [];
  
  if (params.powerFactor < 0.95) {
    const testI = actualPowerOut / (Math.sqrt(3) * supplyVoltage * 0.95);
    const testLoss = 3 * testI * testI * statorResistance;
    const gain = statorCopperLoss - testLoss;
    const testEff = (actualPowerOut / (inputPower - gain)) * 100;
    const delta = testEff - efficiency;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Improving Power Factor to 0.95 will reduce stator current, cutting copper losses and boosting efficiency by +\${Math.round(delta*100)/100}%.\`});
  }
  
  if (params.statorResistance > 0.3) {
    const testLoss = 3 * current * current * 0.3;
    const gain = statorCopperLoss - testLoss;
    const testEff = (actualPowerOut / (inputPower - gain)) * 100;
    const delta = testEff - efficiency;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Rewinding the motor to reduce Stator Resistance to 0.3Ω will drop I²R losses, boosting efficiency by +\${Math.round(delta*100)/100}%.\`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";`);

// 6. Generator
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";\n  if \(params\.fieldResistance > 2\.0\) \{\n    recommendation = "AI Insight: Decreasing field resistance will reduce excitation losses and boost efficiency under heavy load\.";\n  \} else if \(params\.powerFactor < 0\.9\) \{\n    recommendation = "AI Insight: A higher power factor means less reactive power, drastically reducing stator copper heating losses\.";\n  \}/m, `  let opts = [];
  
  if (params.fieldResistance > 2.0) {
    const testLoss = excitationCurrent * excitationCurrent * 2.0;
    const gain = fieldLoss - testLoss;
    const testEff = (ratedPowerW / (inputPower - gain)) * 100;
    const delta = testEff - efficiency;
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Decreasing field resistance to 2.0Ω will reduce excitation losses and boost efficiency by +\${Math.round(delta*100)/100}%.\`});
  }
  
  if (params.powerFactor < 0.9) {
    const testW = ratedPowerMVA * 0.9 * 1e6 * loadFactor;
    const testI = testW / (Math.sqrt(3) * terminalVoltage * 1000);
    const testCu = 3 * testI * testI * statorResistance;
    const gain = statorCopperLoss - testCu;
    if (gain > 0) opts.push({ delta: gain / 10000, text: \`AI Insight: Improving power factor reduces reactive current, drastically dropping stator copper losses.\`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";`);

// 7. Pump
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";\n  if \(params\.numberOfVanes !== 7\) \{\n    recommendation = "AI Insight: Changing the number of impeller vanes to exactly 7 provides the optimal balance of slip factor and friction losses, increasing hydraulic efficiency\.";\n  \} else if \(params\.impellerDiameter < 300\) \{\n    recommendation = "AI Insight: A larger impeller diameter generally yields better scaling efficiency due to reduced relative clearance gaps\.";\n  \}/m, `  let opts = [];
  
  if (params.numberOfVanes !== 7) {
    const testDev = 0;
    let testHyd = 0.88 - testDev * 0.12;
    testHyd *= (0.9 + 0.1 * Math.min((impellerDiameter / 1000) / 0.3, 1));
    const testEff = testHyd * volumetricEff * mechanicalEff;
    const delta = (testEff * 100) - (overallEfficiency * 100);
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Changing the number of impeller vanes to exactly 7 provides the optimal slip factor, increasing efficiency by +\${Math.round(delta*100)/100}%.\`});
  }
  
  if (params.impellerDiameter < 300) {
    let testHyd = 0.88 - vaneDeviation * 0.12;
    testHyd *= (0.9 + 0.1 * Math.min((300 / 1000) / 0.3, 1));
    const testEff = testHyd * volumetricEff * mechanicalEff;
    const delta = (testEff * 100) - (overallEfficiency * 100);
    if (delta > 0) opts.push({ delta, text: \`AI Insight: A larger impeller (300mm) yields better scaling efficiency due to reduced clearance gaps (+\${Math.round(delta*100)/100}%).\`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";`);

// 8. Compressor
content = content.replace(/  let recommendation = "Your parameters look optimal for this condition\.";\n  if \(params\.numberOfStages < 3 && params\.dischargePressure > 5\) \{\n    recommendation = "AI Insight: For a high pressure ratio, adding more compressor stages with intercooling will dramatically reduce the required compression work\.";\n  \} else if \(params\.inletTemperature > 300\) \{\n    recommendation = "AI Insight: Lowering inlet temperature increases air density, meaning the compressor does less work to achieve the same pressure ratio\.";\n  \}/m, `  let opts = [];
  
  if (params.numberOfStages < 3 && params.dischargePressure > 5) {
    const testCorr = 1 + (3 - 1) * 0.015;
    const testEff = Math.min(isentropicEfficiency * testCorr, 0.95);
    const delta = (testEff * 100) - (correctedEfficiency * 100);
    if (delta > 0) opts.push({ delta, text: \`AI Insight: Adding more compressor stages (e.g. 3) will dramatically improve isentropic efficiency by +\${Math.round(delta*100)/100}%.\`});
  }
  
  if (params.inletTemperature > 293) {
    const testIdeal = 293 * Math.pow(pressureRatio, gammaRatio);
    const testActual = 293 + (testIdeal - 293) / isentropicEfficiency;
    const testWork = cpAir * (testActual - 293);
    const testPwr = massFlowRate * testWork;
    const pwrGain = powerRequired - testPwr;
    if (pwrGain > 0) opts.push({ delta: pwrGain / 10000, text: \`AI Insight: Lowering inlet temp to 20°C (293K) increases density, saving \${Math.round(pwrGain/1000)} kW of power.\`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";`);

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', content, 'utf8');
console.log("SUCCESSFULLY UPDATED ENGINE");
