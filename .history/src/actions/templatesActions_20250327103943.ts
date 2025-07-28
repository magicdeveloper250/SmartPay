'use server';

import * as XLSX from 'xlsx';
import { Currency, Gender, PaymentFrequency } from "@prisma/client";

export async function generateEmployeeTemplate() {
  const headers = [
    'firstName', 'secondName', 'email', 'phoneNumber', 'paymentPhone',
    'address', 'dob', 'gender', 'employeeID', 'nationalID',
    'jobTitle', 'currency', 'paymentFrequency', 'department',
    'bankName', 'bankAccountNumber', 'swiftCode', 'paymentMethod',
    'Domicile', 'walletAddress', 'startDate', 'monthlyGross'
  ];

  const sampleData = {
    firstName: 'John (min 2 chars, letters only)',
    secondName: 'Doe (min 2 chars, letters only)',
    email: 'john.doe@example.com',
    phoneNumber: '+250788123456',
    paymentPhone: '+250788123456 (required if paymentMethod=phone)',
    address: '123 Main St, Kigali',
    dob: '1990-01-01 (age 16-120)',
    gender: Object.values(Gender).join('/'),
    employeeID: 'OPTIONAL',
    nationalID: '1990010112345678 (must start with 1, 16 digits)',
    jobTitle: 'Developer',
    currency: Object.values(Currency).join('/'),
    paymentFrequency: Object.values(PaymentFrequency).join('/'),
    department: 'IT',
    bankName: 'Required if paymentMethod=bank',
    bankAccountNumber: 'Required if paymentMethod=bank',
    swiftCode: 'Required if paymentMethod=bank',
    paymentMethod: 'bank/crypto/phone',
    Domicile: 'OPTIONAL',
    walletAddress: 'Required if paymentMethod=crypto',
    startDate: '2023-01-01',
    monthlyGross: '500000 (positive number)'
  };

  const wb = XLSX.utils.book_new();
  
  const ws = XLSX.utils.json_to_sheet([sampleData], { header: headers });
  
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1:Z1');
  
  const addDropdown = (col: number, values: string[]) => {
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      const cell = XLSX.utils.encode_cell({ r: R, c: col });
      ws[cell].dataValidation = {
        type: 'list',
        allowBlank: true,
        showInputMessage: true,
        prompt: 'Select from dropdown',
        formulae: [`"${values.join(',')}"`]
      };
    }
  };

  addDropdown(headers.indexOf('gender'), Object.values(Gender));
  
  addDropdown(headers.indexOf('currency'), Object.values(Currency));
  
  addDropdown(headers.indexOf('paymentFrequency'), Object.values(PaymentFrequency));
  
  addDropdown(headers.indexOf('paymentMethod'), ['bank', 'crypto', 'phone']);

  const instructions = [
    ['EMPLOYEE IMPORT TEMPLATE INSTRUCTIONS'],
    [''],
    ['1. Fill in all required fields (remove "OPTIONAL" text where present)'],
    ['2. For dropdown fields, select from the available options'],
    ['3. Date format: YYYY-MM-DD'],
    ['4. Payment method requirements:'],
    ['   - bank: requires bankName, bankAccountNumber, swiftCode'],
    ['   - crypto: requires walletAddress'],
    ['   - phone: requires paymentPhone'],
    ['5. National ID must be 16 digits starting with 1'],
    ['6. Phone numbers must be valid international format'],
    ['7. Monthly gross must be a positive number']
  ];
  
  const instructionWs = XLSX.utils.aoa_to_sheet(instructions);
  
  XLSX.utils.book_append_sheet(wb, instructionWs, "Instructions");
  XLSX.utils.book_append_sheet(wb, ws, "Employee Data");

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return buffer.toString('base64');
}