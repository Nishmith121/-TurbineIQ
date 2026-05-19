const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MultivariateLinearRegression } = require('ml-regression');

const dataPath = path.join(__dirname, '../../Turbine IQ dataset/gas_turbine/scada_data.csv');
const modelPath = path.join(__dirname, '../models/gas_ml_model.json');

const xData = [];
const yData = [];

console.log('Reading Gas Turbine SCADA data...');

fs.createReadStream(dataPath)
  .pipe(csv())
  .on('data', (row) => {
    // Inputs (X)
    const exhaustTemp = parseFloat(row.exhaust_temp_c);
    const fuelFlow = parseFloat(row.fuel_flow_kg_s);
    const compressorPressure = parseFloat(row.compressor_discharge_pressure_bar);
    
    // Outputs (Y)
    const activePower = parseFloat(row.active_power_mw);
    const vibration = parseFloat(row.vibration_mm_s);

    // Ensure valid numbers
    if (!isNaN(exhaustTemp) && !isNaN(fuelFlow) && !isNaN(compressorPressure) && !isNaN(activePower) && !isNaN(vibration)) {
      xData.push([exhaustTemp, fuelFlow, compressorPressure]);
      yData.push([activePower, vibration]);
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
