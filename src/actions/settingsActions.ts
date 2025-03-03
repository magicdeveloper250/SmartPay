'use server'

import { prisma } from '@/lib/prisma'
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from 'next/cache'
import { CompanyProfileFormValues, GeneralSettingsFormValues, PayrollSettingsFormValues, TaxValues, type SettingsFormValues } from '../validations/settingsSchema'
import { handleActionsPrismaError } from '@/lib/error-handler';

export async function getCompanySettings() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)  
      return {"error":"Unauthorized"}

    const company = await prisma.company.findFirstOrThrow({
      where: { 
        adminEmail: session.user.email as string
      },
      select: {
        id: true,
        name: true,
        email: true,
        pensionCode: true,
        industry: true,
        country: true,
        city: true,
        settings: {
          select: {
            id: true,
            defaultCurrency: true,
            payrollStartDate: true,
            payrollEndDate: true,
            paymentDay: true,
          }
          
        },
        predefinedTaxes: {
          select: { id: true, name: true, rate: true, min: true, max: true }},
        payrollSettings: {
          select: {
            id: true,
            overtimeRate: true,
            weekendRate: true,
            holidayRate: true,
            maxOvertimeHours: true,
            minWorkingHours: true,
            taxDeductionOrder: true
          }
        }
      }
    });

    if (!company)  
      return {"error": "Company not found"}

    return {
      generalSettings: company.settings || {
        id: '',
        defaultCurrency: '',
        payrollStartDate: null,
        payrollEndDate: null,
        paymentDay: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: company.id
      },
      taxes: company.predefinedTaxes || [],
      payrollSettings: company.payrollSettings || {
        id: '', 
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: company.id,
        overtimeRate: 0,
        weekendRate: 0,
        holidayRate: 0,
        maxOvertimeHours: 0,
        minWorkingHours: 0,
        taxDeductionOrder: [],
      },
      company: {
        name: company.name,
        email: company.email,
        pensionCode: company.pensionCode,
        industry: company.industry,
        country: company.country,
        city: company.city
      }
    }
  } catch (error) {
    return handleActionsPrismaError(error)
  }
}

export async function  updateCompanyPrrofileSettings(data: CompanyProfileFormValues) {
   try {
    const session = await getServerSession(authOptions);
    if (!session?.user)  
      return {"error":"Unauthorized"}
    const company = await prisma.company.findFirstOrThrow({ where: { adminEmail: session.user.email as string } })
    await prisma.company.update({   
      where: { id: company.id },
      data: {
        name: data.company.name,
        email: data.company.email,
        pensionCode: data.company.pensionCode,
        industry: data.company.industry,
        country: data.company.country,
        city: data.company.city
      }
    })
    revalidatePath("/dashboard/settings")
    return Promise.resolve(data)
   } catch (error) {
    return handleActionsPrismaError(error)
    
   }

}

export async function updateGeneralSettings(data: GeneralSettingsFormValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)  
      return {"error":"Unauthorized"}
    
    const company = await prisma.company.findFirstOrThrow({ 
      where: { adminEmail: session.user.email as string },
      include: { settings: true }
    });
    
    if (company.settings) {
      await prisma.settings.update({   
        where: { id: company.settings.id },
        data: {
          defaultCurrency: data.generalSettings.defaultCurrency,
          payrollStartDate: data.generalSettings.payrollStartDate,
          payrollEndDate: data.generalSettings.payrollEndDate,
          paymentDay: data.generalSettings.paymentDay
        }
      });
    } else {
      await prisma.settings.create({
        data: {
          defaultCurrency: data.generalSettings.defaultCurrency,
          payrollStartDate: data.generalSettings.payrollStartDate,
          payrollEndDate: data.generalSettings.payrollEndDate,
          paymentDay: data.generalSettings.paymentDay,
          company: { connect: { id: company.id } }
        }
      });
    }
    
    revalidatePath("/dashboard/settings");
    return Promise.resolve(data);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}

export async function updatePayrollSettings(data: PayrollSettingsFormValues) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)  
      return {"error":"Unauthorized"}
    
    const company = await prisma.company.findFirstOrThrow({ 
      where: { adminEmail: session.user.email as string },
      include: { payrollSettings: true }
    });
    
    if (company.payrollSettings) {
      await prisma.payrollSettings.update({   
        where: { id: company.payrollSettings.id },
        data: {
          overtimeRate: data.payrollSettings.overtimeRate,
          weekendRate: data.payrollSettings.weekendRate,
          holidayRate: data.payrollSettings.holidayRate,
          maxOvertimeHours: data.payrollSettings.maxOvertimeHours,
          minWorkingHours: data.payrollSettings.minWorkingHours,
          taxDeductionOrder: data.payrollSettings.taxDeductionOrder
        }
      });
    } else {
      await prisma.payrollSettings.create({
        data: {
          overtimeRate: data.payrollSettings.overtimeRate,
          weekendRate: data.payrollSettings.weekendRate,
          holidayRate: data.payrollSettings.holidayRate,
          maxOvertimeHours: data.payrollSettings.maxOvertimeHours,
          minWorkingHours: data.payrollSettings.minWorkingHours,
          taxDeductionOrder: data.payrollSettings.taxDeductionOrder,
          company: { connect: { id: company.id } }
        }
      });
    }
    
    revalidatePath("/dashboard/settings");
    return Promise.resolve(data);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}



export async function updatePredefinedTaxes(data: { taxes: TaxValues[] }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return {"error":"Unauthorized"};
    }
    
    const company = await prisma.company.findFirstOrThrow({ 
      where: { adminEmail: session.user.email as string },
      include: { predefinedTaxes: true }
    });
    
    if (company.predefinedTaxes) {
      for (const tax of data.taxes) {
        const existingTax = company.predefinedTaxes.find(t => t.id === tax.tax.id);
        if (existingTax) {
          await prisma.predefinedTax.update({   
            where: { id: existingTax.id },
            data: {
              rate: tax.tax.rate,
              min: tax.tax.min,
              max: tax.tax.max,
              name: tax.tax.name,
              company: { connect: { id: company.id } }
            }
          });
        } else {
          await prisma.predefinedTax.create({
            data: {
              rate: tax.tax.rate,
              min: tax.tax.min,
              max: tax.tax.max,
              name: tax.tax.name,
              company: { connect: { id: company.id } }
            }
          });
        }
      }
    }
    
    return Promise.resolve(data);
  } catch (error) {
    return handleActionsPrismaError(error);
  }
}