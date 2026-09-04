import { PrismaClient } from "@prisma/client";
import * as xlsx from "xlsx";


const db = new PrismaClient();

const mapType = (t: string) => {
  t = t.trim().toUpperCase();
  if (t === "GASTRO") return "gastro";
  if (t === "DERMA") return "dermatology";
  if (t === "ORTHO") return "ortho";
  if (t === "GENERAL" || t === "GEN.") return "general";
  if (t === "GYNAE") return "gynae";
  if (t === "CARDIAC DIABETIC") return "cardiac";
  return "general";
};

async function main() {
  const wb = xlsx.readFile("price list final.xlsx");
  const data = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
  
  const rows = data.slice(4) as any[];
  
  for (const row of rows) {
    const name = row[1];
    const typeStr = row[2];
    
    if (!name || !typeStr) continue;
    
    const categories = typeStr.split("/").map(mapType).filter(Boolean);
    const categoryCsv = Array.from(new Set(categories)).join(",");
    
    const nameTrim = name.trim();
    
    const medicines = await db.medicine.findMany({
      where: {
        name: {
          equals: nameTrim,
          mode: "insensitive"
        }
      }
    });

    if (medicines.length > 0) {
      for (const m of medicines) {
         await db.medicine.update({
           where: { id: m.id },
           data: { category: categoryCsv }
         });
         console.log(`Updated ${m.name} to ${categoryCsv}`);
      }
    } else {
       // try contains
       const m2 = await db.medicine.findMany({
          where: { name: { contains: nameTrim.split(" ")[0], mode: "insensitive" } }
       });
       if(m2.length > 0) {
         for (const m of m2) {
           await db.medicine.update({
             where: { id: m.id },
             data: { category: categoryCsv }
           });
           console.log(`Updated ${m.name} to ${categoryCsv}`);
         }
       } else {
         console.log(`Not found: ${name}`);
       }
    }
  }
}

main().catch(console.error).finally(() => db.$disconnect());
