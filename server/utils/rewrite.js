const fs = require('fs');

let content = fs.readFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', 'utf8');

// Refactor simulateWindTurbine
content = content.replace(/function simulateWindTurbine\(params\) \{[\s\S]*?\n\s*return \{ efficiency: 0, powerOutput: 0, specificResults: \{\}, calculationSteps: \[\] \};\n\}/, `function simulateWindTurbine(params) {
  const windSpeed = params.windSpeed || 10;
  const pitchAngle = params.pitchAngle || 0;
  const rotorDiameter = params.rotorDiameter || 80;
  const airDensity = params.airDensity || 1.225;
  const tipSpeedRatio = params.tipSpeedRatio || 7;
  
  const pitchPenalty = pitchAngle * 0.015;
  const tsrDeviation = Math.abs(tipSpeedRatio - 7) / 7;
  let cp = 0.48 - pitchPenalty - (tsrDeviation * 0.15);
  if (cp < 0.1) cp = 0.1;
  
  const A = Math.PI * Math.pow(rotorDiameter / 2, 2);
  const powerOutput = 0.5 * airDensity * A * Math.pow(windSpeed, 3) * cp;
  const efficiency = Math.round(cp * 100 * 10) / 10;

  let recommendation = "Your parameters look optimal for this condition.";
  if (pitchAngle > 0) {
    recommendation = \`AI Insight: Decreasing your Pitch Angle by \${pitchAngle}° will improve aerodynamic lift, increasing efficiency from \${efficiency}% to \${Math.round((0.48 - (tsrDeviation * 0.15)) * 100 * 10)/10}%!\`;
  } else if (Math.abs(tipSpeedRatio - 7) > 0.5) {
    recommendation = \`AI Insight: Your Tip Speed Ratio (\${tipSpeedRatio}) is suboptimal. Adjusting it closer to 7.0 will maximize your power coefficient (Cp).\`;
  } else if (rotorDiameter < 50) {
    recommendation = \`AI Insight: Increasing rotor diameter will exponentially increase swept area and power output.\`;
  }

  return {
    efficiency: efficiency,
    powerOutput: powerOutput,
    specificResults: {
      windSpeed, pitchAngle, tipSpeedRatio,
      powerOutputKW: powerOutput / 1000,
      modelType: "Thermodynamic Model",
      aiRecommendation: recommendation
    },
    calculationSteps: [
      {
        stepName: 'Aerodynamic Efficiency (Cp)',
        formula: 'Betz Limit & Pitch Penalties',
        inputs: { pitchAngle, tipSpeedRatio },
        output: cp, unit: ''
      }
    ]
  };
}`);

// Refactor simulateSteamTurbine
content = content.replace(/function simulateSteamTurbine\(params\) \{[\s\S]*?\n\s*return \{ efficiency: 0, powerOutput: 0, specificResults: \{\}, calculationSteps: \[\] \};\n\}/, `function simulateSteamTurbine(params) {
  const inletPressure = params.inletPressure || 165;
  const inletTemp = params.inletTemperature || 540;
  const condPressure = params.condenserPressure || 0.045;
  const massFlowRate = params.massFlowRate || 200;
  
  // Approximate Rankine Cycle Efficiency
  const tempK = inletTemp + 273.15;
  const condTempK = 30 + 273.15; // roughly 30C at 0.045 bar
  const carnotEff = 1 - (condTempK / tempK);
  const isentropicEff = params.isentropicEfficiency || 0.88;
  
  let efficiency = carnotEff * isentropicEff * 0.9; // realistic factor
  
  // Enthalpy approx
  const deltaH = (inletTemp * 2) + (inletPressure * 1.5); 
  const powerOutput = massFlowRate * deltaH * efficiency * 1000; // Watts
  const effPercent = Math.round(efficiency * 100 * 10) / 10;

  let recommendation = "Your parameters look optimal for this condition.";
  if (inletTemp < 600) {
    const potEff = (1 - (condTempK / (600 + 273.15))) * isentropicEff * 0.9;
    const gain = Math.round((potEff - efficiency) * 100 * 10) / 10;
    recommendation = \`AI Insight: Increasing Inlet Temperature to 600°C would increase Carnot efficiency, boosting overall efficiency by \${gain}%.\`;
  } else if (condPressure > 0.03) {
    recommendation = \`AI Insight: Lowering condenser pressure creates a stronger vacuum, extracting more work from the low-pressure turbine stages.\`;
  }

  return {
    efficiency: effPercent,
    powerOutput: powerOutput,
    specificResults: {
      inletPressure, inletTemperature: inletTemp,
      powerOutputMW: powerOutput / 1000000,
      modelType: "Thermodynamic Model",
      aiRecommendation: recommendation
    },
    calculationSteps: [
      {
        stepName: 'Rankine Efficiency',
        formula: 'η = (1 - T_cold / T_hot) * η_is',
        inputs: { T_hot: tempK, T_cold: condTempK },
        output: effPercent, unit: '%'
      }
    ]
  };
}`);

