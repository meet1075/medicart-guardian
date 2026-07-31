import xlsx from 'xlsx';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  console.log('Reading Price List.xlsx...');
  const wb = xlsx.readFile('Price List.xlsx');
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  
  // The first two rows are headers/titles
  const data: any[] = xlsx.utils.sheet_to_json(sheet, { range: 2 });
  
  console.log(`Found ${data.length} rows. Updating MOQ...`);
  
  let updatedCount = 0;
  let notFoundCount = 0;

  for (const row of data) {
    // In this specific excel file format, Name is __EMPTY_1 and MOQ is __EMPTY_7
    const rawName = row['__EMPTY_1'] || row['Name'];
    const rawMoq = row['__EMPTY_7'] || row['MOQ'];
    
    if (!rawName || !rawMoq) continue;
    
    const name = rawName.trim();
    
    // Extract number from MOQ string (e.g. "3 strips" -> 3)
    const match = String(rawMoq).match(/(\d+)/);
    const moq = match ? parseInt(match[1], 10) : 1;
    
    const medicines = await prisma.medicine.findMany({
      where: {
        name: {
          contains: name,
          mode: 'insensitive'
        }
      }
    });

    if (medicines.length > 0) {
      for (const med of medicines) {
        await prisma.medicine.update({
          where: { id: med.id },
          data: { moq }
        });
      }
      updatedCount++;
    } else {
      // It's possible the DB doesn't have all excel items if they haven't imported everything yet.
      notFoundCount++;
    }
  }

  console.log(`Finished! Updated MOQ for ${updatedCount} medicine families. Not found: ${notFoundCount}`);
  await prisma.$disconnect();
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
