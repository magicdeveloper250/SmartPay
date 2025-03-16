'use server'

import { prisma } from '@/lib/prisma'
import { authOptions } from "@/utils/auth";
import { getServerSession } from "next-auth";
import { revalidatePath } from 'next/cache'
import { CompanyProfileFormValues, ContributionValues, GeneralSettingsFormValues, PayrollSettingsFormValues, TaxValues } from '../validations/settingsSchema'
import { handleActionsPrismaError } from '@/lib/error-handler';

export async function getCompanySettings() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user)  
      return {"error":"Unauthorized"}

    const user = await prisma.user.findFirstOrThrow({
      where: { 
        email: session.user.email as string
      },
     include:{
      company:{
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
            select: { id: true, name: true,  }},
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
      }
     }
    });

    if (!user.company)  
      return {"error": "Company not found"}

    return {
      generalSettings: user.company.settings || {
        id: '',
        defaultCurrency: '',
        payrollStartDate: null,
        payrollEndDate: null,
        paymentDay: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId: user.company.id
      },
      taxes: user.company.predefinedTaxes || [],
      payrollSettings: user.company.payrollSettings || {
        id: '', 
        createdAt: new Date(),
        updatedAt: new Date(),
        companyId:user.company.id,
        overtimeRate: 0,
        weekendRate: 0,
        holidayRate: 0,
        maxOvertimeHours: 0,
        minWorkingHours: 0,
        taxDeductionOrder: [],
      },
      company: {
        name: user.company.name,
        email: user.company.email,
        pensionCode: user.company.pensionCode,
        industry: user.company.industry,
        country: user.company.country,
        city: user.company.city
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
    const user = await prisma.user.findFirstOrThrow({ where: { email: session.user.email as string }, include:{company:true} })
    await prisma.company.update({   
      where: { id: user.company.id },
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
    
    const user = await prisma.user.findFirstOrThrow({ 
      where: { email: session.user.email as string },
      include: { company:{
        include:{
          settings: true
        }
      } }
    });
    
    if (user.company.settings) {
      await prisma.settings.update({   
        where: { id: user.company.settings.id },
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
          company: { connect: { id: user.company.id } }
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
    
    const user = await prisma.user.findFirstOrThrow({ 
      where: { email: session.user.email as string },
      include: { company:{
        include:{
          payrollSettings: true
        }
      } }
    });
    
    if (user.company.payrollSettings) {
      await prisma.payrollSettings.update({   
        where: { id: user.company.payrollSettings.id },
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
          company: { connect: { id: user.company.id } }
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
    
    const user = await prisma.user.findFirstOrThrow({ 
      where: { email: session.user.email as string },
      include: {company:{
        include:{
          predefinedTaxes: true 
        }
      }}
    });
    
    if (user.company.predefinedTaxes) {
      for (const tax of data.taxes) {
        const existingTax = user.company.predefinedTaxes.find(t => t.id === tax.tax.id);
        if (existingTax) {
          await prisma.predefinedTax.update({   
            where: { id: existingTax.id },
            data: {
               
              name: tax.tax.name,
              company: { connect: { id: user.company.id } }
            }
          });
        } else {
          await prisma.predefinedTax.create({
            data: {
             
              name: tax.tax.name,
              company: { connect: { id: user.company.id } }
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





export async function updatePredefinedContributions(data: { contributions: ContributionValues[] }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return {"error":"Unauthorized"};
    }
    
    const user = await prisma.user.findFirstOrThrow({ 
      where: { email: session.user.email as string },
      include: {company:{
        include:{
          predefinedContribution: true 
        }
      }}
    });
    
    if (user.company.predefinedContribution) {
      for (const contribution of data.contributions) {
        const existingContribution = user.company.predefinedContribution.find(c => c.id === contribution.contribution.id);
        if (existingContribution) {
          await prisma.predefinedContribution.update({   
            where: { id: existingContribution.id },
            data: {
               
              name: contribution.contribution.name,
              company: { connect: { id: user.company.id } }
            }
          });
        } else {
          await prisma.predefinedContribution.create({
            data: {
             
              name: contribution.contribution.name,
              company: { connect: { id: user.company.id } }
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