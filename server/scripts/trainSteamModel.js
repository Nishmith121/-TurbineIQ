const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MultivariateLinearRegression } = require('ml-regression');

const dataPath = path.join(__dirname, '../../Turbine IQ dataset/steam_turbine/scada_data.csv');
const modelPath = path.join(__dirname, '../models/steam_ml_model.json');

const xData = [];
const yData = [];

console.log('Reading Steam Turbine SCADA data...');

fs.createReadStream(dataPath)
  .pipe(csv())
  .on('data', (row) => {
    // Inputs (X)
    const inletPressure = parseFloat(row.inlet_steam_pressure_bar);
    const inletTemp = parseFloat(row.inlet_steam_temp_c);
    const condenserPressure = parseFloat(row.condenser_pressure_mbar);
    
    // Outputs (Y)
    const activePower = parseFloat(row.active_power_mw);
    const bearingVibration = parseFloat(row.bearing_vibration_um);

    // Ensure valid numbers
    if (!isNaN(inletPressure) && !isNaN(inletTemp) && !isNaN(condenserPressure) && !isNaN(activePower) && !isNaN(bearingVibration)) {
      xData.push([inletPressure, inletTemp, condenserPressure]);
      yData.push([activePower, bearingVibration]);
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
