const scaleModelBOM = {
  WIND_TURBINE: [
    {
      id: "wind_1",
      category: "Energy Conversion",
      resourceName: "12V DC Hobby Motor / Generator",
      fileType: "Hardware",
      purpose: "Converts rotational mechanical energy into electrical energy.",
      link: "https://www.adafruit.com/product/711"
    },
    {
      id: "wind_2",
      category: "Aerodynamics",
      resourceName: "Carbon Fiber Propeller (10-inch)",
      fileType: "Hardware",
      purpose: "Provides high-efficiency wind capture.",
      link: "https://www.amazon.com/Carbon-Fiber-Propeller-Multicopter-Quadcopter/dp/B07RXYX8K3"
    },
    {
      id: "wind_3",
      category: "Structural",
      resourceName: "Steel Tower Base (24-inch)",
      fileType: "Hardware",
      purpose: "Forms the sturdy tower to elevate the rotor.",
      link: "https://www.mcmaster.com/structural-framing/aluminum-extrusions/"
    },
    {
      id: "wind_4",
      category: "Sensors",
      resourceName: "Arduino Anemometer Kit",
      fileType: "Electronics",
      purpose: "Measures real-time wind speed for SCADA data collection.",
      link: "https://www.sparkfun.com/products/8942"
    }
  ],
  STEAM_TURBINE: [
    {
      id: "steam_1",
      category: "Turbine Core",
      resourceName: "Steel Steam Turbine Rotor (Micro)",
      fileType: "Hardware",
      purpose: "Extracts kinetic energy from high-pressure steam.",
      link: "https://www.amazon.com/Micro-Steam-Turbine-Engine-Model/dp/B08BZ1Z7QJ"
    },
    {
      id: "steam_2",
      category: "Boiler System",
      resourceName: "Miniature Model Steam Boiler",
      fileType: "Hardware",
      purpose: "Generates high-pressure steam safely for testing.",
      link: "https://www.wilesco-shop.de/en/wilesco-steam-engines/"
    },
    {
      id: "steam_3",
      category: "Energy Conversion",
      resourceName: "High-RPM Mini DC Generator",
      fileType: "Electronics",
      purpose: "Converts the high-speed rotation into measurable voltage.",
      link: "https://www.amazon.com/Mini-Generator-Motors-3V-12V-Electric/dp/B073Q2Y3RC"
    },
    {
      id: "steam_4",
      category: "Sensors",
      resourceName: "Industrial Pressure Transducer",
      fileType: "Electronics",
      purpose: "Measures steam pressure at the inlet.",
      link: "https://www.sparkfun.com/products/16476"
    }
  ],
  GAS_TURBINE: [
    {
      id: "gas_1",
      category: "Turbine Core",
      resourceName: "JetCat P220-RX Micro Turbine Engine",
      fileType: "Hardware",
      purpose: "A real micro gas turbine for extreme scale testing.",
      link: "https://www.jetcatamericas.com/turbines/p220-rx"
    },
    {
      id: "gas_2",
      category: "Sensors",
      resourceName: "High-Temperature Thermocouple (K-Type)",
      fileType: "Electronics",
      purpose: "Measures Exhaust Gas Temperature (EGT) up to 1000°C.",
      link: "https://www.adafruit.com/product/269"
    },
    {
      id: "gas_3",
      category: "Control",
      resourceName: "Electronic Speed Controller (ESC)",
      fileType: "Electronics",
      purpose: "Manages the extremely high RPM of the compressor.",
      link: "https://hobbyking.com/en_us/power-systems/speed-controllers/brushless-esc.html"
    },
    {
      id: "gas_4",
      category: "Sensors",
      resourceName: "Mass Air Flow Sensor",
      fileType: "Electronics",
      purpose: "Measures the air intake flow rate.",
      link: "https://www.sparkfun.com/products/15443"
    }
  ],
  HYDRO_TURBINE: [
    {
      id: "hydro_1",
      category: "Turbine Core",
      resourceName: "Micro Hydroelectric Generator (12V/10W)",
      fileType: "Hardware",
      purpose: "Complete sealed unit for water flow energy extraction.",
      link: "https://www.amazon.com/Micro-Hydro-Generator-Hydroelectric-Water/dp/B07L5D9X8P"
    },
    {
      id: "hydro_2",
      category: "Fluid Dynamics",
      resourceName: "Submersible Water Pump (Simulated Head)",
      fileType: "Hardware",
      purpose: "Provides the required water pressure (Head) for testing.",
      link: "https://www.adafruit.com/product/1150"
    },
    {
      id: "hydro_3",
      category: "Sensors",
      resourceName: "Inline Water Flow Meter (Hall Effect)",
      fileType: "Electronics",
      purpose: "Measures volumetric flow rate (Q) for efficiency calculations.",
      link: "https://www.adafruit.com/product/828"
    },
    {
      id: "hydro_4",
      category: "Structural",
      resourceName: "Clear PVC Piping (Penstock)",
      fileType: "Hardware",
      purpose: "Allows visual observation of water flow into the turbine.",
      link: "https://www.mcmaster.com/clear-pvc-pipe/"
    }
  ],
  MOTOR: [
    {
      id: "motor_1",
      category: "Core Assembly",
      resourceName: "Brushless DC (BLDC) Motor Kit",
      fileType: "Hardware",
      purpose: "High-efficiency motor for mechatronics testing.",
      link: "https://grabcad.com/library?page=1&time=all_time&sort=recent&query=bldc%20motor"
    },
    {
      id: "motor_2",
      category: "Control",
      resourceName: "L298N Motor Driver / ESC",
      fileType: "Electronics",
      purpose: "Controls the voltage and current supplied to the motor.",
      link: "https://www.sparkfun.com/products/14450"
    },
    {
      id: "motor_3",
      category: "Sensors",
      resourceName: "Optical Encoder (RPM Sensor)",
      fileType: "Electronics",
      purpose: "Provides precise RPM feedback for load testing.",
      link: "https://www.adafruit.com/product/3782"
    }
  ],
  GENERATOR: [
    {
      id: "gen_1",
      category: "Core Assembly",
      resourceName: "Synchronous AC Generator Model",
      fileType: "STL / CAD",
      purpose: "Demonstrates 3-phase AC power generation.",
      link: "https://grabcad.com/library?page=1&time=all_time&sort=recent&query=synchronous%20generator"
    },
    {
      id: "gen_2",
      category: "Electrical",
      resourceName: "3-Phase Bridge Rectifier",
      fileType: "Electronics",
      purpose: "Converts the raw AC output into usable DC power.",
      link: "https://www.amazon.com/3-Phase-Bridge-Rectifier/s?k=3-Phase+Bridge+Rectifier"
    },
    {
      id: "gen_3",
      category: "Testing",
      resourceName: "Variable Resistor Load Bank",
      fileType: "Electronics",
      purpose: "Simulates electrical grid load to test generator efficiency.",
      link: "https://www.sparkfun.com/products/13123"
    }
  ],
  PUMP: [
    {
      id: "pump_1",
      category: "Core Assembly",
      resourceName: "Centrifugal Pump Impeller CAD",
      fileType: "STL / CAD",
      purpose: "3D printable impeller to move fluid radially.",
      link: "https://grabcad.com/library?page=1&time=all_time&sort=recent&query=centrifugal%20pump%20impeller"
    },
    {
      id: "pump_2",
      category: "Sensors",
      resourceName: "Fluid Pressure Transducer",
      fileType: "Electronics",
      purpose: "Measures pump inlet and discharge pressure (Head).",
      link: "https://www.sparkfun.com/products/16476"
    },
    {
      id: "pump_3",
      category: "Sealing",
      resourceName: "Mechanical Shaft Seal",
      fileType: "Hardware",
      purpose: "Prevents high-pressure fluid from leaking into the motor.",
      link: "https://www.mcmaster.com/mechanical-seals/"
    }
  ]
};

module.exports = scaleModelBOM;
