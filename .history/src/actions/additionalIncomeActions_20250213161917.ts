import { prisma } from "@/utils/prismaDB";
import { revalidatePath } from "next/cache";
import { handleActionsPrismaError } from "@/lib/error-handler";
import { additionalIncomeSchema, AdditionalIncomeSchemaType } from "@/validations/additionalIncome";
import { IncomeType, PaymentStatus } from '@prisma/client'; // Import enum types

export async function addAdditionalIncome(formData: AdditionalIncomeSchemaType, employeeId: string) {
    const result = additionalIncomeSchema.safeParse(formData);

    if (!result.success) {
        const errorMessages = result.error.issues.map((issue) => issue.message).join(', '); // More concise error message
        return { error: errorMessages };
    }

    try {
        const { income_type, payment_status, ...rest } = formData; // Destructure to type-assert

        const typedIncomeType = income_type as IncomeType;
        const typedPaymentStatus = payment_status as PaymentStatus;

        const newIncome = await prisma.additionalIncome.create({
            data: {
                ...rest,  // Spread the rest of the form data
                income_type: typedIncomeType,
                payment_status: typedPaymentStatus,
                employee_id:employeeId,
            },
        });

        revalidatePath("/dashboard/employees/internal");
        return { data: newIncome }; // Return the created income (good practice)

    } catch (error) {
        console.error("Prisma Error in addAdditionalIncome:", error); // Log the full error object
        return handleActionsPrismaError(error); // Let your error handler process it
    }
}