"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/Common/Loader";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Contractor } from "@prisma/client";
import toast from "react-hot-toast";
import { ContractorDetailsSkeleton } from "../ContractorDetails/skeleton";
import { SubmitHandler } from "react-hook-form";
import { getUpdateContractor, updateContractorData } from "@/actions/contractorActions";
import { editContractorSchema, editContractorSchemaType } from "@/validations/contractorSchema";

export default function EditContractorForm({contractorId}:{contractorId:string}) {
  const [isSubmitting, startTransition] = useTransition();
  const[isLoadingContractor, startLoadingTransition]= useTransition()
  const router= useRouter();
  const[contractor, setContractor]= useState<Contractor|null>(null)


  const getContractor= ()=>{
    startLoadingTransition(async()=>{
      let contractor = await getUpdateContractor(contractorId);
      if ("error" in contractor)
        toast.error(contractor.error)
      else{
        setContractor(contractor)
      }
    })
  }
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isValid, isDirty }, 
  } = useForm<editContractorSchemaType>({
    resolver: zodResolver(editContractorSchema),
    mode: "onChange" 
  });

  console.log(isSubmitting, isDirty,isValid, errors)

  const onSubmit: SubmitHandler<editContractorSchemaType> = (data) => {
    
    startTransition(async () => {
      try {
        const result = await updateContractorData(contractorId, data);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("Contractor data updated successfully.");
          router.back()
        }
      } catch (error) {
        toast.error("Failed to update Contractor data.");
      }
    });
  };

 
useEffect(()=>{
  getContractor()
},[])
   
useEffect(()=>{
  setValue("id", contractor?.id || "" ),
  setValue("firstName", contractor?.firstName || "")
  setValue("secondName", contractor?.secondName || "")
  setValue("email", contractor?.email || "")
  setValue("address", contractor?.address || "")
  setValue("department", contractor?.department || "")
  setValue("jobTitle", contractor?.jobTitle || "")
  setValue("contractorID", contractor?.contractorID || "")
  setValue("nationalID", contractor?.nationalID || "")
  setValue("phoneNumber", contractor?.phoneNumber || "")
  setValue("contractorID", contractor?.contractorID || "")
},[contractor])
  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg p-6 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Contractor Details</h1>
      {isLoadingContractor ? <ContractorDetailsSkeleton/>:
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" aria-label="Contractor registration form">
        <fieldset className="border rounded-lg p-6 bg-gray-50">
          <legend className="text-xl font-semibold px-2 bg-gray-50 text-priary">
            Personal Information
          </legend>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input 
                id="firstName"
                {...register("firstName")}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter first name"
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.firstName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="secondName" className="block text-sm font-medium mb-1 text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input 
                id="secondName"
                {...register("secondName")}
                aria-invalid={errors.secondName ? "true" : "false"}
                aria-describedby={errors.secondName ? "secondName-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter last name"
              />
              {errors.secondName && (
                <p id="secondName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.secondName.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                id="email"
                type="email"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="name@example.com"
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-gray-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input 
                id="phoneNumber"
                type="tel"
                {...register("phoneNumber")}
                aria-invalid={errors.phoneNumber ? "true" : "false"}
                aria-describedby={errors.phoneNumber ? "phoneNumber-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="+1 (123) 456-7890"
              />
              {errors.phoneNumber && (
                <p id="phoneNumber-error" className="text-red-500 text-sm mt-1" role="alert">{errors.phoneNumber.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1 text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input 
                id="address"
                {...register("address")}
                aria-invalid={errors.address ? "true" : "false"}
                aria-describedby={errors.address ? "address-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter your address"
              />
              {errors.address && (
                <p id="address-error" className="text-red-500 text-sm mt-1" role="alert">{errors.address.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="contractorID" className="block text-sm font-medium mb-1 text-gray-700">
                Contractor ID <span className="text-red-500">*</span>
              </label>
              <input 
                id="contractorID"
                {...register("contractorID")}
                aria-invalid={errors.contractorID ? "true" : "false"}
                aria-describedby={errors.contractorID ? "contractorID-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter contractor ID"
                disabled
              />
              {errors.contractorID && (
                <p id="contractorID-error" className="text-red-500 text-sm mt-1" role="alert">{errors.contractorID.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="nationalID" className="block text-sm font-medium mb-1 text-gray-700">
                National ID/Passport <span className="text-red-500">*</span>
              </label>
              <input 
                id="nationalID"
                {...register("nationalID")}
                aria-invalid={errors.nationalID ? "true" : "false"}
                aria-describedby={errors.nationalID ? "nationalID-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter national ID or passport number"
                disabled
              />
              {errors.nationalID && (
                <p id="nationalID-error" className="text-red-500 text-sm mt-1" role="alert">{errors.nationalID.message}</p>
              )}
            </div>
           
            
            <div>
              <label htmlFor="jobTitle" className="block text-sm font-medium mb-1 text-gray-700">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input 
                id="jobTitle"
                {...register("jobTitle")}
                aria-invalid={errors.jobTitle ? "true" : "false"}
                aria-describedby={errors.jobTitle ? "jobTitle-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter job title"
              />
              {errors.jobTitle && (
                <p id="jobTitle-error" className="text-red-500 text-sm mt-1" role="alert">{errors.jobTitle.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium mb-1 text-gray-700">
                Department <span className="text-red-500">*</span>
              </label>
              <input 
                id="department"
                {...register("department")}
                aria-invalid={errors.department ? "true" : "false"}
                aria-describedby={errors.department ? "department-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter department"
              />
              {errors.department && (
                <p id="department-error" className="text-red-500 text-sm mt-1" role="alert">{errors.department.message}</p>
              )}
            </div>
          </div>
        </fieldset>

       
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            type="submit"
            disabled={isSubmitting || !isDirty || !isValid}
            className="flex justify-center items-center px-6 py-3 bg-primary text-white font-medium rounded-lg transition duration-300 hover:bg-primary focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed sm:flex-1"
            aria-label="Submit contractor registration form"
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
        
        <div className="text-sm text-gray-500 mt-4">
          <p>
            <span className="text-red-500">*</span> indicates required fields
          </p>
        </div>
      </form>
     
     }
      
    
    </div>
  );
}