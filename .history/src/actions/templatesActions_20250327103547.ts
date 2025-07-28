'use server';

import * as XLSX from 'xlsx';

export async function generateExcel() {
  const data = [
    { Name: 'John', Age: 30, City: 'New York' },
    { Name: 'Jane', Age: 25, City: 'London' },
    { Name: 'Bob', Age: 40, City: 'Paris' }
  ];

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer.toString('base64');
}