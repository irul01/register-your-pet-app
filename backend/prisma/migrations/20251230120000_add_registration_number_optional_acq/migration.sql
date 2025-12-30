-- Add animalRegistrationNumber and make acquisitionDate optional
ALTER TABLE "Registration" ADD COLUMN "animalRegistrationNumber" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Registration" ALTER COLUMN "acquisitionDate" DROP NOT NULL;
