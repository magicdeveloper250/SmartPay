import { z } from 'zod';
export const FileUploadSchema = z.object({
  file: z.instanceof(File),
 
});


export type employeeSchemaType = z.infer<typeof FileUploadSchema>;