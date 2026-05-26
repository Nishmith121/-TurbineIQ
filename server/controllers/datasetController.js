const scaleModelBOM = require('../data/scaleModelBOM');
const researchPapers = require('../data/researchPapers');

const getComponents = (req, res) => {
  const machineTypeParam = req.params.machineType; // e.g., WIND_TURBINE

  const components = scaleModelBOM[machineTypeParam];
  
  if (!components) {
    return res.status(404).json({ success: false, error: 'No components found for this machine type', data: [] });
  }

  res.json({ success: true, data: components });
};

const getResearchPapers = (req, res) => {
  const machineTypeParam = req.params.machineType;
  
  const papers = researchPapers[machineTypeParam];
  
  if (!papers) {
    return res.status(404).json({ success: false, error: 'No research papers found for this machine type', data: [] });
  }

  res.json({ success: true, data: papers });
};

module.exports = { getComponents, getResearchPapers };
