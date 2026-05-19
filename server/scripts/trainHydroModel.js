const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MultivariateLinearRegression } = require('ml-regression');

const dataPath = path.join(__dirname, '../../Turbine IQ dataset/hydro_turbine/scada_data.csv');
const modelPath = path.join(__dirname, '../models/hydro_ml_model.json');

const xData = [];
const yData = [];

console.log('Reading Hydro Turbine SCADA data...');

fs.createReadStream(dataPath)
  .pipe(csv())
  .on('data', (row) => {
    // Inputs (X)
    const waterHead = parseFloat(row.water_head_m);
    const flowRate = parseFloat(row.flow_rate_m3_s);
    const guideVane = parseFloat(row.guide_vane_opening_pct);
    
    // Outputs (Y)
    const activePower = parseFloat(row.active_power_mw);
    const draftPressure = parseFloat(row.draft_tube_pressure_bar);

    // Ensure valid numbers
    if (!isNaN(waterHead) && !isNaN(flowRate) && !isNaN(guideVane) && !isNaN(activePower) && !isNaN(draftPressure)) {
      xData.push([waterHead, flowRate, guideVane]);
      yData.push([activePower, draftPressure]);
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
