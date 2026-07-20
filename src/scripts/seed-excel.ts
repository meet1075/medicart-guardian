import { PrismaClient } from '@prisma/client';
import xlsx from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log("Reading Excel file...");
  const filePath = path.resolve(process.cwd(), 'Price List for Website.xlsx');
  const wb = xlsx.readFile(filePath);
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  
  // Convert sheet to JSON array
  const rows: any[] = xlsx.utils.sheet_to_json(sheet);
  
  // Find the header row index (where __EMPTY_1 is 'Name' or similar)
  const headerRowIndex = rows.findIndex(row => row['__EMPTY_1'] === 'Name' || row['__EMPTY'] === 'Sl No');
  
  if (headerRowIndex === -1) {
    throw new Error("Could not find header row in Excel file.");
  }
  
  // Data starts after header row
  const dataRows = rows.slice(headerRowIndex + 1);

  console.log(`Found ${dataRows.length} rows to process.`);

  console.log("Cleaning up existing data...");
  try {
    // Delete orders first to avoid foreign key constraints when deleting medicines
    await prisma.itemVerification.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    
    // Now delete all medicines
    await prisma.medicine.deleteMany();
    console.log("Database cleared successfully.");
  } catch (error) {
    console.error("Failed to clean up database:", error);
    throw error;
  }

  console.log("Seeding new medicines from Excel...");
  let count = 0;
  
  for (const row of dataRows) {
    const name = row['__EMPTY_1'];
    if (!name || typeof name !== 'string') continue;
    
    const composition = row['__EMPTY_2'] || '';
    const form = row['__EMPTY_3'] || 'Tablet';
    const packing = row['__EMPTY_4'] || '1 Strip';
    const mrp = parseFloat(row['__EMPTY_6']) || 0;
    
    // Defaulting missing optional fields
    const brand = name.split(' ')[0] || name; // Just extract a brand name from the first word
    const prescriptionRequired = false; // We default to false since it's not in the file

    await prisma.medicine.create({
      data: {
        name: name.trim(),
        salt: composition.trim(),
        brand: brand,
        mrp: mrp,
        packSize: packing.trim(),
        dosageForm: form.trim(),
        prescriptionRequired,
        inStock: true
      }
    });
    count++;
  }
  
  console.log(`Successfully seeded ${count} medicines from Excel.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
