
function parseParam(val, def) {
  if (val === undefined || val === null) return def;
  if (val === '') return 0;
  const num = Number(val);
  return isNaN(num) ? def : num;
}
// ============================================
// TurbineIQ Simulation Engine
// Simplified physics models for 8 machine types
// Enables trial-and-error parameter optimization
// ============================================

const fs = require('fs');
const path = require('path');
const { MultivariateLinearRegression } = require('ml-regression');

// Load ML models lazily
const models = {};

function getMLModel(machineType) {
  if (models[machineType]) return models[machineType];
  
  const fileNames = {
    'WIND_TURBINE': 'wind_ml_model.json',
    'HYDRO_TURBINE': 'hydro_ml_model.json',
    'STEAM_TURBINE': 'steam_ml_model.json',
    'GAS_TURBINE': 'gas_ml_model.json',
  };
  
  const fileName = fileNames[machineType];
  if (!fileName) return null;

  try {
    const modelPath = path.join(__dirname, '../models', fileName);
    if (fs.existsSync(modelPath)) {
      const modelJSON = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
      models[machineType] = MultivariateLinearRegression.load(modelJSON);
      return models[machineType];
    }
  } catch (error) {
    console.error(`Failed to load ML model for ${machineType}:`, error);
  }
  return null;
}

/**
 * Main entry point — runs simulation for any machine type
 * @param {string} machineType - One of the 8 supported types
 * @param {object} params - Design parameters from the student
 * @returns {object} - { efficiency, powerOutput, specificResults, calculationSteps }
 */
function runSimulation(machineType, params) {
  switch (machineType) {
    case 'WIND_TURBINE':
      return simulateWindTurbine(params);
    case 'STEAM_TURBINE':
      return simulateSteamTurbine(params);
    case 'GAS_TURBINE':
      return simulateGasTurbine(params);
    case 'HYDRO_TURBINE':
      return simulateHydroTurbine(params);
    case 'MOTOR':
      return simulateMotor(params);
    case 'GENERATOR':
      return simulateGenerator(params);
    case 'PUMP':
      return simulatePump(params);
    case 'COMPRESSOR':
      return simulateCompressor(params);
    default:
      throw new Error(`Unsupported machine type: ${machineType}`);
  }
}

// =============================================
// WIND TURBINE — Betz Limit & BEM Theory
// P = 0.5 * ρ * A * v³ * Cp
// =============================================

function simulateWindTurbine(params) {
  const windSpeed = parseParam(params.windSpeed, 10);
  const pitchAngle = parseParam(params.pitchAngle, 0);
  const rotorDiameter = parseParam(params.rotorDiameter, 80);
  const airDensity = parseParam(params.airDensity, 1.225);
  const tipSpeedRatio = parseParam(params.tipSpeedRatio, 7);
  
  const pitchPenalty = pitchAngle * 0.015;
  const tsrDeviation = Math.abs(tipSpeedRatio - 7) / 7;
  let cp = 0.48 - pitchPenalty - (tsrDeviation * 0.15);
  if (cp < 0.1) cp = 0.1;
  
  const A = Math.PI * Math.pow(rotorDiameter / 2, 2);
  const powerOutput = 0.5 * airDensity * A * Math.pow(windSpeed, 3) * cp;
  let efficiency = Math.round(cp * 100 * 10) / 10;

  let opts = [];
  
  if (pitchAngle > 0) {
    const testPitch = pitchAngle - 1;
    const testCp = Math.max(0.1, 0.48 - (testPitch * 0.015) - (tsrDeviation * 0.15));
    const delta = (testCp * 100) - efficiency;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Decreasing Pitch Angle by 1° will improve aerodynamic lift, increasing efficiency by +${Math.round(delta*10)/10}%.` });
  }
  
  if (Math.abs(tipSpeedRatio - 7) > 0.5) {
    const testCp = Math.max(0.1, 0.48 - pitchPenalty);
    const delta = (testCp * 100) - efficiency;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Your Tip Speed Ratio (${tipSpeedRatio}) is suboptimal. Adjusting it closer to 7.0 will maximize your power coefficient, boosting efficiency by +${Math.round(delta*10)/10}%.` });
  }
  
  if (rotorDiameter < 50) {
    opts.push({ delta: 0.1, text: `AI Insight: Increasing rotor diameter will exponentially increase swept area and power output.` }); // Fallback power insight
  }
  
  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

  if (powerOutput === 0 || isNaN(powerOutput)) {
    efficiency = 0;
    recommendation = "AI Insight: The machine is non-operational. Ensure primary driving parameters (e.g. wind speed, flow rate, voltage) are greater than zero.";
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
}

// =============================================
// STEAM TURBINE — Rankine Cycle
// η = 1 - (T_cold / T_hot) adjusted for real conditions
// =============================================

