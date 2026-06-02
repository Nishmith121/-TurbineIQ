export const MACHINE_CONTENT = {
  WIND_TURBINE: {
    title: "Wind Turbine Engineering Guide",
    heroImage: "/wind.png",
    content: `
# 1. Introduction to Wind Energy
Wind turbines operate on a simple principle: instead of using electricity to make wind—like a fan—wind turbines use wind to make electricity. The wind turns the propeller-like blades of a turbine around a rotor, which spins a generator, which creates electricity. Wind is a form of solar energy caused by a combination of three concurrent events: The sun unevenly heating the atmosphere, irregularities of the earth's surface, and the rotation of the earth.

## History of Wind Power
Since early recorded history, people have harnessed the energy of the wind. Wind energy propelled boats along the Nile River as early as 5000 B.C. By 200 B.C., simple windmills in China were pumping water, while vertical-axis windmills with woven reed sails were grinding grain in Persia and the Middle East. Today, we build massive megawatt-scale turbines that power entire cities.

# 2. How it Works
When the wind blows, a pocket of low-pressure air forms on the downwind side of the blade. The low-pressure air pocket then pulls the blade toward it, causing the rotor to turn. This is called **aerodynamic lift**. The force of the lift is actually much stronger than the wind's force against the front side of the blade, which is called **drag**. The combination of lift and drag causes the rotor to spin like a propeller.

# 3. Key Components
1. **Rotor Blades:** Usually made of fiberglass or carbon fiber. They are aerodynamically designed to capture wind energy.
2. **Nacelle:** The massive housing at the top of the tower. It contains the gearbox, low- and high-speed shafts, generator, controller, and brake.
3. **Gearbox:** Connects the low-speed shaft to the high-speed shaft and increases the rotational speeds from about 30-60 rotations per minute (rpm) to about 1000-1800 rpm, the rotational speed required by most generators to produce electricity.
4. **Generator:** Produces 60-cycle AC electricity.
5. **Pitch System:** Turns blades out of the wind to control the rotor speed and keep the turbine from turning in winds that are too high or too low.
6. **Yaw Drive:** Used to keep the rotor facing into the wind as the wind direction changes.
7. **Anemometer:** Measures the wind speed and transmits wind speed data to the controller.

# 4. Types of Wind Turbines
There are two basic types of wind turbines:
- **Horizontal-Axis Wind Turbines (HAWT):** These are what many people picture when thinking of wind turbines. They look like airplanes without wings or propellers, and they have blades that spin in a vertical plane. Most have three blades.
- **Vertical-Axis Wind Turbines (VAWT):** These are omnidirectional, meaning they don’t need to be pointed into the wind to operate. Examples include the Darrieus (eggbeater) and Savonius models.

# 5. Physics and Equations
The fundamental limit to how much energy can be extracted from the wind is defined by the **Betz Limit**.
No wind turbine can capture 100% of the kinetic energy in the wind. According to the Betz limit, the maximum theoretical efficiency of a wind turbine is **59.3%**. Modern utility-scale wind turbines achieve peak efficiency around 45% to 50%.

The power available in the wind is given by the formula:
**P = ½ ρ A V³**
Where:
- **P** = Power (Watts)
- **ρ** (rho) = Air density (approx. 1.225 kg/m³ at sea level)
- **A** = Swept area of the rotor (πr²)
- **V** = Wind velocity (m/s)

**Takeaway:** This shows that wind power is proportional to the **cube** of the wind speed. If the wind speed doubles, the available power increases by a factor of eight!

# 6. How to Use this in Your Project
If you are an engineering student building a physical model or a digital twin of a wind turbine, you should focus on the following parameters:
- **Blade Design:** Use airfoil profiles (like NACA profiles) to optimize the lift-to-drag ratio. When building your digital twin in TurbineIQ, you can adjust the blade pitch angle to see how it affects power output at different wind speeds.
- **Sensor Integration:** If building a physical model, attach an RPM sensor (like a Hall effect sensor) to the shaft and a voltage/current sensor to the generator output. You can then upload these readings to the **Test Real Model** tab to compare your actual efficiency against the Betz limit!
- **Data Validation:** Collect wind speed data (using an anemometer) alongside your power output. Map your power curve (Power vs Wind Speed) and use our AI to diagnose if your gearbox has too much mechanical friction or if your generator is experiencing electrical losses.
    `
  },
  STEAM_TURBINE: {
    title: "Steam Turbine Engineering Guide",
    heroImage: "/steam.png",
    content: `
# 1. Introduction to Steam Turbines
A steam turbine is a device that extracts thermal energy from pressurized steam and uses it to do mechanical work on a rotating output shaft. Because the turbine generates rotary motion, it is particularly suited to be used to drive an electrical generator. Over 80% of all electricity generation in the world is generated by use of steam turbines!

# 2. How it Works
High-pressure, high-temperature steam from a boiler is directed through stationary nozzles. The nozzles accelerate the steam to high velocity, converting its thermal energy (enthalpy) into kinetic energy. This high-speed steam jet impacts the curved blades attached to the turbine rotor, forcing the rotor to spin.

# 3. Key Components
1. **Rotor:** The rotating shaft with attached blades. It is precision-machined to withstand massive centrifugal forces.
2. **Stator / Casing:** Contains stationary blades (nozzles) that direct the steam onto the rotor at the perfect angle.
3. **Governor:** A critical control system that regulates the speed of the turbine by controlling the steam flow valves.
4. **Condenser:** Cools the exhaust steam back into liquid water to be pumped back to the boiler, creating a vacuum that increases efficiency.

# 4. Types of Steam Turbines
- **Impulse Turbines:** The steam jets hit bucket-shaped blades. The pressure drop occurs entirely in the stationary nozzles, and the moving blades simply absorb the kinetic energy (e.g., de Laval turbine).
- **Reaction Turbines:** Both the stationary and moving blades act as nozzles. The steam expands and drops in pressure as it moves through the rotating blades, generating a reactive force (like a rocket). Most modern utility turbines use a combination of impulse (high pressure stages) and reaction (low pressure stages) blades.

# 5. Physics and Equations
The ideal efficiency of a steam turbine cycle (Rankine Cycle) is highly dependent on the temperature difference between the hot steam entering and the cold condenser.

The work extracted per unit mass of steam can be approximated by the change in enthalpy:
**W = m(h1 - h2)**
Where:
- **W** = Work (Joules)
- **m** = Mass flow rate of steam (kg/s)
- **h1** = Specific enthalpy of steam entering (J/kg)
- **h2** = Specific enthalpy of steam exiting (J/kg)

# 6. How to Use this in Your Project
For students working on steam or thermodynamic cycles:
- **Digital Twin:** Focus on inputting accurate steam inlet temperatures and pressures. You can simulate the effect of adding a reheat stage or lowering condenser pressure.
- **Testing:** If you are running a miniature steam model, measure the boiler pressure and the RPM of the shaft. Compare the theoretical power output from your steam tables against your actual mechanical output. Use TurbineIQ to identify if your heat losses are coming from the casing or from blade tip leakage!
    `
  },
  GAS_TURBINE: {
    title: "Gas Turbine Engineering Guide",
    heroImage: "/gas.png",
    content: `
# 1. Introduction to Gas Turbines
A gas turbine, also called a combustion turbine, is a type of continuous and internal combustion engine. The main elements common to all gas turbine engines are an upstream, rotating gas compressor, a combustor, and a downstream turbine on the same shaft as the compressor. They are widely used in aviation (jet engines) and power generation.

# 2. How it Works (The Brayton Cycle)
Gas turbines operate on the Brayton cycle, which consists of three main steps:
1. **Compression:** Ambient air is drawn in and compressed to a high pressure (often 20 to 40 times atmospheric pressure).
2. **Combustion:** Fuel is injected into the highly compressed, hot air and ignited. This rapidly heats the air and drastically increases its volume and velocity.
3. **Expansion:** The high-energy, high-velocity exhaust gases expand through the turbine section, spinning the blades. The turbine provides the power to drive the compressor and the remaining power drives a generator or provides thrust.

# 3. Key Components
1. **Compressor:** Usually an axial flow compressor with multiple stages of rotating blades and stationary stators.
2. **Combustor (Combustion Chamber):** Mixes air with fuel and burns it efficiently while managing extreme temperatures.
3. **Turbine:** Extracts energy from the hot, expanding gases. The blades are often internally cooled with air because the gas temperatures exceed the melting point of the blade metal!
4. **Shaft:** Connects the turbine to the compressor (and usually a generator).

# 4. Types of Gas Turbines
- **Turbojet:** All thrust is produced by the exhaust gases. Used in older high-speed aircraft.
- **Turbofan:** Most of the thrust comes from a large fan at the front driven by the turbine. Highly efficient for commercial airliners.
- **Turboshaft:** Optimized to produce shaft power rather than thrust. Used in helicopters and power plants.

# 5. Physics and Equations
The thermal efficiency of the ideal Brayton cycle depends heavily on the pressure ratio (r_p):
**η = 1 - (1 / r_p)^((γ-1)/γ)**
Where:
- **η** = Thermal efficiency
- **r_p** = Pressure ratio (Pressure after compression / Pressure before)
- **γ** = Heat capacity ratio for air (approx. 1.4)

# 6. How to Use this in Your Project
For aerospace or mechanical engineering projects:
- **Digital Twin:** Model the pressure ratio and turbine inlet temperature (TIT). Increasing TIT drastically improves efficiency but requires advanced materials. You can simulate the trade-offs in TurbineIQ.
- **Testing:** If you have data from a micro-turbine (like an RC jet engine), input your EGT (Exhaust Gas Temperature) and compressor RPM into the "Test Real Model" section to calculate your actual compressor isentropic efficiency.
    `
  },
  HYDRO_TURBINE: {
    title: "Hydro Turbine Engineering Guide",
    heroImage: "/hydro.png",
    content: `
# 1. Introduction to Hydro Turbines
Hydroelectric power is generated by using the gravitational potential energy of falling or flowing water to spin a turbine, which in turn spins a generator. It is one of the oldest and largest forms of renewable energy in the world.

# 2. How it Works
Water held in a reservoir behind a dam possesses massive potential energy. When released, it flows down a large pipe called a penstock, converting potential energy into kinetic energy and pressure. At the bottom of the penstock, the fast-flowing water strikes the blades of a turbine, causing it to spin. 

# 3. Key Components
1. **Penstock:** The pipe delivering high-pressure water to the turbine.
2. **Runner:** The rotating part of the turbine with blades or buckets that extract energy from the water.
3. **Draft Tube:** A widening pipe at the exit of a reaction turbine that slows the water down and recovers pressure head, improving efficiency.
4. **Wicket Gates:** Adjustable vanes that control the flow of water into the turbine and direct it at the optimal angle.

# 4. Types of Hydro Turbines
Choosing the right hydro turbine depends entirely on the "Head" (height of falling water) and "Flow" (volume of water).
- **Pelton Wheel:** Used for high head (high elevation drop) and low flow. It is an impulse turbine where water jets strike cup-shaped buckets.
- **Francis Turbine:** Used for medium head and medium flow. It is a reaction turbine where water enters radially and exits axially. It is the most common turbine in use today (e.g., Hoover Dam).
- **Kaplan Turbine:** Used for low head and high flow. It looks like a ship's propeller and has adjustable blades to maintain efficiency across different flow rates.

# 5. Physics and Equations
The theoretical power available from falling water is straightforward fluid mechanics:
**P = η ρ g Q H**
Where:
- **P** = Power output (Watts)
- **η** = Turbine efficiency (typically very high, 85-95%)
- **ρ** = Density of water (1000 kg/m³)
- **g** = Acceleration due to gravity (9.81 m/s²)
- **Q** = Volumetric Flow rate (m³/s)
- **H** = Net head (height difference in meters minus friction losses in the penstock)

# 6. How to Use this in Your Project
For fluid dynamics or civil engineering students:
- **Digital Twin:** Input your Head (H) and Flow (Q) to let TurbineIQ recommend whether you should be building a Pelton, Francis, or Kaplan model. 
- **Testing:** Build a 3D-printed Pelton wheel and test it with a garden hose or lab pump. Measure the flow rate (bucket test) and RPM. Upload the data to TurbineIQ to see if your bucket geometry is causing splash-back losses (reducing efficiency)!
    `
  },
  MOTOR: {
    title: "Electric Motor Engineering Guide",
    heroImage: "/motor.png",
    content: `
# 1. Introduction to Electric Motors
An electric motor is an electrical machine that converts electrical energy into mechanical energy. From the tiny vibration motors in our smartphones to the massive traction motors in electric vehicles and locomotives, motors run the modern world.

# 2. How it Works
When a current-carrying conductor is placed in a magnetic field, it experiences a mechanical force (the Lorentz force). In a standard DC motor, the interaction between a stationary magnetic field (stator) and an electromagnet on the rotating part (rotor) causes the rotor to spin. A commutator or electronic controller constantly switches the current direction so the rotor keeps spinning instead of just aligning with the magnetic field and stopping.

# 3. Key Components
1. **Stator:** The stationary part that creates a magnetic field (using permanent magnets or electromagnets).
2. **Rotor (Armature):** The rotating part containing coils of wire.
3. **Commutator & Brushes (in brushed DC):** Reverses the current direction mechanically.
4. **Inverter/Controller (in brushless AC/DC):** Reverses the current electronically for higher efficiency and less wear.
5. **Bearings:** Support the rotor shaft and allow it to spin with minimal friction.

# 4. Types of Motors
- **AC Induction Motors:** The workhorse of industry. Invented by Nikola Tesla, they use alternating current to induce a rotating magnetic field in the stator, which drags the rotor along. Very reliable since there are no brushes.
- **Brushed DC Motors:** Simple, cheap, and easy to control. Used in toys and basic electronics.
- **Brushless DC (BLDC) / Permanent Magnet Synchronous Motors:** Used in drones, EVs, and high-end robotics. They require a complex electronic speed controller (ESC) but offer incredible power density and efficiency.

# 5. Physics and Equations
The torque generated by a motor is proportional to the magnetic field strength and the current:
**τ = K * I * B**
Where:
- **τ** = Torque (Nm)
- **K** = Motor constant (depends on geometry and winding)
- **I** = Current (Amperes)
- **B** = Magnetic field strength (Tesla)

**Back EMF:** As the motor spins, it acts as a generator and creates a voltage that opposes the supply voltage.
**V_supply = V_backEMF + (I * R_winding)**

# 6. How to Use this in Your Project
For electrical and mechatronics students:
- **Digital Twin:** Model the winding resistance, inductance, and kV rating (RPM per Volt). See how changing the voltage affects the torque curve.
- **Testing:** Connect your motor to a dynamometer or a known mechanical load. Measure the Input Voltage/Current and Output RPM/Torque. TurbineIQ will calculate your copper losses (I²R heating) and iron losses (eddy currents) and tell you why your motor is getting so hot!
    `
  },
  GENERATOR: {
    title: "Electrical Generator Engineering Guide",
    heroImage: "/generator.png",
    content: `
# 1. Introduction to Generators
An electric generator is a device that converts motive power (mechanical energy) into electrical power for use in an external circuit. It works on the exact opposite principle of an electric motor. Without generators, the entire electrical grid would not exist.

# 2. How it Works
Generators operate on Michael Faraday's principle of **electromagnetic induction**. When a conductor (like a copper wire) moves through a magnetic field, an electric current is induced in the wire. In a commercial generator, a prime mover (like a steam turbine, wind turbine, or diesel engine) rotates a shaft. This shaft spins a large coil of wire inside a powerful magnetic field (or spins a magnetic field inside a stationary coil), inducing a voltage.

# 3. Key Components
1. **Prime Mover:** The mechanical source of energy (e.g., the turbine shaft).
2. **Stator:** The stationary component containing coils where the output current is induced (in large AC generators, the output is taken from the stator so moving contacts aren't needed for high voltage).
3. **Rotor:** The spinning component that creates a moving magnetic field. In large power plants, the rotor uses an "exciter" electromagnet rather than permanent magnets.
4. **Voltage Regulator:** Controls the excitation current in the rotor to keep the output voltage stable regardless of the electrical load.

# 4. Types of Generators
- **Synchronous Generators (Alternators):** The standard for the global power grid. The rotor spins at the exact same frequency as the electrical grid (e.g., 60 Hz or 3600 RPM).
- **Induction Generators:** Often used in smaller wind turbines. They can run at variable speeds and draw their excitation from the grid.
- **DC Generators (Dynamos):** Produce direct current using a commutator. Mostly obsolete for power generation today, replaced by alternators with rectifiers.

# 5. Physics and Equations
According to Faraday's Law of Induction, the induced electromotive force (EMF) is proportional to the rate of change of magnetic flux:
**ε = -N (dΦ/dt)**
Where:
- **ε** = Induced Voltage (EMF)
- **N** = Number of turns in the coil
- **Φ** = Magnetic flux (Tesla * m²)
- **t** = Time

# 6. How to Use this in Your Project
For power systems projects:
- **Digital Twin:** Model the number of poles, coil turns, and magnetic field strength. Calculate the expected voltage at different RPMs.
- **Testing:** Spin your generator with a drill or a small motor and connect it to a resistor bank (load). Measure the mechanical torque required to spin it versus the electrical power (V*I) produced. TurbineIQ will help you map out your efficiency curve and identify magnetic hysteresis losses!
    `
  },
  PUMP: {
    title: "Water Pump Engineering Guide",
    heroImage: "/pump.png",
    content: `
# 1. Introduction to Water Pumps
A pump is a mechanical device used to move fluids (liquids or gases) from a low-pressure area to a high-pressure area. They consume mechanical energy (usually from an electric motor) to increase the pressure and flow of the fluid. Pumps are the second most common machine in the world, right after electric motors!

# 2. How it Works
Pumps can be broadly classified into two main categories: Dynamic and Positive Displacement.
In a dynamic pump (like a centrifugal pump), a rotating impeller adds kinetic energy to the fluid. As the fluid is thrown outward by centrifugal force, it enters a volute casing which progressively widens, slowing the fluid down. According to Bernoulli's principle, this decrease in velocity results in an increase in pressure.

# 3. Key Components (Centrifugal)
1. **Impeller:** The rotating component equipped with vanes that accelerates the fluid radially outward.
2. **Volute / Casing:** The spiral-shaped housing that collects the high-speed fluid and converts velocity into pressure.
3. **Shaft:** Connects the electric motor to the impeller.
4. **Mechanical Seal:** A critical component that prevents the high-pressure fluid from leaking out along the spinning shaft.
5. **Suction & Discharge Flanges:** Where the piping connects to the pump.

# 4. Types of Pumps
- **Centrifugal Pumps:** The most common industrial pumps. Great for high flow rates and low-viscosity fluids (water). Includes end-suction, split-case, and multistage pumps.
- **Positive Displacement Pumps:** Trap a fixed volume of fluid and physically push it through the discharge pipe. Excellent for high pressures and highly viscous fluids (oil, syrup). Examples include gear pumps, piston pumps, and peristaltic pumps.
- **Axial Flow Pumps:** Act like a propeller in a pipe, used for extremely high flow rates at very low pressures (e.g., flood control).

# 5. Physics and Equations
The hydraulic power transferred to the fluid by a pump is determined by the flow rate and the pressure (head) increase:
**P_h = ρ g Q H**
Where:
- **P_h** = Hydraulic power (Watts)
- **ρ** = Fluid density (kg/m³) (Water = 1000 kg/m³)
- **g** = Gravity (9.81 m/s²)
- **Q** = Volumetric Flow rate (m³/s)
- **H** = Total dynamic head (meters) - the total equivalent height the pump must lift the fluid, including friction losses.

The actual electrical power required from the motor is **P_motor = P_h / η**, where η is the pump's overall efficiency.

**Cavitation:** If the pressure at the pump inlet drops too low (below the vapor pressure of the fluid), the liquid will boil and form bubbles. When these bubbles reach high pressure, they collapse violently, destroying the impeller. This is dictated by the Net Positive Suction Head (NPSH).

# 6. How to Use this in Your Project
For fluid mechanics and process engineering projects:
- **Digital Twin:** Input your system curve (the piping friction) and plot it against the pump curve to find the **Best Efficiency Point (BEP)**. 
- **Testing:** If you have a physical pump rig, install pressure gauges on the suction and discharge, and a flow meter. Compare your actual pump curve to the manufacturer's curve in TurbineIQ. Our AI diagnostic tool can analyze your data to tell you if you are experiencing cavitation, internal recirculation, or wear ring leakage!
    `
  }
};
