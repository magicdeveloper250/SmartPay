'use client'
import { toast } from 'react-hot-toast'
import { updateCompanyPrrofileSettings, updateGeneralSettings, updatePayrollSettings, updatePredefinedContributions, updatePredefinedTaxes } from '@/actions/settingsActions' 
import { Currency, SupportedContributions, SupportedTaxes } from '@prisma/client'
import { useTransition } from 'react'
import Loader from '@/components/Common/Loader'
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import industries from "@/data/industries.json";
import { useState } from 'react'
import 
{ 
  CompanyProfileFormSchema, 
  CompanyProfileFormValues,
   GeneralSettingsFormValues, 
   GeneralSettingsFormSchema,
    PayrollSettingsFormSchema, 
    PayrollSettingsFormValues, 
    TaxFormSchema,
    TaxValues,
    ContributionValues,
    contributionFormSchema,
    SettingsFormValues} from '@/validations/settingsSchema'
 import { z } from 'zod'
import { useEffect } from 'react'


export function TaxesForm({ initialData }:{initialData:TaxValues[]}) {
  const [isSubmitting, startTransition] = useTransition();
 
  
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isDirty }, 
  } = useForm<{ taxes: TaxValues[] }>({
    resolver: zodResolver(z.object({
      taxes: z.array(TaxFormSchema)
    })),
    mode: "onChange",
    defaultValues: {
      taxes: initialData?.length > 0 ? initialData : []
    }
  });

  

  const { fields, append, remove } = useFieldArray({
    name: "taxes",
    control
  });
  

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      reset({ taxes: initialData });
    }
  }, [initialData, reset]);
 
  const onSubmit: SubmitHandler<{ taxes: TaxValues[] }> = (data) => {
    
    startTransition(async () => {
      try {
        const result = await updatePredefinedTaxes(data);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("Taxes Settings updated successfully");
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to update tax settings");
      }
    });
  };

  const handleAddTax = () => {
    append({ 
      tax: {
        name: SupportedTaxes.PIT, 
        
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <fieldset className="border rounded-lg p-6 bg-gray-50">
        <legend className="text-xl font-semibold px-2 bg-gray-50 text-primary">
          Tax Settings
        </legend>
        
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Tax #{index + 1}</h3>
                <button 
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-800 hover:text-red-700"
                  aria-label={`Remove tax #${index + 1}`}
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label htmlFor={`taxes.${index}.tax.name`} className="block text-sm font-medium mb-1 text-gray-700">
                    Tax Name <span className="text-red-800">*</span>
                  </label>
                  <select
                    id={`taxes.${index}.tax.name`}
                    {...register(`taxes.${index}.tax.name`)}
                    aria-invalid={errors.taxes?.[index]?.tax?.name ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    
                  >
                    {Object.values(SupportedTaxes).map((tax, index)=><option key={index}>{tax}</option>)}
                  </select>
                  {errors.taxes?.[index]?.tax?.name && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.name.message}
                    </p>
                  )}
                </div>
                
                {/* <div>
                  <label htmlFor={`taxes.${index}.tax.rate`} className="block text-sm font-medium mb-1 text-gray-700">
                    Rate (%) <span className="text-red-800">*</span>
                  </label>
                  <input 
                    id={`taxes.${index}.tax.rate`}
                    type="number"
                    step="0.01"
                    {...register(`taxes.${index}.tax.rate`, { valueAsNumber: true })}
                    aria-invalid={errors.taxes?.[index]?.tax?.rate ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g., 15"
                  />
                  {errors.taxes?.[index]?.tax?.rate && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.rate.message}
                    </p>
                  )}
                </div> */}
                
                {/* <div>
                  <label htmlFor={`taxes.${index}.tax.min`} className="block text-sm font-medium mb-1 text-gray-700">
                    Minimum Threshold <span className="text-red-800">*</span>
                  </label>
                  <input 
                    id={`taxes.${index}.tax.min`}
                    type="number"
                    step="0.01"
                    {...register(`taxes.${index}.tax.min`, { valueAsNumber: true })}
                    aria-invalid={errors.taxes?.[index]?.tax?.min ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g., 5000"
                  />
                  {errors.taxes?.[index]?.tax?.min && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.min.message}
                    </p>
                  )}
                </div> */}
                
                {/* <div>
                  <label htmlFor={`taxes.${index}.tax.max`} className="block text-sm font-medium mb-1 text-gray-700">
                    Maximum Threshold <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input 
                    id={`taxes.${index}.tax.max`}
                    type="number"
                    step="0.01"
                    {...register(`taxes.${index}.tax.max`, { 
                      valueAsNumber: true,
                      setValueAs: v => v === "" || v === null ? null : Number(v)
                    })}
                    aria-invalid={errors.taxes?.[index]?.tax?.max ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g., 10000 (leave empty for no maximum)"
                  />
                  {errors.taxes?.[index]?.tax?.max && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.max.message}
                    </p>
                  )}
                </div> */}
              </div>
              
              {field.id && (
                <input type="hidden" {...register(`taxes.${index}.tax.id`)} />
              )}
            </div>
          ))}
          
          {errors.taxes?.message && (
            <p className="text-red-800 text-sm mt-1" role="alert">
              {errors.taxes.message}
            </p>
          )}
          
          <div className="flex justify-center">
            <button 
              type="button"
              onClick={handleAddTax}
              className="px-4 py-2 bg-green-800 text-white font-medium rounded-md hover:bg-green-900 transition-colors"
              aria-label="Add new tax"
            >
              + Add Tax
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 bg-primary text-white font-medium rounded-md border border-primary transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-auto"
            aria-label="Save tax settings"
          >
            {isSubmitting ? (
              <>
                <Loader />
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </fieldset>
    </form>
  );
}



