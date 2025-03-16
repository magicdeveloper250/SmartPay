"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Loader from "@/components/Common/Loader";
import { editEmployeeSchema, editEmployeeSchemaType } from "@/validations/employeeSchema";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Currency, Employee, Gender, PaymentFrequency } from "@prisma/client";
import { getEmployee, updateEmployeeData } from "@/actions/employeeActions";
import toast from "react-hot-toast";
import { ContractorDetailsSkeleton } from "../ContractorDetails/skeleton";
import { SubmitHandler } from "react-hook-form";

export default function EditEmployeeForm({employeeId}:{employeeId:string}) {
  const [isSubmitting, startTransition] = useTransition();
  const[isLoadingEmployee, startLoadingTransition]= useTransition()
  const router= useRouter();
  const[employee, setEmployee]= useState<Employee|null>(null)

  const getUpdateEmployee= ()=>{
    startLoadingTransition(async()=>{
      let employee = await getEmployee(employeeId);
      if ("error" in employee)
        toast.error(employee.error)
      else{
        setEmployee(employee)
       
      }
    })
  }
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isValid, isDirty }, 
  } = useForm<editEmployeeSchemaType>({
    resolver: zodResolver(editEmployeeSchema),
    mode: "onChange" 
  });

 

  const onSubmit: SubmitHandler<editEmployeeSchemaType> = (data) => {
    
    startTransition(async () => {
      try {
        const result = await updateEmployeeData(employeeId, data);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("Employee data updated successfully.");
          router.back()
        }
      } catch (error) {
        toast.error("Failed to update Employee data.");
      }
    });
  };

 

useEffect(()=>{
  getUpdateEmployee()
},[])
   
useEffect(()=>{
  setValue("id", employee?.id || "" ),
  setValue("firstName", employee?.firstName || "")
  setValue("secondName", employee?.secondName || "")
  setValue("email", employee?.email || "")
  setValue("address", employee?.address || "")
  setValue("department", employee?.department || "")
  setValue("jobTitle", employee?.jobTitle || "")
  setValue("monthlyGross", employee?.monthlyGross || 0)
  setValue("nationalID", employee?.nationalID || "")
  setValue("phoneNumber", employee?.phoneNumber || "")
  setValue("startDate", employee?.startDate || new Date())
  setValue("employeeID", employee?.employeeID || "")
},[employee])
  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg p-6 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Employee Details</h1>
      {isLoadingEmployee ? <ContractorDetailsSkeleton/>:
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" aria-label="Employee registration form">
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
              <label htmlFor="secondName" className="block text-sm font-medium mb-1 text-gray-700">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input 
                id="dob"
                {...register("dob")}
                type="date"
                aria-invalid={errors.dob ? "true" : "false"}
                aria-describedby={errors.dob ? "dob-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter last name"
              />
              {errors.dob && (
                <p id="dob-error" className="text-red-500 text-sm mt-1" role="alert">{errors.dob.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="currency" className="block text-sm font-medium mb-1 text-gray-700">
                Gender <span className="text-red-500">*</span>
              </label>
              <select 
                id="gender"
                {...register("gender")}
                aria-invalid={errors.gender ? "true" : "false"}
                aria-describedby={errors.gender ? "gender-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="" disabled>Select gender</option>
                {Object.values(Gender).map(gender => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
              {errors.gender && (
                <p id="gender-error" className="text-red-500 text-sm mt-1" role="alert">{errors.gender.message}</p>
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
              <label htmlFor="employeeID" className="block text-sm font-medium mb-1 text-gray-700">
                Employee ID <span className="text-red-500">*</span>
              </label>
              <input 
                id="employeeID"
                {...register("employeeID")}
                aria-invalid={errors.employeeID ? "true" : "false"}
                aria-describedby={errors.employeeID ? "employeeID-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter employee ID"
                disabled
              />
              {errors.employeeID && (
                <p id="employeeID-error" className="text-red-500 text-sm mt-1" role="alert">{errors.employeeID.message}</p>
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
              <label htmlFor="Domicile" className="block text-sm font-medium mb-1 text-gray-700">
                Domicile  <q>Permanent Resident</q> <span className="text-red-500">*</span>
              </label>
              <input 
                id="Domicile"
                {...register("Domicile")}
                aria-invalid={errors.Domicile ? "true" : "false"}
                aria-describedby={errors.Domicile ? "Domicile-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter domicile"
              />
              {errors.Domicile && (
                <p id="Domicile-error" className="text-red-500 text-sm mt-1" role="alert">{errors.Domicile.message}</p>
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
              <label htmlFor="startDate" className="block text-sm font-medium mb-1 text-gray-700">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input 
                id="startDate"
                {...register("startDate")}
                type="date"
                aria-invalid={errors.startDate ? "true" : "false"}
                aria-describedby={errors.startDate ? "startDate-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
              {errors.startDate && (
                <p id="startDate-error" className="text-red-500 text-sm mt-1" role="alert">{errors.startDate.message}</p>
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
              <label htmlFor="monthlyGross" className="block text-sm font-medium mb-1 text-gray-700">
                Gross Salary <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input 
                  id="monthlyGross"
                  type="number"
                  step="0.01"
                  {...register("monthlyGross")}
                  aria-invalid={errors.monthlyGross ? "true" : "false"}
                  aria-describedby={errors.monthlyGross ? "monthlyGross-error" : undefined}
                  className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
              </div>
              {errors.monthlyGross && (
                <p id="monthlyGross-error" className="text-red-500 text-sm mt-1" role="alert">{errors.monthlyGross.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium mb-1 text-gray-700">
                Payment Frequency <span className="text-red-500">*</span>
              </label>
              <select 
                id="frequency"
                {...register("paymentFrequency")}
                aria-invalid={errors.paymentFrequency ? "true" : "false"}
                aria-describedby={errors.paymentFrequency ? "frequency-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="" disabled>Select frequency</option>
                {Object.values(PaymentFrequency).map(frequency => (
                  <option key={frequency} value={frequency}>{frequency}</option>
                ))}
              </select>
              {errors.paymentFrequency && (
                <p id="frequency-error" className="text-red-500 text-sm mt-1" role="alert">{errors.paymentFrequency.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="currency" className="block text-sm font-medium mb-1 text-gray-700">
                Currency <span className="text-red-500">*</span>
              </label>
              <select 
                id="currency"
                {...register("currency")}
                aria-invalid={errors.currency ? "true" : "false"}
                aria-describedby={errors.currency ? "currency-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none bg-white"
              >
                <option value="" disabled>Select currency</option>
                {Object.values(Currency).map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
              {errors.currency && (
                <p id="currency-error" className="text-red-500 text-sm mt-1" role="alert">{errors.currency.message}</p>
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
            aria-label="Submit employee registration form"
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