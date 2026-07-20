import { PrismaClient } from '@prisma/client';
import { MEDICINES } from '../lib/medicines';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding medicines...");
  let count = 0;
  for (const med of MEDICINES) {
    await prisma.medicine.upsert({
      where: { id: med.id },
      update: {
        name: med.name,
        salt: med.salt,
        brand: med.brand,
        mrp: med.mrp,
        packSize: med.packSize,
        dosageForm: med.dosageForm,
        prescriptionRequired: med.prescriptionRequired,
      },
      create: {
        id: med.id,
        name: med.name,
        salt: med.salt,
        brand: med.brand,
        mrp: med.mrp,
        packSize: med.packSize,
        dosageForm: med.dosageForm,
        prescriptionRequired: med.prescriptionRequired,
      }
    });
    count++;
  }
  console.log(`Successfully seeded ${count} medicines.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
