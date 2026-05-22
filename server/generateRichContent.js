require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Using Flash as it is widely available

const machines = [
  { id: 'WIND_TURBINE', name: 'Wind Turbine', image: '/wind.png' },
  { id: 'STEAM_TURBINE', name: 'Steam Turbine', image: '/steam.png' },
  { id: 'GAS_TURBINE', name: 'Gas Turbine', image: '/gas.png' },
  { id: 'HYDRO_TURBINE', name: 'Hydro Turbine', image: '/hydro.png' },
  { id: 'MOTOR', name: 'Electric Motor', image: '/motor.png' },
  { id: 'GENERATOR', name: 'Generator', image: '/generator.png' },
  { id: 'PUMP', name: 'Water Pump', image: '/pump.png' }
];

const generatePrompt = (machineName) => {
  return `Write a highly comprehensive, textbook-style chapter (at least 1500 words) about ${machineName}.
  It must be formatted entirely in standard Markdown. DO NOT wrap it in JSON. Just output raw markdown.
  
  Include the following sections with deep technical depth, physics equations, and engineering principles:
  # Introduction to ${machineName}
  (A detailed overview of what it is and its history)
  
  ## How it Works
  (Deep dive into the mechanism of action)
  
  ## Key Components
  (List and explain every major component in detail)
  
  ## Types of ${machineName}s
  (Detailed explanation of the different variants, e.g., for wind: HAWT, VAWT, etc.)
  
  ## Physics and Equations
  (The fundamental thermodynamic, fluid dynamic, or electromagnetic formulas that govern it, like Betz Limit, Faraday's Law, etc.)
  
  ## How to Use this in Your Project
  (Practical advice for an engineering student on how to build, simulate, test, or validate a digital twin or physical model of this machine for a university project).
  `;
}

async function run() {
  console.log("Starting generation...");
  let finalFileContent = "export const MACHINE_CONTENT = {\n";

  for (const machine of machines) {
    console.log(`Generating content for ${machine.name}...`);
    try {
      const result = await model.generateContent(generatePrompt(machine.name));
      let content = await result.response.text();
      
      // Escape backticks inside the content so it doesn't break the template literal
      content = content.replace(/\`/g, "\\`");
      
      finalFileContent += `  ${machine.id}: {\n`;
      finalFileContent += `    title: "${machine.name} Fundamentals",\n`;
      finalFileContent += `    heroImage: "${machine.image}",\n`;
      finalFileContent += `    content: \`\n${content}\n\`\n`;
      finalFileContent += `  },\n`;
      console.log(`✅ Success for ${machine.name}`);
    } catch (e) {
      console.error(`❌ Failed for ${machine.name}:`, e.message);
    }
  }

  finalFileContent += "};\n";

  const outputPath = path.join(__dirname, '../client/src/data/machineContent.js');
  fs.writeFileSync(outputPath, finalFileContent);
  console.log(`\n🎉 All done! Saved to ${outputPath}`);
}

run();