function simulateSteamTurbine(params) {
  const inletPressure = parseParam(params.inletPressure, 165);
  const inletTemp = parseParam(params.inletTemperature, 540);
  const condPressure = parseParam(params.condenserPressure, 0.045);
  const massFlowRate = parseParam(params.massFlowRate, 200);
  
  // Approximate Rankine Cycle Efficiency
  const tempK = inletTemp + 273.15;
  const condTempK = 30 + 273.15; // roughly 30C at 0.045 bar
  const carnotEff = 1 - (condTempK / tempK);
  const isentropicEff = parseParam(params.isentropicEfficiency, 0.88);
  
  let efficiency = carnotEff * isentropicEff * 0.9; // realistic factor
  
  // Enthalpy approx
  const deltaH = (inletTemp * 2) + (inletPressure * 1.5); 
  const powerOutput = massFlowRate * deltaH * efficiency * 1000; // Watts
  let effPercent = Math.round(efficiency * 100 * 10) / 10;

  let opts = [];
  
  if (inletTemp < 600) {
    const potEff = (1 - (condTempK / (600 + 273.15))) * isentropicEff * 0.9;
    const delta = (potEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Increasing Inlet Temperature to 600°C would increase Carnot efficiency, boosting overall efficiency by +${Math.round(delta*10)/10}%.` });
  }
  
  if (condPressure > 0.03) {
    const potCondK = 24 + 273.15; // roughly 24C at 0.03 bar
    const potEff = (1 - (potCondK / tempK)) * isentropicEff * 0.9;
    const delta = (potEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Lowering condenser pressure creates a stronger vacuum, extracting more work and boosting efficiency by +${Math.round(delta*10)/10}%.` });
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

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
}

// =============================================
// GAS TURBINE — Brayton Cycle
// η = 1 - (1 / rp^((γ-1)/γ))
// =============================================