// Refactor simulateGasTurbine
content = content.replace(/function simulateGasTurbine\(params\) \{[\s\S]*?\n\s*return \{ efficiency: 0, powerOutput: 0, specificResults: \{\}, calculationSteps: \[\] \};\n\}/, `function simulateGasTurbine(params) {
  const pr = params.compressorPressureRatio || 15;
  const tIn = params.inletTemperature || 288;
  const tTurb = params.turbineInletTemp || 1500;
  const airMassFlow = params.airMassFlow || 50;
  const gamma = params.gamma || 1.4;
  
  // Brayton Cycle Efficiency
  const braytonEff = 1 - (1 / Math.pow(pr, (gamma - 1) / gamma));
  const compEff = params.compressorEfficiency || 0.87;
  const turbEff = params.turbineEfficiency || 0.90;
  
  let efficiency = braytonEff * compEff * turbEff;
  
  const cpAir = params.cpAir || 1005;
  const powerOutput = airMassFlow * cpAir * (tTurb - tIn) * efficiency; // simplified
  const effPercent = Math.round(efficiency * 100 * 10) / 10;

  let recommendation = "Your parameters look optimal for this condition.";
  if (pr < 25) {
    const potEff = (1 - (1 / Math.pow(25, (gamma - 1) / gamma))) * compEff * turbEff;
    const gain = Math.round((potEff - efficiency) * 100 * 10) / 10;
    recommendation = \`AI Insight: Increasing Compressor Pressure Ratio to 25 could boost thermal efficiency by \${gain}%, heavily increasing power output!\`;
  } else if (tTurb < 1800) {
    recommendation = \`AI Insight: Increasing Turbine Inlet Temperature expands the gas further, producing more work per kg of air.\`;
  }

  return {
    efficiency: effPercent,
    powerOutput: powerOutput,
    specificResults: {
      compressorPressureRatio: pr, turbineInletTemp: tTurb,
      powerOutputMW: powerOutput / 1000000,
      modelType: "Thermodynamic Model",
      aiRecommendation: recommendation
    },
    calculationSteps: [
      {
        stepName: 'Brayton Efficiency',
        formula: 'η = 1 - (1 / rp^((γ-1)/γ))',
        inputs: { pressureRatio: pr, gamma },
        output: effPercent, unit: '%'
      }
    ]
  };
}`);

// Refactor simulateHydroTurbine
content = content.replace(/function simulateHydroTurbine\(params\) \{[\s\S]*?\n\s*return \{ efficiency: 0, powerOutput: 0, specificResults: \{\}, calculationSteps: \[\] \};\n\}/, `function simulateHydroTurbine(params) {
  const head = params.waterHead || 150;
  const flowRate = params.flowRate || 50;
  const vaneOpening = params.guideVaneOpening || 85;
  const rho = params.waterDensity || 997;
  const g = params.gravity || 9.81;
  
  // Hydraulic Efficiency depends on vane opening (optimal around 85-90%)
  const vaneDev = Math.abs(vaneOpening - 88) / 88;
  let efficiency = 0.95 - (vaneDev * 0.3);
  if (efficiency < 0.2) efficiency = 0.2;
  
  const powerOutput = rho * g * flowRate * head * efficiency;
  const effPercent = Math.round(efficiency * 100 * 10) / 10;

  let recommendation = "Your parameters look optimal for this condition.";
  if (Math.abs(vaneOpening - 88) > 5) {
    const potEff = 0.95;
    const gain = Math.round((potEff - efficiency) * 100 * 10) / 10;
    recommendation = \`AI Insight: A Guide Vane Opening of 88% is optimal for preventing cavitation and flow separation. Changing it will increase efficiency by \${gain}%.\`;
  } else if (head < 200) {
    recommendation = \`AI Insight: Increasing Water Head exponentially increases kinetic energy at the penstock exit.\`;
  }

  return {
    efficiency: effPercent,
    powerOutput: powerOutput,
    specificResults: {
      waterHead: head, flowRate, guideVaneOpening: vaneOpening,
      powerOutputMW: powerOutput / 1000000,
      modelType: "Thermodynamic Model",
      aiRecommendation: recommendation
    },
    calculationSteps: [
      {
        stepName: 'Hydraulic Power',
        formula: 'P = ρ × g × Q × H × η',
        inputs: { head, flowRate, vaneOpening },
        output: powerOutput, unit: 'W'
      }
    ]
  };
}`);

