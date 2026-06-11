# TurbineIQ 🚀

TurbineIQ is an advanced, AI-powered educational and engineering platform designed to bridge the gap between theoretical fluid dynamics and practical application. It acts as an end-to-end digital workspace for designing, simulating, and validating physical models like turbines, motors, pumps, and generators.

## Key Features

- **🧠 Interactive AI Tutor:** Integrated with Google's Gemini AI, users can ask complex engineering questions and get contextual, physics-based answers instantly.
- **🛠️ 3D Assembly & Virtual Builder:** A React Three Fiber-powered visualizer allowing users to assemble components in a premium, glassmorphism 3D space.
- **🔌 Live Hardware Integration:** Utilize the Web Serial API to connect Arduino and other microcontrollers directly via USB. Stream real-time sensor data into a live Chart.js oscilloscope running locally in the browser!
- **🔬 Simulated Testing:** For prototyping without physical hardware, the built-in simulation engine generates realistic data fluctuations based on theoretical machine parameters.
- **👁️ Gemini Vision Diagnostics:** Upload a photo of your physical 3D-printed or hand-built prototype. The Vision AI inspects build quality, cross-references it with live sensor data, and generates a comprehensive diagnostic report.
- **🛒 Sourcing Marketplace:** A dedicated marketplace feature to help engineers find and source the exact physical components required to build their digital twin.

## Tech Stack

- **Frontend:** React, Vite, Chart.js, React Three Fiber (3D), CSS Modules
- **Backend:** Node.js, Express
- **AI & Integrations:** Google Gemini AI (Vision & Text), Web Serial API
- **UI/UX:** Custom dark-mode engineering aesthetic with electric green accents and glassmorphism.

## Machine Learning & Datasets 📊

TurbineIQ utilizes custom-trained Machine Learning models to predict machine performance and optimize theoretical designs against real-world data.

- **The Dataset:** The platform is powered by the comprehensive `Turbine IQ dataset`, featuring thousands of SCADA data points across 8 distinct machine types (Wind, Gas, Hydro, Steam Turbines, Pumps, Generators, Compressors, and Motors).
- **Predictive Engine:** We use **Multivariate Linear Regression (`ml-regression`)** to train bespoke JSON models for each machine type. The models analyze input variables (e.g., wind speed, pitch angle, inlet pressure) and accurately predict output performance metrics (e.g., active power, efficiency).
- **Training Pipeline:** Dedicated training scripts (`trainWindModel.js`, `trainGasModel.js`, etc.) process the raw SCADA CSV files and generate optimized prediction models stored directly in the backend.

## Getting Started

1. **Clone the repository**
2. **Install dependencies:**
   - In the `/client` directory run `npm install`
   - In the `/server` directory run `npm install`
3. **Set up Environment Variables:**
   - Configure your Gemini API keys and database variables in the server's `.env` file.
4. **Run the App:**
   - Client: `npm run dev`
   - Server: `npm start`
   
Build, test, and validate with TurbineIQ!
