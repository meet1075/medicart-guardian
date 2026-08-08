import * as xlsx from 'xlsx';
import fs from 'fs';


const workbook = xlsx.readFile('price list final.xlsx');
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(worksheet);

console.log('Total rows:', data.length);
console.log('First 5 rows:', data.slice(0, 5));

const types = new Set();
data.forEach((row: any) => {
  if (row.TYPE || row.type || row.Type) {
    types.add(row.TYPE || row.type || row.Type);
  }
});
console.log('Unique types:', Array.from(types));
