import { z } from 'zod';
export const FileUploadSchema = z.object({
  buffer: z.instanceof(ArrayBuffer),
  fileName: z.string().endsWith('.xlsx', { message: 'Only .xlsx files are allowed' }),
  fileSize: z.number().max(5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
  fileType: z.string().includes('spreadsheet', { message: 'Invalid file type' })
});


export type employeeSchemaType = z.infer<typeof FileUploadSchema>;