export function ContributionsForm({ initialData }:{initialData:ContributionValues[]}) {
  const [isSubmitting, startTransition] = useTransition();
 
  
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isDirty }, 
  } = useForm<{ contributions: ContributionValues[] }>({
    resolver: zodResolver(z.object({
      contributions: z.array(contributionFormSchema)
    })),
    mode: "onChange",
    defaultValues: {
      contributions: initialData?.length > 0 ? initialData : []
    }
  });

  
console.log(errors, isDirty)
  const { fields, append, remove } = useFieldArray({
    name: "contributions",
    control
  });
  

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      reset({ contributions: initialData });
    }
  }, [initialData, reset]);
 
  const onSubmit: SubmitHandler<{ contributions: ContributionValues[] }> = (data) => {
    
    startTransition(async () => {
      try {
        const result = await updatePredefinedContributions(data);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("Contributions Settings updated successfully");
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to update contribution settings");
      }
    });
  };

  const handleAddContribution = () => {
    append({ 
      contribution: {
        name: SupportedContributions.PENSION, 
        
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <fieldset className="border rounded-lg p-6 bg-gray-50">
        <legend className="text-xl font-semibold px-2 bg-gray-50 text-primary">
          RSSB Contributions Settings
        </legend>
        
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Contribution #{index + 1}</h3>
                <button 
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-800 hover:text-red-700"
                  aria-label={`Remove tax #${index + 1}`}
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <label htmlFor={`taxes.${index}.tax.name`} className="block text-sm font-medium mb-1 text-gray-700">
                    Contribution Name <span className="text-red-800">*</span>
                  </label>
                  <select
                    id={`contributions.${index}.contribution.name`}
                    {...register(`contributions.${index}.contribution.name`)}
                    aria-invalid={errors.contributions?.[index]?.contribution?.name ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    
                  >
                    {Object.values(SupportedContributions).map((contribution, index)=><option key={index}>{contribution}</option>)}
                  </select>
                  {errors.contributions?.[index]?.contribution?.name && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.contributions[index].contribution.name.message}
                    </p>
                  )}
                </div>
                
                {/* <div>
                  <label htmlFor={`taxes.${index}.tax.rate`} className="block text-sm font-medium mb-1 text-gray-700">
                    Rate (%) <span className="text-red-800">*</span>
                  </label>
                  <input 
                    id={`taxes.${index}.tax.rate`}
                    type="number"
                    step="0.01"
                    {...register(`taxes.${index}.tax.rate`, { valueAsNumber: true })}
                    aria-invalid={errors.taxes?.[index]?.tax?.rate ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g., 15"
                  />
                  {errors.taxes?.[index]?.tax?.rate && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.rate.message}
                    </p>
                  )}
                </div> */}
                
                {/* <div>
                  <label htmlFor={`taxes.${index}.tax.min`} className="block text-sm font-medium mb-1 text-gray-700">
                    Minimum Threshold <span className="text-red-800">*</span>
                  </label>
                  <input 
                    id={`taxes.${index}.tax.min`}
                    type="number"
                    step="0.01"
                    {...register(`taxes.${index}.tax.min`, { valueAsNumber: true })}
                    aria-invalid={errors.taxes?.[index]?.tax?.min ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g., 5000"
                  />
                  {errors.taxes?.[index]?.tax?.min && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.min.message}
                    </p>
                  )}
                </div> */}
                
                {/* <div>
                  <label htmlFor={`taxes.${index}.tax.max`} className="block text-sm font-medium mb-1 text-gray-700">
                    Maximum Threshold <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input 
                    id={`taxes.${index}.tax.max`}
                    type="number"
                    step="0.01"
                    {...register(`taxes.${index}.tax.max`, { 
                      valueAsNumber: true,
                      setValueAs: v => v === "" || v === null ? null : Number(v)
                    })}
                    aria-invalid={errors.taxes?.[index]?.tax?.max ? "true" : "false"}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    placeholder="e.g., 10000 (leave empty for no maximum)"
                  />
                  {errors.taxes?.[index]?.tax?.max && (
                    <p className="text-red-800 text-sm mt-1" role="alert">
                      {errors.taxes[index].tax.max.message}
                    </p>
                  )}
                </div> */}
              </div>
              
              {field.id && (
                <input type="hidden" {...register(`contributions.${index}.contribution.id`)} />
              )}
            </div>
          ))}
          
          {errors.contributions?.message && (
            <p className="text-red-800 text-sm mt-1" role="alert">
              {errors.contributions.message}
            </p>
          )}
          
          <div className="flex justify-center">
            <button 
              type="button"
              onClick={handleAddContribution}
              className="px-4 py-2 bg-green-800 text-white font-medium rounded-md hover:bg-green-900 transition-colors"
              aria-label="Add new tax"
            >
              + Add Contribution
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 mt-4 border-t">
          <button 
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-3 bg-primary text-white font-medium rounded-md border border-primary transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-auto"
            aria-label="Save Contribution settings"
          >
            {isSubmitting ? (
              <>
                <Loader />
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
function CompanyProfileForm({ initialData }:{initialData:CompanyProfileFormValues}) {
  const [isSubmitting, startTransition] = useTransition();
const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isValid, isDirty }, 
  } = useForm<CompanyProfileFormValues>({
    resolver: zodResolver(CompanyProfileFormSchema),
    mode: "onChange" 
  });

  const onSubmit = (data: CompanyProfileFormValues) => {
    startTransition(async () => {
      const result = await updateCompanyPrrofileSettings(data);
      
      if ("error" in result) {
        toast.error(result.error);
        
      } else {
        toast.success("Company profile updated successfully");
      }
    });
  };

  

  const handleReset = () => {
    if (initialData && initialData.company) {
      setValue("company.name", initialData.company.name || "");
      setValue("company.email", initialData.company.email || "");
      setValue("company.pensionCode", initialData.company.pensionCode || "");
      setValue("company.industry", initialData.company.industry || "");
      setValue("company.country", initialData.company.country || "");
      setValue("company.city", initialData.company.city || "");
    } else {
      reset();
    }
  };

  useEffect(() => {
    if (initialData && initialData.company) {
      setValue("company.name", initialData.company.name || "");
      setValue("company.email", initialData.company.email || "");
      setValue("company.pensionCode", initialData.company.pensionCode || "");
      setValue("company.industry", initialData.company.industry || "");
      setValue("company.country", initialData.company.country || "");
      setValue("company.city", initialData.company.city || "");
    }
  }, [initialData, setValue]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
        <fieldset className="border rounded-lg p-6 bg-gray-50">
          <legend className="text-xl font-semibold px-2 bg-gray-50 text-primary">
            Company Profile
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="company.name" className="block text-sm font-medium mb-1 text-gray-700">
                Company Name <span className="text-red-800">*</span>
              </label>
              <input 
                id="company.name"
                {...register("company.name")}
                aria-invalid={errors.company?.name ? "true" : "false"}
                aria-describedby={errors.company?.name ? "company-name-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter company name"
              />
              {errors.company?.name && (
                <p id="company-name-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.company.name.message}
                </p>
              )}
            </div>
  
            <div>
              <label htmlFor="company.email" className="block text-sm font-medium mb-1 text-gray-700">
                Company Email <span className="text-red-800">*</span>
              </label>
              <input 
                id="company.email"
                type="email"
                {...register("company.email")}
                aria-invalid={errors.company?.email ? "true" : "false"}
                aria-describedby={errors.company?.email ? "company-email-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="company@example.com"
              />
              {errors.company?.email && (
                <p id="company-email-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.company.email.message}
                </p>
              )}
            </div>
  
            <div>
              <label htmlFor="company.pensionCode" className="block text-sm font-medium mb-1 text-gray-700">
                Pension Code <span className="text-red-800">*</span>
              </label>
              <input 
                id="company.pensionCode"
                {...register("company.pensionCode")}
                aria-invalid={errors.company?.pensionCode ? "true" : "false"}
                aria-describedby={errors.company?.pensionCode ? "pension-code-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter pension code"
              />
              {errors.company?.pensionCode && (
                <p id="pension-code-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.company.pensionCode.message}
                </p>
              )}
            </div>
  
            <div>
              <label htmlFor="company.industry" className="block text-sm font-medium mb-1 text-gray-700">
                Industry <span className="text-red-800">*</span>
              </label>
              <select 
                id="company.industry"
                {...register("company.industry")}
                aria-invalid={errors.company?.industry ? "true" : "false"}
                aria-describedby={errors.company?.industry ? "industry-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              {industries.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
              {/* <input 
                id="company.industry"
                {...register("company.industry")}
                aria-invalid={errors.company?.industry ? "true" : "false"}
                aria-describedby={errors.company?.industry ? "industry-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter industry"
              /> */}
              {errors.company?.industry && (
                <p id="industry-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.company.industry.message}
                </p>
              )}
            </div>
  
            <div>
              <label htmlFor="company.country" className="block text-sm font-medium mb-1 text-gray-700">
                Country <span className="text-red-800">*</span>
              </label>
              <input 
                id="company.country"
                {...register("company.country")}
                aria-invalid={errors.company?.country ? "true" : "false"}
                aria-describedby={errors.company?.country ? "country-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter country"
              />
              {errors.company?.country && (
                <p id="country-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.company.country.message}
                </p>
              )}
            </div>
  
            <div>
              <label htmlFor="company.city" className="block text-sm font-medium mb-1 text-gray-700">
                City <span className="text-red-800">*</span>
              </label>
              <input 
                id="company.city"
                {...register("company.city")}
                aria-invalid={errors.company?.city ? "true" : "false"}
                aria-describedby={errors.company?.city ? "city-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter city"
              />
              {errors.company?.city && (
                <p id="city-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.company.city.message}
                </p>
              )}
            </div>
          </div>
  
          <div className="flex justify-end gap-4 pt-2">
            <button 
              type="submit"
              disabled={isSubmitting || !isDirty}
               className="px-5 py-3 bg-primary text-white font-medium rounded-md border border-primary transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-auto"
              aria-label="Save company settings"
            >
              {isSubmitting ? (
                <>
                  <Loader/>
                   
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            
          
          </div>
        </fieldset>
      </form>
    );
  }

 
 

function GeneralSettingsForm({ initialData }: { initialData: GeneralSettingsFormValues }) {
  const [isSubmitting, startTransition] = useTransition();
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isValid, isDirty }, 
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(GeneralSettingsFormSchema),
    mode: "onChange" 
  });

  const onSubmit = (data: GeneralSettingsFormValues) => {
    startTransition(async () => {
      const result = await updateGeneralSettings(data); 
      
      // if (result.success) {
      //   toast.success("General settings updated successfully");
      // } else {
      //   toast.error(result.message || "Failed to update general settings");
      // }

      toast.success("General settins updated successfully");
    });
  };

  // const handleReset = () => {
  //   if (initialData && initialData.generalSettings) {
  //     setValue("generalSettings.defaultCurrency", initialData.generalSettings.defaultCurrency || Currency.USD);
  //     setValue("generalSettings.payrollStartDate", initialData.generalSettings.payrollStartDate || 1);
  //     setValue("generalSettings.payrollEndDate", initialData.generalSettings.payrollEndDate || 30);
  //     setValue("generalSettings.paymentDay", initialData.generalSettings.paymentDay || 5);
  //   } else {
  //     reset();
  //   }
  // };

  useEffect(() => {
    if (initialData && initialData.generalSettings) {
      setValue("generalSettings.defaultCurrency", initialData.generalSettings.defaultCurrency || Currency.USD);
      setValue("generalSettings.payrollStartDate", initialData.generalSettings.payrollStartDate || 1);
      setValue("generalSettings.payrollEndDate", initialData.generalSettings.payrollEndDate || 30);
      setValue("generalSettings.paymentDay", initialData.generalSettings.paymentDay || 5);
    }
  }, [initialData, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mb-6">
      <fieldset className="border rounded-lg p-6 bg-gray-50">
        <legend className="text-xl font-semibold px-2 bg-gray-50 text-primary">
          General Settings
        </legend>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="defaultCurrency" className="block text-sm font-medium mb-1 text-gray-700">
              Default Currency <span className="text-red-800">*</span>
            </label>
            <select 
              id="defaultCurrency"
              {...register("generalSettings.defaultCurrency")}
              aria-invalid={errors.generalSettings?.defaultCurrency ? "true" : "false"}
              aria-describedby={errors.generalSettings?.defaultCurrency ? "currency-error" : undefined}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
            >
              {Object.values(Currency).map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {errors.generalSettings?.defaultCurrency && (
              <p id="currency-error" className="text-red-800 text-sm mt-1" role="alert">
                {errors.generalSettings?.defaultCurrency.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="payrollStartDate" className="block text-sm font-medium mb-1 text-gray-700">
                Payroll Start Date <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollStartDate"
                type="number"
                {...register("generalSettings.payrollStartDate", { valueAsNumber: true })}
                aria-invalid={errors.generalSettings?.payrollStartDate ? "true" : "false"}
                aria-describedby={errors.generalSettings?.payrollStartDate ? "start-date-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="1" 
                max="31"
              />
              {errors.generalSettings?.payrollStartDate && (
                <p id="start-date-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.generalSettings?.payrollStartDate.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="payrollEndDate" className="block text-sm font-medium mb-1 text-gray-700">
                Payroll End Date <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollEndDate"
                type="number"
                {...register("generalSettings.payrollEndDate", { valueAsNumber: true })}
                aria-invalid={errors.generalSettings?.payrollEndDate ? "true" : "false"}
                aria-describedby={errors.generalSettings?.payrollEndDate ? "end-date-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="1" 
                max="31"
              />
              {errors.generalSettings?.payrollEndDate && (
                <p id="end-date-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.generalSettings?.payrollEndDate.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="paymentDay" className="block text-sm font-medium mb-1 text-gray-700">
                Payment Day <span className="text-red-800">*</span>
              </label>
              <input 
                id="paymentDay"
                type="number"
                {...register("generalSettings.paymentDay", { valueAsNumber: true })}
                aria-invalid={errors.generalSettings?.paymentDay ? "true" : "false"}
                aria-describedby={errors.generalSettings?.paymentDay ? "payment-day-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="1" 
                max="31"
              />
              {errors.generalSettings?.paymentDay && (
                <p id="payment-day-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.generalSettings?.paymentDay.message}
                </p>
              )}
            </div>
          </div>
          
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button 
            type="submit"
            disabled={isSubmitting || !isDirty}
             className="px-5 py-3 bg-primary text-white font-medium rounded-md border border-primary transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-auto"
            aria-label="Save general settings"
          >
            {isSubmitting ? (
              <>
                <Loader/>
         
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          
          {/* <button 
            type="button"
            onClick={handleReset}
            disabled={isSubmitting || !isDirty}
            className="px-5 py-3 bg-primary text-white font-medium rounded-md border border-primary transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-auto"
            aria-label="Reset form"
          >
            Reset Form
          </button> */}
        </div>
      </fieldset>
    </form>
  );
}

function PayrollSettingsForm({ initialData }: { initialData: PayrollSettingsFormValues }) {
  const [isSubmitting, startTransition] = useTransition();
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isValid, isDirty }, 
  } = useForm<PayrollSettingsFormValues>({
    resolver: zodResolver(PayrollSettingsFormSchema),
    mode: "onChange",
    defaultValues: initialData
  });

  // Set initial form values when component mounts or initialData changes
  useEffect(() => {
    if (initialData && initialData.payrollSettings) {
      setValue("payrollSettings.overtimeRate", initialData.payrollSettings.overtimeRate || 1.5);
      setValue("payrollSettings.weekendRate", initialData.payrollSettings.weekendRate || 1.5);
      setValue("payrollSettings.holidayRate", initialData.payrollSettings.holidayRate || 2);
      setValue("payrollSettings.maxOvertimeHours", initialData.payrollSettings.maxOvertimeHours || 40);
      setValue("payrollSettings.minWorkingHours", initialData.payrollSettings.minWorkingHours || 40);
    }
  }, [initialData, setValue]);

  const onSubmit = (data: PayrollSettingsFormValues) => {
    startTransition(async () => {
      const result = await updatePayrollSettings(data);
      toast.success("Payroll settings updated successfully");
    });
  };

  const handleReset = () => {
    if (initialData && initialData.payrollSettings) {
      setValue("payrollSettings.overtimeRate", initialData.payrollSettings.overtimeRate || 1.5);
      setValue("payrollSettings.weekendRate", initialData.payrollSettings.weekendRate || 1.5);
      setValue("payrollSettings.holidayRate", initialData.payrollSettings.holidayRate || 2);
      setValue("payrollSettings.maxOvertimeHours", initialData.payrollSettings.maxOvertimeHours || 40);
      setValue("payrollSettings.minWorkingHours", initialData.payrollSettings.minWorkingHours || 40);
    } else {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="border rounded-lg p-6 bg-gray-50">
        <legend className="text-xl font-semibold px-2 bg-gray-50 text-primary">
          Payroll Settings
        </legend>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="payrollSettings.overtimeRate" className="block text-sm font-medium mb-1 text-gray-700">
                Overtime Rate <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollSettings.overtimeRate"
                type="number"
                step="0.1"
                {...register("payrollSettings.overtimeRate", { valueAsNumber: true })}
                aria-invalid={errors.payrollSettings?.overtimeRate ? "true" : "false"}
                aria-describedby={errors.payrollSettings?.overtimeRate ? "overtime-rate-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="1"
              />
              {errors.payrollSettings?.overtimeRate && (
                <p id="overtime-rate-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.payrollSettings.overtimeRate.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="payrollSettings.weekendRate" className="block text-sm font-medium mb-1 text-gray-700">
                Weekend Rate <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollSettings.weekendRate"
                type="number"
                step="0.1"
                {...register("payrollSettings.weekendRate", { valueAsNumber: true })}
                aria-invalid={errors.payrollSettings?.weekendRate ? "true" : "false"}
                aria-describedby={errors.payrollSettings?.weekendRate ? "weekend-rate-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="1"
              />
              {errors.payrollSettings?.weekendRate && (
                <p id="weekend-rate-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.payrollSettings.weekendRate.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="payrollSettings.holidayRate" className="block text-sm font-medium mb-1 text-gray-700">
                Holiday Rate <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollSettings.holidayRate"
                type="number"
                step="0.1"
                {...register("payrollSettings.holidayRate", { valueAsNumber: true })}
                aria-invalid={errors.payrollSettings?.holidayRate ? "true" : "false"}
                aria-describedby={errors.payrollSettings?.holidayRate ? "holiday-rate-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="1"
              />
              {errors.payrollSettings?.holidayRate && (
                <p id="holiday-rate-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.payrollSettings.holidayRate.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="payrollSettings.maxOvertimeHours" className="block text-sm font-medium mb-1 text-gray-700">
                Maximum Overtime Hours <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollSettings.maxOvertimeHours"
                type="number"
                {...register("payrollSettings.maxOvertimeHours", { valueAsNumber: true })}
                aria-invalid={errors.payrollSettings?.maxOvertimeHours ? "true" : "false"}
                aria-describedby={errors.payrollSettings?.maxOvertimeHours ? "max-overtime-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="0"
              />
              {errors.payrollSettings?.maxOvertimeHours && (
                <p id="max-overtime-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.payrollSettings.maxOvertimeHours.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="payrollSettings.minWorkingHours" className="block text-sm font-medium mb-1 text-gray-700">
                Minimum Working Hours <span className="text-red-800">*</span>
              </label>
              <input 
                id="payrollSettings.minWorkingHours"
                type="number"
                {...register("payrollSettings.minWorkingHours", { valueAsNumber: true })}
                aria-invalid={errors.payrollSettings?.minWorkingHours ? "true" : "false"}
                aria-describedby={errors.payrollSettings?.minWorkingHours ? "min-working-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                min="0"
              />
              {errors.payrollSettings?.minWorkingHours && (
                <p id="min-working-error" className="text-red-800 text-sm mt-1" role="alert">
                  {errors.payrollSettings.minWorkingHours.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <button 
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-5 py-3 bg-primary text-white font-medium rounded-md border border-primary transition duration-300 ease-in-out hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-auto"
            aria-label="Save payroll settings"
          >
            {isSubmitting ? (
              <>
                <Loader/>
              
              </>
            ) : (
              "Save Changes"
            )}
          </button>
          
          
        </div>
      </fieldset>
    </form>
  );
}

export default function SettingsForm({initialData}:{initialData:SettingsFormValues}) {
  const [activeTab, setActiveTab] = useState('company-profile');

  const tabs = [
    { id: 'company-profile', label: 'Company Profile' },
    { id: 'general-settings', label: 'General Settings' },
    { id: 'payroll-settings', label: 'Payroll Settings' },
    { id: 'taxes', label: 'Taxes' },
    { id: 'contributions', label: 'Contributions' },
  ];

  return (
    <div className="w-full mx-auto rounded-lg p-6 bg-white shadow-md">
      {(!initialData || 'error' in initialData) ? (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome! Let's set up your company settings</h1>
      ) : (
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Settings</h1>
      )}

      {/* Tab Navigation */}
      <div className="border-b mb-6">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium -mb-px ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'company-profile' && (
          <CompanyProfileForm initialData={initialData} />
        )}
        
        {activeTab === 'general-settings' && (
          <GeneralSettingsForm initialData={initialData} />
        )}
        
        {activeTab === 'payroll-settings' && (
          <PayrollSettingsForm initialData={initialData} />
        )}
        
        {activeTab === 'taxes' && (
          <TaxesForm initialData={initialData.taxes?.map(tax => ({ tax }))} />
        )}
        
        {activeTab === 'contributions' && (
          <ContributionsForm initialData={initialData.contributions?.map(contribution => ({ contribution }))} />
        )}
      </div>
      
      <div className="text-sm text-gray-500 mt-4">
        <p>
          <span className="text-red-800">*</span> indicates required fields
        </p>
      </div>
    </div>
  );
}