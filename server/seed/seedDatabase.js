// ============================================
// Database Seeder — Loads CSV dataset into
// PostgreSQL (Prisma) and MongoDB (Mongoose)
// ============================================

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');
const mongoose = require('mongoose');
const SensorReading = require('../models/SensorReading');

const prisma = new PrismaClient();

const DATASET_PATH = process.env.DATASET_PATH || path.join(__dirname, '..', 'data');

// =============================================
// CSV PARSER HELPER
// =============================================

function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`);
      resolve([]);
      return;
    }
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

// =============================================
// MACHINE TYPE MAPPINGS
// =============================================

const MACHINE_FOLDERS = {
  wind_turbine: 'wind_turbine',
  steam_turbine: 'steam_turbine',
  gas_turbine: 'gas_turbine',
  hydro_turbine: 'hydro_turbine',
  motor: 'motor',
  generator: 'generator',
  pump: 'pump',
  compressor: 'compressor',
};

const MACHINE_TYPE_ENUM = {
  wind_turbine: 'WIND_TURBINE',
  steam_turbine: 'STEAM_TURBINE',
  gas_turbine: 'GAS_TURBINE',
  hydro_turbine: 'HYDRO_TURBINE',
  motor: 'MOTOR',
  generator: 'GENERATOR',
  pump: 'PUMP',
  compressor: 'COMPRESSOR',
};

// =============================================
// SEED FUNCTIONS
// =============================================

/**
 * Seed the master resource links from TurbineIQ_Data_Pack.csv
 */
async function seedResourceLinks() {
  console.log('\n📦 Seeding Resource Links...');

  const masterFile = path.join(DATASET_PATH, 'TurbineIQ_Data_Pack.csv');
  const rows = await parseCSV(masterFile);

  if (rows.length === 0) {
    console.warn('⚠️ No data in TurbineIQ_Data_Pack.csv');
    return;
  }

  // Clear existing data
  await prisma.resourceLink.deleteMany();

  const data = rows
    .filter(row => row['Machine Type'] && row['Resource Name'])
    .map(row => ({
      machineType: row['Machine Type'] || '',
      resourceName: row['Resource Name'] || '',
      directLink: row['Direct Download Link'] || '',
      fileType: row['File Type'] || null,
      category: row['Category'] || null,
      priority: row['Priority'] ? parseInt(row['Priority']) : null,
      folder: row['Folder to Save'] || null,
      pgTable: row['PostgreSQL Table'] || null,
      purpose: row['Purpose in TurbineIQ'] || null,
    }));

  if (data.length > 0) {
    await prisma.resourceLink.createMany({ data });
    console.log(`✅ Inserted ${data.length} resource links`);
  }
}

/**
 * Seed manufacturers and models for each machine type
 */
async function seedManufacturers() {
  console.log('\n🏭 Seeding Manufacturers & Models...');

  await prisma.machineCatalog.deleteMany();
  let totalInserted = 0;

  for (const [machineKey, folder] of Object.entries(MACHINE_FOLDERS)) {
    const filePath = path.join(DATASET_PATH, folder, 'manufacturers_and_models.csv');
    const rows = await parseCSV(filePath);

    if (rows.length === 0) continue;

    const data = rows
      .filter(row => row['Manufacturer'])
      .map(row => ({
        machineType: MACHINE_TYPE_ENUM[machineKey],
        manufacturer: row['Manufacturer'] || '',
        modelName: row['Model_Name'] || '',
        type: row['Type'] || null,
        capacity: row['Capacity_or_Rating'] || null,
        keyFeatures: row['Key_Features'] || null,
      }));

    if (data.length > 0) {
      await prisma.machineCatalog.createMany({ data });
      totalInserted += data.length;
      console.log(`  ✅ ${machineKey}: ${data.length} models`);
    }
  }

  console.log(`✅ Total manufacturers/models inserted: ${totalInserted}`);
}

/**
 * Seed CAD model links for each machine type
 */
async function seedCadModels() {
  console.log('\n🔩 Seeding CAD Models...');

  await prisma.cadModel.deleteMany();
  let totalInserted = 0;

  for (const [machineKey, folder] of Object.entries(MACHINE_FOLDERS)) {
    const filePath = path.join(DATASET_PATH, folder, 'cad_models.csv');
    const rows = await parseCSV(filePath);

    if (rows.length === 0) continue;

    const data = rows
      .filter(row => row['Component'])
      .map(row => ({
        machineType: MACHINE_TYPE_ENUM[machineKey],
        component: row['Component'] || '',
        platform: row['Platform'] || 'GrabCAD',
        fileFormat: row['Recommended_File_Format'] || null,
        directLink: row['Direct_Link'] || '',
      }));

    if (data.length > 0) {
      await prisma.cadModel.createMany({ data });
      totalInserted += data.length;
      console.log(`  ✅ ${machineKey}: ${data.length} CAD models`);
    }
  }

  console.log(`✅ Total CAD models inserted: ${totalInserted}`);
}

/**
 * Seed research papers for each machine type
 */
async function seedResearchPapers() {
  console.log('\n📚 Seeding Research Papers...');

  await prisma.researchPaper.deleteMany();
  let totalInserted = 0;

  for (const [machineKey, folder] of Object.entries(MACHINE_FOLDERS)) {
    const filePath = path.join(DATASET_PATH, folder, 'research_papers.csv');
    const rows = await parseCSV(filePath);

    if (rows.length === 0) continue;

    const data = rows
      .filter(row => row['Title'])
      .map(row => ({
        domain: row['Domain'] || machineKey,
        title: row['Title'] || '',
        authors: row['Authors'] || null,
        year: row['Year'] ? parseInt(row['Year']) : null,
        journal: row['Journal/Conference'] || null,
        doiLink: row['DOI/Link'] || null,
        keyTakeaways: row['Key_Takeaways'] || null,
      }));

    if (data.length > 0) {
      await prisma.researchPaper.createMany({ data });
      totalInserted += data.length;
      console.log(`  ✅ ${machineKey}: ${data.length} papers`);
    }
  }

  console.log(`✅ Total research papers inserted: ${totalInserted}`);
}

/**
 * Seed SCADA sensor data into MongoDB
 */
async function seedSensorData() {
  console.log('\n📡 Seeding SCADA Sensor Data into MongoDB...');

  await SensorReading.deleteMany();
  let totalInserted = 0;

  for (const [machineKey, folder] of Object.entries(MACHINE_FOLDERS)) {
    const filePath = path.join(DATASET_PATH, folder, 'scada_data.csv');
    const rows = await parseCSV(filePath);

    if (rows.length === 0) continue;

    const documents = rows
      .filter(row => row['timestamp'])
      .map(row => {
        // Separate timestamp from other readings
        const { timestamp, ...readings } = row;

        // Convert numeric values
        const numericReadings = {};
        for (const [key, value] of Object.entries(readings)) {
          const num = parseFloat(value);
          numericReadings[key] = isNaN(num) ? value : num;
        }

        return {
          machineType: machineKey,
          timestamp: new Date(timestamp),
          readings: numericReadings,
        };
      });

    if (documents.length > 0) {
      await SensorReading.insertMany(documents);
      totalInserted += documents.length;
      console.log(`  ✅ ${machineKey}: ${documents.length} readings`);
    }
  }

  console.log(`✅ Total sensor readings inserted: ${totalInserted}`);
}

// =============================================
// MAIN SEED FUNCTION
// =============================================

async function seed() {
  console.log('🌱 Starting TurbineIQ Database Seeder...');
  console.log(`📂 Dataset path: ${DATASET_PATH}`);
  console.log('─'.repeat(50));

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Connect Prisma
    await prisma.$connect();
    console.log('✅ PostgreSQL connected');

    // Run all seeders
    await seedResourceLinks();
    await seedManufacturers();
    await seedCadModels();
    await seedResearchPapers();
    await seedSensorData();

    console.log('\n' + '═'.repeat(50));
    console.log('✅ ALL DATA SEEDED SUCCESSFULLY!');
    console.log('═'.repeat(50));

  } catch (error) {
    console.error('\n❌ Seed error:', error);
  } finally {
    await prisma.$disconnect();
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