// Add AI Recommendations to Motor
content = content.replace(/return \{\n    efficiency: Math.round\(efficiency \* 100\) \/ 100,\n    powerOutput: Math.round\(actualPowerOut \* 100\) \/ 100,\n    specificResults: \{([\s\S]*?)\},\n    calculationSteps: steps,\n  \};/g, (match, p1) => {
  if (match.includes('slip:')) {
    return `
  let recommendation = "Your parameters look optimal for this condition.";
  if (params.powerFactor < 0.95) {
    recommendation = "AI Insight: Improving your Power Factor (e.g., via capacitor banks) will significantly reduce stator current and copper losses.";
  } else if (params.statorResistance > 0.3) {
    recommendation = "AI Insight: Rewinding the motor with thicker wire to reduce Stator Resistance will exponentially drop I²R thermal losses.";
  }
  return {
    efficiency: Math.round(efficiency * 100) / 100,
    powerOutput: Math.round(actualPowerOut * 100) / 100,
    specificResults: {${p1}      aiRecommendation: recommendation\n    },
    calculationSteps: steps,
  };`;
  }
  return match;
});

// Add AI Recommendations to Generator
content = content.replace(/return \{\n    efficiency: Math.round\(efficiency \* 100\) \/ 100,\n    powerOutput: Math.round\(ratedPowerW \* 100\) \/ 100,\n    specificResults: \{([\s\S]*?)\},\n    calculationSteps: steps,\n  \};/g, (match, p1) => {
  if (match.includes('statorCurrent:')) {
    return `
  let recommendation = "Your parameters look optimal for this condition.";
  if (params.fieldResistance > 2.0) {
    recommendation = "AI Insight: Decreasing field resistance will reduce excitation losses and boost efficiency under heavy load.";
  } else if (params.powerFactor < 0.9) {
    recommendation = "AI Insight: A higher power factor means less reactive power, drastically reducing stator copper heating losses.";
  }
  return {
    efficiency: Math.round(efficiency * 100) / 100,
    powerOutput: Math.round(ratedPowerW * 100) / 100,
    specificResults: {${p1}      aiRecommendation: recommendation\n    },
    calculationSteps: steps,
  };`;
  }
  return match;
});

// Add AI Recommendations to Pump
content = content.replace(/return \{\n    efficiency: Math.round\(overallEfficiency \* 100 \* 100\) \/ 100,\n    powerOutput: Math.round\(hydraulicPower \* 100\) \/ 100,\n    specificResults: \{([\s\S]*?)\},\n    calculationSteps: steps,\n  \};/g, (match, p1) => {
  if (match.includes('hydraulicPower:')) {
    return `
  let recommendation = "Your parameters look optimal for this condition.";
  if (params.numberOfVanes !== 7) {
    recommendation = "AI Insight: Changing the number of impeller vanes to exactly 7 provides the optimal balance of slip factor and friction losses, increasing hydraulic efficiency.";
  } else if (params.impellerDiameter < 300) {
    recommendation = "AI Insight: A larger impeller diameter generally yields better scaling efficiency due to reduced relative clearance gaps.";
  }
  return {
    efficiency: Math.round(overallEfficiency * 100 * 100) / 100,
    powerOutput: Math.round(hydraulicPower * 100) / 100,
    specificResults: {${p1}      aiRecommendation: recommendation\n    },
    calculationSteps: steps,
  };`;
  }
  return match;
});

// Add AI Recommendations to Compressor
content = content.replace(/return \{\n    efficiency: Math.round\(correctedEfficiency \* 100 \* 100\) \/ 100,\n    powerOutput: Math.round\(powerRequired \* 100\) \/ 100, \/\/ Power consumed\n    specificResults: \{([\s\S]*?)\},\n    calculationSteps: steps,\n  \};/g, (match, p1) => {
  if (match.includes('idealWork:')) {
    return `
  let recommendation = "Your parameters look optimal for this condition.";
  if (params.numberOfStages < 3 && params.dischargePressure > 5) {
    recommendation = "AI Insight: For a high pressure ratio, adding more compressor stages with intercooling will dramatically reduce the required compression work.";
  } else if (params.inletTemperature > 300) {
    recommendation = "AI Insight: Lowering inlet temperature increases air density, meaning the compressor does less work to achieve the same pressure ratio.";
  }
  return {
    efficiency: Math.round(correctedEfficiency * 100 * 100) / 100,
    powerOutput: Math.round(powerRequired * 100) / 100, // Power consumed
    specificResults: {${p1}      aiRecommendation: recommendation\n    },
    calculationSteps: steps,
  };`;
  }
  return match;
});

fs.writeFileSync('c:/Users/nishu/Downloads/New folder (2)/server/utils/simulationEngine.js', content, 'utf8');
console.log("SUCCESSFULLY UPDATED");
