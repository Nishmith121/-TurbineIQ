const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MultivariateLinearRegression } = require('ml-regression');

const dataPath = path.join(__dirname, '../../Turbine IQ dataset/wind_turbine/scada_data.csv');
const modelPath = path.join(__dirname, '../models/wind_ml_model.json');

const xData = [];
const yData = [];

console.log('Reading Wind Turbine SCADA data...');

fs.createReadStream(dataPath)
  .pipe(csv())
  .on('data', (row) => {
    // Inputs (X)
    const windSpeed = parseFloat(row.wind_speed_m_s);
    const pitchAngle = parseFloat(row.pitch_angle_deg);
    
    // Outputs (Y)
    const activePower = parseFloat(row.active_power_kw);
    const rotorSpeed = parseFloat(row.rotor_speed_rpm);

    // Ensure valid numbers
    if (!isNaN(windSpeed) && !isNaN(pitchAngle) && !isNaN(activePower) && !isNaN(rotorSpeed)) {
      xData.push([windSpeed, pitchAngle]);
      yData.push([activePower, rotorSpeed]);
    }
  })
  .on('end', () => {
    console.log(`Successfully loaded ${xData.length} records.`);
    console.log('Training Multivariate Linear Regression Model...');
    
    const mlr = new MultivariateLinearRegression(xData, yData);
    
    console.log('Training complete! Saving model...');
    
    // Save the trained model to JSON
    const modelJSON = mlr.toJSON();
    
    // Ensure models directory exists
    const modelsDir = path.dirname(modelPath);
    if (!fs.existsSync(modelsDir)){
        fs.mkdirSync(modelsDir, { recursive: true });
    }
    
    fs.writeFileSync(modelPath, JSON.stringify(modelJSON, null, 2));
    
    console.log(`Model successfully saved to ${modelPath}`);
  });