function simulateGasTurbine(params) {
  const pr = parseParam(params.compressorPressureRatio, 15);
  const tIn = parseParam(params.inletTemperature, 288);
  const tTurb = parseParam(params.turbineInletTemp, 1500);
  const airMassFlow = parseParam(params.airMassFlow, 50);
  const gamma = parseParam(params.gamma, 1.4);
  
  // Brayton Cycle Efficiency
  const braytonEff = 1 - (1 / Math.pow(pr, (gamma - 1) / gamma));
  const compEff = parseParam(params.compressorEfficiency, 0.87);
  const turbEff = parseParam(params.turbineEfficiency, 0.90);
  
  let efficiency = braytonEff * compEff * turbEff;
  
  const cpAir = parseParam(params.cpAir, 1005);
  const powerOutput = airMassFlow * cpAir * (tTurb - tIn) * efficiency; // simplified
  let effPercent = Math.round(efficiency * 100 * 10) / 10;

  let opts = [];
  
  if (pr < 25) {
    const potEff = (1 - (1 / Math.pow(25, (gamma - 1) / gamma))) * compEff * turbEff;
    const delta = (potEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Increasing Compressor Pressure Ratio to 25 will significantly boost thermal efficiency by +${Math.round(delta*10)/10}%.` });
  }
  
  if (tTurb < 1800) {
    // Turbine temp affects power directly more than efficiency in this simple model, but we assign a delta for ranking
    const potPower = airMassFlow * cpAir * (1800 - tIn) * efficiency;
    const pwrGain = (potPower - powerOutput) / powerOutput * 100;
    opts.push({ delta: pwrGain * 0.1, text: `AI Insight: Increasing Turbine Inlet Temperature expands the gas further, producing ${Math.round(pwrGain)}% more work per kg of air.` });
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

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
}

// =============================================
// HYDRO TURBINE — Euler's Equation
// P = ρ × g × Q × H × η
// =============================================

function simulateHydroTurbine(params) {
  const head = parseParam(params.waterHead, 150);
  const flowRate = parseParam(params.flowRate, 50);
  const vaneOpening = parseParam(params.guideVaneOpening, 85);
  const rho = parseParam(params.waterDensity, 997);
  const g = parseParam(params.gravity, 9.81);
  
  // Hydraulic Efficiency depends on vane opening (optimal around 85-90%)
  const vaneDev = Math.abs(vaneOpening - 88) / 88;
  let efficiency = 0.95 - (vaneDev * 0.3);
  if (efficiency < 0.2) efficiency = 0.2;
  
  const powerOutput = rho * g * flowRate * head * efficiency;
  let effPercent = Math.round(efficiency * 100 * 10) / 10;

  let opts = [];
  
  if (Math.abs(vaneOpening - 88) > 5) {
    const testDev = Math.abs(88 - 88) / 88;
    let testEff = 0.95 - (testDev * 0.3);
    const delta = (testEff * 100) - effPercent;
    if (delta > 0) opts.push({ delta, text: `AI Insight: A Guide Vane Opening of 88% is optimal for preventing cavitation, which would increase efficiency by +${Math.round(delta*10)/10}%.` });
  }
  
  if (head < 200) {
    const potPower = rho * g * flowRate * 200 * efficiency;
    const pwrGain = (potPower - powerOutput) / powerOutput * 100;
    opts.push({ delta: pwrGain * 0.05, text: `AI Insight: Increasing Water Head exponentially increases kinetic energy, boosting power output by ${Math.round(pwrGain)}%.` });
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";

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
}

// =============================================
// ELECTRIC MOTOR — Loss-based efficiency
// η = P_out / (P_out + P_losses)
// =============================================

function simulateMotor(params) {
  const {
    ratedPower = 75,            // kW
    supplyVoltage = 400,        // V
    loadPercent = 100,          // % of rated load
    statorResistance = 0.5,     // Ohms
    rotorResistance = 0.3,      // Ohms
    coreFluxDensity = 1.2,      // Tesla
    speed = 1485,               // RPM
    synchronousSpeed = 1500,    // RPM
    powerFactor = 0.85,
  } = params;

  const steps = [];

  // Slip
  const slip = (synchronousSpeed - speed) / synchronousSpeed;
  steps.push({
    stepName: 'Slip',
    formula: 's = (Ns - N) / Ns',
    inputs: { synchronousSpeed, speed },
    output: slip,
    unit: 'dimensionless',
  });

  // Load factor
  const loadFactor = loadPercent / 100;
  const actualPowerOut = ratedPower * loadFactor * 1000; // Watts

  // Copper losses (proportional to load²)
  const current = actualPowerOut / (Math.sqrt(3) * supplyVoltage * powerFactor);
  const statorCopperLoss = 3 * current * current * statorResistance;
  const rotorCopperLoss = 3 * current * current * rotorResistance * slip;

  steps.push({
    stepName: 'Copper Losses',
    formula: 'P_cu = I²R (stator + rotor)',
    inputs: { current, statorResistance, rotorResistance },
    output: statorCopperLoss + rotorCopperLoss,
    unit: 'W',
  });

  // Iron/core losses (approximately constant, proportional to flux²)
  const ironLoss = 0.02 * ratedPower * 1000 * coreFluxDensity;
  steps.push({
    stepName: 'Iron Losses',
    formula: 'P_iron ≈ 0.02 × P_rated × B',
    inputs: { ratedPower, coreFluxDensity },
    output: ironLoss,
    unit: 'W',
  });

  // Mechanical losses (friction and windage)
  const mechLoss = 0.01 * ratedPower * 1000;

  // Stray losses
  const strayLoss = 0.005 * actualPowerOut;

  // Total losses
  const totalLosses = statorCopperLoss + rotorCopperLoss + ironLoss + mechLoss + strayLoss;
  const inputPower = actualPowerOut + totalLosses;
  let efficiency = (actualPowerOut / inputPower) * 100;

  steps.push({
    stepName: 'Efficiency',
    formula: 'η = P_out / (P_out + P_losses)',
    inputs: { actualPowerOut, totalLosses },
    output: efficiency,
    unit: '%',
  });

  
  let opts = [];
  
  if (params.powerFactor < 0.95) {
    const testI = actualPowerOut / (Math.sqrt(3) * supplyVoltage * 0.95);
    const testLoss = 3 * testI * testI * statorResistance;
    const gain = statorCopperLoss - testLoss;
    const testEff = (actualPowerOut / (inputPower - gain)) * 100;
    const delta = testEff - efficiency;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Improving Power Factor to 0.95 will reduce stator current, cutting copper losses and boosting efficiency by +${Math.round(delta*100)/100}%.`});
  }
  
  if (params.statorResistance > 0.3) {
    const testLoss = 3 * current * current * 0.3;
    const gain = statorCopperLoss - testLoss;
    const testEff = (actualPowerOut / (inputPower - gain)) * 100;
    const delta = testEff - efficiency;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Rewinding the motor to reduce Stator Resistance to 0.3Ω will drop I²R losses, boosting efficiency by +${Math.round(delta*100)/100}%.`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";
  return {
    efficiency: Math.round(efficiency * 100) / 100,
    powerOutput: Math.round(actualPowerOut * 100) / 100,
    specificResults: {
      slip: Math.round(slip * 10000) / 10000,
      current: Math.round(current * 100) / 100,
      statorCopperLoss: Math.round(statorCopperLoss * 100) / 100,
      rotorCopperLoss: Math.round(rotorCopperLoss * 100) / 100,
      ironLoss: Math.round(ironLoss * 100) / 100,
      mechanicalLoss: Math.round(mechLoss * 100) / 100,
      strayLoss: Math.round(strayLoss * 100) / 100,
      totalLosses: Math.round(totalLosses * 100) / 100,
      inputPower: Math.round(inputPower * 100) / 100,
          aiRecommendation: recommendation
    },
    calculationSteps: steps,
  };
}

// =============================================
// GENERATOR — Efficiency based on losses
// =============================================

function simulateGenerator(params) {
  const {
    ratedPowerMVA = 50,         // MVA
    terminalVoltage = 11,       // kV
    powerFactor = 0.85,
    loadPercent = 100,
    excitationCurrent = 120,    // A
    statorResistance = 0.01,    // Ohms
    fieldResistance = 5.0,      // Ohms
    speed = 1500,               // RPM
    poles = 4,
  } = params;

  const steps = [];

  const loadFactor = loadPercent / 100;
  const ratedPowerW = ratedPowerMVA * powerFactor * 1e6 * loadFactor;

  // Stator current
  const statorCurrent = ratedPowerW / (Math.sqrt(3) * terminalVoltage * 1000);
  steps.push({
    stepName: 'Stator Current',
    formula: 'I = P / (√3 × V)',
    inputs: { ratedPowerW, terminalVoltage },
    output: statorCurrent,
    unit: 'A',
  });

  // Copper losses
  const statorCopperLoss = 3 * statorCurrent * statorCurrent * statorResistance;
  const fieldLoss = excitationCurrent * excitationCurrent * fieldResistance;

  steps.push({
    stepName: 'Total Copper Losses',
    formula: 'P_cu = 3×I²×R_s + I_f²×R_f',
    inputs: { statorCurrent, statorResistance, excitationCurrent, fieldResistance },
    output: statorCopperLoss + fieldLoss,
    unit: 'W',
  });

  // Iron losses
  const ironLoss = 0.01 * ratedPowerMVA * 1e6;

  // Mechanical + windage losses
  const mechLoss = 0.005 * ratedPowerMVA * 1e6;

  // Stray losses
  const strayLoss = 0.003 * ratedPowerW;

  const totalLosses = statorCopperLoss + fieldLoss + ironLoss + mechLoss + strayLoss;
  const inputPower = ratedPowerW + totalLosses;
  let efficiency = (ratedPowerW / inputPower) * 100;

  steps.push({
    stepName: 'Efficiency',
    formula: 'η = P_out / (P_out + Σ_losses)',
    inputs: { ratedPowerW, totalLosses },
    output: efficiency,
    unit: '%',
  });

  
  let opts = [];
  
  if (params.fieldResistance > 2.0) {
    const testLoss = excitationCurrent * excitationCurrent * 2.0;
    const gain = fieldLoss - testLoss;
    const testEff = (ratedPowerW / (inputPower - gain)) * 100;
    const delta = testEff - efficiency;
    if (delta > 0) opts.push({ delta, text: `AI Insight: Decreasing field resistance to 2.0Ω will reduce excitation losses and boost efficiency by +${Math.round(delta*100)/100}%.`});
  }
  
  if (params.powerFactor < 0.9) {
    const testW = ratedPowerMVA * 0.9 * 1e6 * loadFactor;
    const testI = testW / (Math.sqrt(3) * terminalVoltage * 1000);
    const testCu = 3 * testI * testI * statorResistance;
    const gain = statorCopperLoss - testCu;
    if (gain > 0) opts.push({ delta: gain / 10000, text: `AI Insight: Improving power factor reduces reactive current, drastically dropping stator copper losses.`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";
  if (Math.round(ratedPowerW * 100) / 100 === 0 || isNaN(Math.round(ratedPowerW * 100) / 100)) {
    efficiency = 0;
    recommendation = "AI Insight: The machine is non-operational. Ensure primary driving parameters (e.g. wind speed, flow rate, voltage) are greater than zero.";
  }
  return {
    efficiency: Math.round(efficiency * 100) / 100,
    powerOutput: Math.round(ratedPowerW * 100) / 100,
    specificResults: {
      statorCurrent: Math.round(statorCurrent * 100) / 100,
      statorCopperLoss: Math.round(statorCopperLoss * 100) / 100,
      fieldLoss: Math.round(fieldLoss * 100) / 100,
      ironLoss: Math.round(ironLoss * 100) / 100,
      mechanicalLoss: Math.round(mechLoss * 100) / 100,
      strayLoss: Math.round(strayLoss * 100) / 100,
      totalLosses: Math.round(totalLosses * 100) / 100,
      outputPowerMW: Math.round(ratedPowerW / 1e6 * 100) / 100,
          aiRecommendation: recommendation
    },
    calculationSteps: steps,
  };
}

// =============================================
// PUMP — Centrifugal Pump Performance
// η = (ρ × g × Q × H) / P_shaft
// =============================================

function simulatePump(params) {
  const {
    impellerDiameter = 250,    // mm
    speed = 2950,              // RPM
    flowRate = 250,            // m³/h
    suctionPressure = 1.5,     // bar
    dischargePressure = 10,    // bar
    fluidDensity = 997,        // kg/m³
    gravity = 9.81,
    numberOfVanes = 6,
    impellerWidth = 30,        // mm
  } = params;

  const steps = [];

  // Total head
  const totalHead = (dischargePressure - suctionPressure) * 1e5 / (fluidDensity * gravity);
  steps.push({
    stepName: 'Total Head',
    formula: 'H = ΔP / (ρ × g)',
    inputs: { dischargePressure, suctionPressure, fluidDensity },
    output: totalHead,
    unit: 'm',
  });

  // Flow rate in m³/s
  const flowRateM3s = flowRate / 3600;

  // Hydraulic power
  const hydraulicPower = fluidDensity * gravity * flowRateM3s * totalHead;
  steps.push({
    stepName: 'Hydraulic Power',
    formula: 'P_hyd = ρ × g × Q × H',
    inputs: { fluidDensity, gravity, flowRateM3s, totalHead },
    output: hydraulicPower,
    unit: 'W',
  });

  // Specific speed for pump classification
  const specificSpeed = speed * Math.sqrt(flowRateM3s) / Math.pow(totalHead, 0.75);

  // Hydraulic efficiency — affected by vane count
  const optimalVanes = 7;
  const vaneDeviation = Math.abs(numberOfVanes - optimalVanes) / optimalVanes;
  let hydraulicEff = 0.88 - vaneDeviation * 0.12;

  // Size correction
  const impellerDiameterM = impellerDiameter / 1000;
  hydraulicEff *= (0.9 + 0.1 * Math.min(impellerDiameterM / 0.3, 1));

  // Volumetric efficiency
  const volumetricEff = 0.96;

  // Mechanical efficiency
  const mechanicalEff = 0.95;

  let overallEfficiency = hydraulicEff * volumetricEff * mechanicalEff;
  const shaftPower = hydraulicPower / overallEfficiency;

  steps.push({
    stepName: 'Overall Efficiency',
    formula: 'η = η_hyd × η_vol × η_mech',
    inputs: { hydraulicEff, volumetricEff, mechanicalEff },
    output: overallEfficiency,
    unit: 'dimensionless',
  });

  
  let opts = [];
  
  if (params.numberOfVanes !== 7) {
    const testDev = 0;
    let testHyd = 0.88 - testDev * 0.12;
    testHyd *= (0.9 + 0.1 * Math.min((impellerDiameter / 1000) / 0.3, 1));
    const testEff = testHyd * volumetricEff * mechanicalEff;
    const delta = (testEff * 100) - (overallEfficiency * 100);
    if (delta > 0) opts.push({ delta, text: `AI Insight: Changing the number of impeller vanes to exactly 7 provides the optimal slip factor, increasing efficiency by +${Math.round(delta*100)/100}%.`});
  }
  
  if (params.impellerDiameter < 300) {
    let testHyd = 0.88 - vaneDeviation * 0.12;
    testHyd *= (0.9 + 0.1 * Math.min((300 / 1000) / 0.3, 1));
    const testEff = testHyd * volumetricEff * mechanicalEff;
    const delta = (testEff * 100) - (overallEfficiency * 100);
    if (delta > 0) opts.push({ delta, text: `AI Insight: A larger impeller (300mm) yields better scaling efficiency due to reduced clearance gaps (+${Math.round(delta*100)/100}%).`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";
  if (Math.round(hydraulicPower * 100) / 100 === 0 || isNaN(Math.round(hydraulicPower * 100) / 100)) {
    overallEfficiency = 0;
    recommendation = "AI Insight: The machine is non-operational. Ensure primary driving parameters (e.g. wind speed, flow rate, voltage) are greater than zero.";
  }
  return {
    efficiency: Math.round(overallEfficiency * 100 * 100) / 100,
    powerOutput: Math.round(hydraulicPower * 100) / 100,
    specificResults: {
      totalHead: Math.round(totalHead * 100) / 100,
      hydraulicPower: Math.round(hydraulicPower * 100) / 100,
      shaftPowerRequired: Math.round(shaftPower * 100) / 100,
      specificSpeed: Math.round(specificSpeed * 100) / 100,
      hydraulicEfficiency: Math.round(hydraulicEff * 10000) / 10000,
      volumetricEfficiency: volumetricEff,
      mechanicalEfficiency: mechanicalEff,
      overallEfficiency: Math.round(overallEfficiency * 10000) / 10000,
      shaftPowerKW: Math.round(shaftPower / 1000 * 100) / 100,
          aiRecommendation: recommendation
    },
    calculationSteps: steps,
  };
}

// =============================================
// COMPRESSOR — Isentropic Compression
// =============================================

function simulateCompressor(params) {
  const {
    inletPressure = 1.0,        // bar
    dischargePressure = 8.0,    // bar
    inletTemperature = 293,     // K (20°C)
    massFlowRate = 5.5,         // kg/s
    speed = 10500,              // RPM
    gamma = 1.4,
    cpAir = 1005,               // J/(kg·K)
    numberOfStages = 1,
    isentropicEfficiency = 0.82,
  } = params;

  const steps = [];

  // Pressure ratio
  const pressureRatio = dischargePressure / inletPressure;
  steps.push({
    stepName: 'Pressure Ratio',
    formula: 'rp = P₂ / P₁',
    inputs: { dischargePressure, inletPressure },
    output: pressureRatio,
    unit: 'dimensionless',
  });

  // Per-stage pressure ratio (if multi-stage)
  const stageRatio = Math.pow(pressureRatio, 1 / numberOfStages);

  // Isentropic exit temperature
  const gammaRatio = (gamma - 1) / gamma;
  const t2Ideal = inletTemperature * Math.pow(pressureRatio, gammaRatio);

  // Actual exit temperature
  const t2Actual = inletTemperature + (t2Ideal - inletTemperature) / isentropicEfficiency;

  steps.push({
    stepName: 'Discharge Temperature',
    formula: 'T₂ = T₁ + (T₂ᵢdeal - T₁) / η_is',
    inputs: { inletTemperature, t2Ideal, isentropicEfficiency },
    output: t2Actual,
    unit: 'K',
  });

  // Ideal work
  const idealWork = cpAir * (t2Ideal - inletTemperature);

  // Actual work
  const actualWork = cpAir * (t2Actual - inletTemperature);

  // Stage efficiency correction (multi-stage is more efficient)
  const stageCorrection = 1 + (numberOfStages - 1) * 0.015;
  let correctedEfficiency = Math.min(isentropicEfficiency * stageCorrection, 0.95);

  steps.push({
    stepName: 'Compression Work',
    formula: 'W = cp × (T₂ - T₁)',
    inputs: { cpAir, t2Actual, inletTemperature },
    output: actualWork,
    unit: 'J/kg',
  });

  // Power required
  const powerRequired = massFlowRate * actualWork;
  steps.push({
    stepName: 'Power Required',
    formula: 'P = ṁ × W',
    inputs: { massFlowRate, actualWork },
    output: powerRequired,
    unit: 'W',
  });

  // Surge margin
  const surgeMargin = 25 - (pressureRatio - 4) * 2 - (speed - 8000) / 1000;

  
  let opts = [];
  
  if (params.numberOfStages < 3 && params.dischargePressure > 5) {
    const testCorr = 1 + (3 - 1) * 0.015;
    const testEff = Math.min(isentropicEfficiency * testCorr, 0.95);
    const delta = (testEff * 100) - (correctedEfficiency * 100);
    if (delta > 0) opts.push({ delta, text: `AI Insight: Adding more compressor stages (e.g. 3) will dramatically improve isentropic efficiency by +${Math.round(delta*100)/100}%.`});
  }
  
  if (params.inletTemperature > 293) {
    const testIdeal = 293 * Math.pow(pressureRatio, gammaRatio);
    const testActual = 293 + (testIdeal - 293) / isentropicEfficiency;
    const testWork = cpAir * (testActual - 293);
    const testPwr = massFlowRate * testWork;
    const pwrGain = powerRequired - testPwr;
    if (pwrGain > 0) opts.push({ delta: pwrGain / 10000, text: `AI Insight: Lowering inlet temp to 20°C (293K) increases density, saving ${Math.round(pwrGain/1000)} kW of power.`});
  }

  opts.sort((a, b) => b.delta - a.delta);
  let recommendation = opts.length > 0 ? opts[0].text : "Your parameters look optimal for this condition.";
  return {
    efficiency: Math.round(correctedEfficiency * 100 * 100) / 100,
    powerOutput: Math.round(powerRequired * 100) / 100, // Power consumed
    specificResults: {
      pressureRatio: Math.round(pressureRatio * 100) / 100,
      stageRatio: Math.round(stageRatio * 100) / 100,
      idealExitTemp: Math.round(t2Ideal * 100) / 100,
      actualExitTemp: Math.round(t2Actual * 100) / 100,
      idealWork: Math.round(idealWork * 100) / 100,
      actualWork: Math.round(actualWork * 100) / 100,
      powerRequiredKW: Math.round(powerRequired / 1000 * 100) / 100,
      surgeMargin: Math.round(surgeMargin * 100) / 100,
      isentropicEfficiency: Math.round(correctedEfficiency * 10000) / 10000,
          aiRecommendation: recommendation
    },
    calculationSteps: steps,
  };
}

// =============================================
// Get default parameters for a machine type
// (for the frontend to pre-fill forms)
// =============================================

function getDefaultParameters(machineType) {
  const defaults = {
    WIND_TURBINE: {
      bladeCount: 3,
      rotorDiameter: 80,
      windSpeed: 10,
      pitchAngle: 0,
      airDensity: 1.225,
      tipSpeedRatio: 7,
      generatorEfficiency: 0.95,
    },
    STEAM_TURBINE: {
      inletPressure: 165,
      inletTemperature: 540,
      condenserPressure: 0.045,
      massFlowRate: 200,
      isentropicEfficiency: 0.88,
      mechanicalEfficiency: 0.98,
      generatorEfficiency: 0.97,
      numberOfStages: 4,
    },
    GAS_TURBINE: {
      compressorPressureRatio: 15,
      inletTemperature: 288,
      turbineInletTemp: 1500,
      airMassFlow: 50,
      compressorEfficiency: 0.87,
      turbineEfficiency: 0.90,
      combustionEfficiency: 0.99,
      gamma: 1.4,
      cpAir: 1005,
    },
    HYDRO_TURBINE: {
      waterHead: 150,
      flowRate: 50,
      guideVaneOpening: 85,
      runnerDiameter: 3,
      bladeCount: 13,
      turbineType: 'francis',
      waterDensity: 997,
      gravity: 9.81,
    },
    MOTOR: {
      ratedPower: 75,
      supplyVoltage: 400,
      loadPercent: 100,
      statorResistance: 0.5,
      rotorResistance: 0.3,
      coreFluxDensity: 1.2,
      speed: 1485,
      synchronousSpeed: 1500,
      powerFactor: 0.85,
    },
    GENERATOR: {
      ratedPowerMVA: 50,
      terminalVoltage: 11,
      powerFactor: 0.85,
      loadPercent: 100,
      excitationCurrent: 120,
      statorResistance: 0.01,
      fieldResistance: 5.0,
      speed: 1500,
      poles: 4,
    },
    PUMP: {
      impellerDiameter: 250,
      speed: 2950,
      flowRate: 250,
      suctionPressure: 1.5,
      dischargePressure: 10,
      fluidDensity: 997,
      numberOfVanes: 6,
      impellerWidth: 30,
    },
    COMPRESSOR: {
      inletPressure: 1.0,
      dischargePressure: 8.0,
      inletTemperature: 293,
      massFlowRate: 5.5,
      speed: 10500,
      gamma: 1.4,
      cpAir: 1005,
      numberOfStages: 1,
      isentropicEfficiency: 0.82,
    },
  };

  return defaults[machineType] || {};
}

/**
 * Get human-readable parameter info for the UI
 */
function getParameterInfo(machineType) {
  const info = {
    WIND_TURBINE: [
      { key: 'bladeCount', label: 'Number of Blades', min: 1, max: 6, step: 1, unit: '' },
      { key: 'rotorDiameter', label: 'Rotor Diameter', min: 10, max: 250, step: 5, unit: 'm' },
      { key: 'windSpeed', label: 'Wind Speed', min: 3, max: 25, step: 0.5, unit: 'm/s' },
      { key: 'pitchAngle', label: 'Blade Pitch Angle', min: 0, max: 30, step: 0.5, unit: '°' },
      { key: 'airDensity', label: 'Air Density', min: 0.9, max: 1.4, step: 0.025, unit: 'kg/m³' },
      { key: 'tipSpeedRatio', label: 'Tip Speed Ratio (λ)', min: 1, max: 12, step: 0.5, unit: '' },
      { key: 'generatorEfficiency', label: 'Generator Efficiency', min: 0.8, max: 0.99, step: 0.01, unit: '' },
    ],
    STEAM_TURBINE: [
      { key: 'inletPressure', label: 'Inlet Steam Pressure', min: 50, max: 300, step: 5, unit: 'bar' },
      { key: 'inletTemperature', label: 'Inlet Steam Temperature', min: 400, max: 700, step: 10, unit: '°C' },
      { key: 'condenserPressure', label: 'Condenser Pressure', min: 0.03, max: 0.1, step: 0.005, unit: 'bar' },
      { key: 'massFlowRate', label: 'Mass Flow Rate', min: 50, max: 500, step: 10, unit: 'kg/s' },
      { key: 'numberOfStages', label: 'Number of Stages', min: 1, max: 8, step: 1, unit: '' },
      { key: 'isentropicEfficiency', label: 'Isentropic Efficiency', min: 0.7, max: 0.95, step: 0.01, unit: '' },
    ],
    GAS_TURBINE: [
      { key: 'compressorPressureRatio', label: 'Compressor Pressure Ratio', min: 5, max: 40, step: 1, unit: '' },
      { key: 'inletTemperature', label: 'Inlet Air Temperature', min: 260, max: 320, step: 5, unit: 'K' },
      { key: 'turbineInletTemp', label: 'Turbine Inlet Temperature', min: 1000, max: 2000, step: 50, unit: 'K' },
      { key: 'airMassFlow', label: 'Air Mass Flow', min: 10, max: 200, step: 5, unit: 'kg/s' },
      { key: 'compressorEfficiency', label: 'Compressor Efficiency', min: 0.7, max: 0.95, step: 0.01, unit: '' },
      { key: 'turbineEfficiency', label: 'Turbine Efficiency', min: 0.7, max: 0.95, step: 0.01, unit: '' },
    ],
    HYDRO_TURBINE: [
      { key: 'waterHead', label: 'Water Head', min: 10, max: 500, step: 10, unit: 'm' },
      { key: 'flowRate', label: 'Flow Rate', min: 5, max: 200, step: 5, unit: 'm³/s' },
      { key: 'guideVaneOpening', label: 'Guide Vane Opening', min: 10, max: 100, step: 5, unit: '%' },
      { key: 'runnerDiameter', label: 'Runner Diameter', min: 0.5, max: 10, step: 0.5, unit: 'm' },
      { key: 'bladeCount', label: 'Number of Blades', min: 3, max: 25, step: 1, unit: '' },
      { key: 'turbineType', label: 'Turbine Type', options: ['francis', 'pelton', 'kaplan'], unit: '' },
    ],
    MOTOR: [
      { key: 'ratedPower', label: 'Rated Power', min: 1, max: 500, step: 5, unit: 'kW' },
      { key: 'supplyVoltage', label: 'Supply Voltage', min: 200, max: 690, step: 10, unit: 'V' },
      { key: 'loadPercent', label: 'Load', min: 10, max: 120, step: 5, unit: '%' },
      { key: 'statorResistance', label: 'Stator Resistance', min: 0.1, max: 2.0, step: 0.1, unit: 'Ω' },
      { key: 'rotorResistance', label: 'Rotor Resistance', min: 0.1, max: 1.5, step: 0.1, unit: 'Ω' },
      { key: 'speed', label: 'Rotor Speed', min: 500, max: 3000, step: 5, unit: 'RPM' },
      { key: 'powerFactor', label: 'Power Factor', min: 0.5, max: 1.0, step: 0.05, unit: '' },
    ],
    GENERATOR: [
      { key: 'ratedPowerMVA', label: 'Rated Power', min: 5, max: 500, step: 5, unit: 'MVA' },
      { key: 'terminalVoltage', label: 'Terminal Voltage', min: 3.3, max: 33, step: 0.5, unit: 'kV' },
      { key: 'powerFactor', label: 'Power Factor', min: 0.7, max: 1.0, step: 0.05, unit: '' },
      { key: 'loadPercent', label: 'Load', min: 10, max: 120, step: 5, unit: '%' },
      { key: 'excitationCurrent', label: 'Excitation Current', min: 50, max: 300, step: 10, unit: 'A' },
      { key: 'poles', label: 'Number of Poles', min: 2, max: 12, step: 2, unit: '' },
    ],
    PUMP: [
      { key: 'impellerDiameter', label: 'Impeller Diameter', min: 100, max: 500, step: 10, unit: 'mm' },
      { key: 'speed', label: 'Speed', min: 500, max: 3600, step: 50, unit: 'RPM' },
      { key: 'flowRate', label: 'Flow Rate', min: 10, max: 1000, step: 10, unit: 'm³/h' },
      { key: 'suctionPressure', label: 'Suction Pressure', min: 0.5, max: 5, step: 0.1, unit: 'bar' },
      { key: 'dischargePressure', label: 'Discharge Pressure', min: 2, max: 30, step: 0.5, unit: 'bar' },
      { key: 'numberOfVanes', label: 'Number of Vanes', min: 3, max: 12, step: 1, unit: '' },
    ],
    COMPRESSOR: [
      { key: 'inletPressure', label: 'Inlet Pressure', min: 0.8, max: 2, step: 0.1, unit: 'bar' },
      { key: 'dischargePressure', label: 'Discharge Pressure', min: 3, max: 20, step: 0.5, unit: 'bar' },
      { key: 'inletTemperature', label: 'Inlet Temperature', min: 260, max: 330, step: 5, unit: 'K' },
      { key: 'massFlowRate', label: 'Mass Flow Rate', min: 1, max: 20, step: 0.5, unit: 'kg/s' },
      { key: 'speed', label: 'Speed', min: 3000, max: 20000, step: 500, unit: 'RPM' },
      { key: 'numberOfStages', label: 'Number of Stages', min: 1, max: 6, step: 1, unit: '' },
      { key: 'isentropicEfficiency', label: 'Isentropic Efficiency', min: 0.65, max: 0.95, step: 0.01, unit: '' },
    ],
  };

  return info[machineType] || [];
}

module.exports = {
  runSimulation,
  getDefaultParameters,
  getParameterInfo,
};
