"use client";

import { useState} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";
import { employeeSchema, employeeSchemaType } from "@/validations/employeeSchema";
import { useTransition } from "react";
import type { BankType } from "@/types/bankType";
import { createEmployee } from "@/actions/employeeActions";
import { Currency, Gender, PaymentFrequency } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function EmployeeForm() {
  const [bankType, setBankType] = useState<BankType>("phone");
  const [isSubmitting, startTransition] = useTransition();
  const router= useRouter();
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors, isValid, isDirty }, 
  } = useForm<employeeSchemaType>({
    resolver: zodResolver(employeeSchema),
    mode: "onChange" 
  });

  const handlePaymentMethodChange = (type: BankType) => {
    setBankType(type);
    setValue("paymentMethod", type, { shouldValidate: true });
  };
 

  const onSubmit = (data: employeeSchemaType) => {
    startTransition(async () => {
      const response = await createEmployee(data);
      if (response?.error) {
        toast.error(response?.error || "Registration failed");
      } else {
        toast.success("Employee registered successfully");
        reset();
        router.back();
      }
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
      reset();
      setBankType("phone");
    }
  };

   

  return (
    <div className="w-full max-w-7xl mx-auto rounded-lg p-6 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Registration</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" aria-label="Employee registration form">
        {/* Personal Information Section */}
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
              />
              {errors.nationalID && (
                <p id="nationalID-error" className="text-red-500 text-sm mt-1" role="alert">{errors.nationalID.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="employeeID" className="block text-sm font-medium mb-1 text-gray-700">
                Employee ID  
              </label>
              <input 
                id="employeeID"
                {...register("employeeID")}
                aria-invalid={errors.employeeID ? "true" : "false"}
                aria-describedby={errors.employeeID ? "employeeID-error" : undefined}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                placeholder="Enter employee ID"
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
            
          
          </div>
        </fieldset>

  
        <fieldset className="border rounded-lg p-6 bg-gray-50">
          <legend className="text-xl font-semibold px-2 bg-gray-50 text-priary">
            Payment Details
          </legend>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Select your preferred payment method:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Payment method">  
              <button 
                type="button"
                onClick={() => handlePaymentMethodChange("bank")}
                className={`h-12 border-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  bankType === "bank" 
                    ? "border-primary bg-blue-50 text-priary font-medium" 
                    : "border-gray-200 hover:border-primary hover:bg-blue-50 text-gray-700"
                }`}
                aria-pressed={bankType === "bank"}
                aria-label="Bank payment method"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
                Bank
              </button>
              <button 
                type="button"
                onClick={() => handlePaymentMethodChange("crypto")}
                className={`h-12 border-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  bankType === "crypto" 
                    ? "border-primary bg-blue-50 text-priary font-medium" 
                    : "border-gray-200 hover:border-primary hover:bg-blue-50 text-gray-700"
                }`}
                aria-pressed={bankType === "crypto"}
                aria-label="Crypto wallet payment method"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                </svg>
                Crypto Wallet
              </button>
              <button 
                type="button"
                onClick={() => handlePaymentMethodChange("phone")}
                className={`h-12 border-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                  bankType === "phone" 
                    ? "border-primary bg-blue-50 text-priary font-medium" 
                    : "border-gray-200 hover:border-primary hover:bg-blue-50 text-gray-700"
                }`}
                aria-pressed={bankType === "phone"}
                aria-label="Mobile phone payment method"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Mobile Phone
              </button>
              <input {...register("paymentMethod")} type="hidden" value={bankType} />
            </div>
          </div>
          
          {/* Bank payment details */}
          {bankType === "bank" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium mb-1 text-gray-700">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="bankName"
                  {...register("bankName")}
                  aria-invalid={errors.bankName ? "true" : "false"}
                  aria-describedby={errors.bankName ? "bankName-error" : undefined}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter bank name"
                />
                {errors.bankName && (
                  <p id="bankName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.bankName.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="bankAccountNumber" className="block text-sm font-medium mb-1 text-gray-700">
                  Bank Account Number <span className="text-red-500">*</span>
                </label>
                <input 
                  id="bankAccountNumber"
                  {...register("bankAccountNumber")}
                  aria-invalid={errors.bankAccountNumber ? "true" : "false"}
                  aria-describedby={errors.bankAccountNumber ? "bankAccountNumber-error" : undefined}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter account number"
                />
                {errors.bankAccountNumber && (
                  <p id="bankAccountNumber-error" className="text-red-500 text-sm mt-1" role="alert">{errors.bankAccountNumber.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="swiftCode" className="block text-sm font-medium mb-1 text-gray-700">
                  Swift Code <span className="text-red-500">*</span>
                </label>
                <input 
                  id="swiftCode"
                  {...register("swiftCode")}
                  aria-invalid={errors.swiftCode ? "true" : "false"}
                  aria-describedby={errors.swiftCode ? "swiftCode-error" : undefined}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter SWIFT code"
                />
                {errors.swiftCode && (
                  <p id="swiftCode-error" className="text-red-500 text-sm mt-1" role="alert">{errors.swiftCode.message}</p>
                )}
              </div>
          
            </div>
          )}
          
          {/* Crypto wallet details */}
          {bankType === "crypto" && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label htmlFor="walletAddress" className="block text-sm font-medium mb-1 text-gray-700">
                  Wallet Address <span className="text-red-500">*</span>
                </label>
                <input 
                  id="walletAddress"
                  {...register("walletAddress")}
                  aria-invalid={errors.walletAddress ? "true" : "false"}
                  aria-describedby={errors.walletAddress ? "walletAddress-error" : undefined}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter crypto wallet address"
                />
                {errors.walletAddress && (
                  <p id="walletAddress-error" className="text-red-500 text-sm mt-1" role="alert">{errors.walletAddress.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Please enter your complete wallet address. Double-check for accuracy.
                </p>
              </div>
            </div>
          )}
          
    
          {bankType === "phone" && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
              <div>
                <label htmlFor="paymentPhone" className="block text-sm font-medium mb-1 text-gray-700">
                  Payment Phone Number <span className="text-red-500">*</span>
                </label>
                <input 
                  id="paymentPhone"
                  {...register("paymentPhone")}
                  aria-invalid={errors.paymentPhone ? "true" : "false"}
                  aria-describedby={errors.paymentPhone ? "paymentPhone-error" : undefined}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  placeholder="Enter mobile payment phone number"
                />
                {errors.paymentPhone && (
                  <p id="paymentPhone-error" className="text-red-500 text-sm mt-1" role="alert">{errors.paymentPhone.message}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Enter the phone number associated with your mobile payment service (e.g., M-Pesa, PayPal).
                </p>
              </div>
            </div>
          )}
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
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              "Register Employee"
            )}
          </button>
          
          <button 
            type="button"
            onClick={handleReset}
            disabled={isSubmitting || !isDirty}
            className="px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 transition duration-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Reset form"
          >
            Reset Form
          </button>
        </div>
        
        <div className="text-sm text-gray-500 mt-4">
          <p>
            <span className="text-red-500">*</span> indicates required fields
          </p>
        </div>
      </form>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100" role="status" aria-live="polite">
        <h2 className="text-sm font-medium text-blue-800 mb-2">Form Completion Status</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${isValid ? '100%' : '0%'}` }}
            aria-hidden="true"
          ></div>
        </div>
        <p className="text-xs text-priary mt-2">
          {isValid ? "All required fields completed! Ready to submit." : "Please complete all required fields."}
        </p>
      </div>
    </div>
  );
}