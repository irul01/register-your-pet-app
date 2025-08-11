-- CreateTable
CREATE TABLE "Registration" (
    "id" SERIAL NOT NULL,
    "guardianName" TEXT NOT NULL,
    "residentNo" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "animalName" TEXT NOT NULL,
    "breed" TEXT NOT NULL,
    "furColor" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "neutering" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "acquisitionDate" TIMESTAMP(3) NOT NULL,
    "specialNotes" TEXT,
    "applicationDate" TIMESTAMP(3) NOT NULL,
    "signaturePath" TEXT NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);
