-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('WIND_TURBINE', 'STEAM_TURBINE', 'GAS_TURBINE', 'HYDRO_TURBINE', 'MOTOR', 'GENERATOR', 'PUMP', 'COMPRESSOR');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "institution" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "machineType" "MachineType" NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulation_trials" (
    "id" TEXT NOT NULL,
    "trialNumber" INTEGER NOT NULL,
    "trialName" TEXT,
    "parameters" JSONB NOT NULL,
    "efficiencyPercent" DOUBLE PRECISION,
    "powerOutput" DOUBLE PRECISION,
    "specificResults" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "simulation_trials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "machine_catalog" (
    "id" TEXT NOT NULL,
    "machineType" "MachineType" NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "modelName" TEXT NOT NULL,
    "type" TEXT,
    "capacity" TEXT,
    "keyFeatures" TEXT,

    CONSTRAINT "machine_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cad_models" (
    "id" TEXT NOT NULL,
    "machineType" "MachineType" NOT NULL,
    "component" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "fileFormat" TEXT,
    "directLink" TEXT NOT NULL,

    CONSTRAINT "cad_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "research_papers" (
    "id" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT,
    "year" INTEGER,
    "journal" TEXT,
    "doiLink" TEXT,
    "keyTakeaways" TEXT,

    CONSTRAINT "research_papers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resource_links" (
    "id" TEXT NOT NULL,
    "machineType" TEXT NOT NULL,
    "resourceName" TEXT NOT NULL,
    "directLink" TEXT NOT NULL,
    "fileType" TEXT,
    "category" TEXT,
    "priority" INTEGER,
    "folder" TEXT,
    "pgTable" TEXT,
    "purpose" TEXT,

    CONSTRAINT "resource_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "simulation_trials" ADD CONSTRAINT "simulation_trials_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
