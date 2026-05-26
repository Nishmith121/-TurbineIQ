const engine = require('./simulationEngine.js');

const tests = [
  { name: 'Optimal', params: { windSpeed: 10, pitchAngle: 0, tipSpeedRatio: 7, rotorDiameter: 80 } },
  { name: 'Bad Pitch', params: { windSpeed: 10, pitchAngle: 15, tipSpeedRatio: 7, rotorDiameter: 80 } },
  { name: 'Bad TSR', params: { windSpeed: 10, pitchAngle: 0, tipSpeedRatio: 3, rotorDiameter: 80 } },
  { name: 'Both Bad', params: { windSpeed: 10, pitchAngle: 15, tipSpeedRatio: 3, rotorDiameter: 80 } },
  { name: 'Empty / Zero', params: { windSpeed: '', pitchAngle: '', tipSpeedRatio: '', rotorDiameter: '' } }
];

for (const test of tests) {
  const result = engine.runSimulation('WIND_TURBINE', test.params);
  console.log(`\n=== Test: ${test.name} ===`);
  console.log(`Inputs: ${JSON.stringify(test.params)}`);
  console.log(`Power: ${result.powerOutput} W | Eff: ${result.efficiency}%`);
  console.log(`Recommendation: ${result.specificResults.aiRecommendation}`);
}
