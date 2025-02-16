"use client";

import { useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/Modal";
import toast from "react-hot-toast";
import Loader from "@/components/Common/Loader";



const employeeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  secondName: z.string().min(2, "Second name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  employeeID: z.string().min(1, "Employee ID is required"),
  nationalID: z.string().min(1, "National ID/Passport is required"),
  startDate: z.string().min(1, "Start date is required"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  monthlyGross: z.string()
  .transform((val) => Number(val))
  .pipe(z.number().positive("Monthly gross must be positive")),
  currency: z.string().min(1, "Currency is required"),
  department: z.string().min(2, "Department must be at least 2 characters"),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  swiftCode: z.string().optional(),
  Domicile: z.string().optional(),
  walletAddress: z.string().optional(),
});
type FormData = z.infer<typeof employeeSchema>;
type BankType= "none"|"crypto" | "bank"

export default function OnBoarding() {
  const[banckType, setBankType]= useState<BankType>("none");
  const [loading, setLoading] = useState(false);
  const[currencies, setCurrencies]=useState<string[]>([])

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<FormData>({
    resolver: zodResolver(employeeSchema),
    mode: "onBlur"
  });


  const getCurrencies= async()=>{
    try {
      const resp= await fetch("/api/currency");
      const data= await resp.json();
      setCurrencies(data)
      
    } catch (error) {
      toast.error("Unable to fetch Currencies");
      
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(await response.text());
      toast.success("Employee registered successfully");
    } catch (err: any) {
      toast.error(JSON.parse(err.message).error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  useEffect(()=>{
    getCurrencies()
  },[])
  return (
   <Modal title="Employee Onboarding" >
     <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6">
      
       
      
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
         <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
         <legend className="text-xl font-semibold mb-4 col-span-2">Personal Information</legend>
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input 
              {...register("firstName")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Second Name</label>
            <input 
              {...register("secondName")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.secondName && (
                  <p className="text-red-500 text-sm mt-1">{errors.secondName.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              {...register("email")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input 
              {...register("phoneNumber")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input 
              {...register("address")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Employee ID</label>
            <input 
              {...register("employeeID")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.employeeID && (
                  <p className="text-red-500 text-sm mt-1">{errors.employeeID.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">National ID/Passport</label>
            <input 
              {...register("nationalID")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.nationalID && (
                  <p className="text-red-500 text-sm mt-1">{errors.nationalID.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">start Date</label>
            <input 
              {...register("startDate")}
              type="date"
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Job Title</label>
            <input 
              {...register("jobTitle")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.jobTitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.jobTitle.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monthly Gross</label>
            <input 
              type="number"
              step="0.01"
              {...register("monthlyGross")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.monthlyGross && (
                  <p className="text-red-500 text-sm mt-1">{errors.monthlyGross.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select 
              {...register("currency")}
              required
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="" disabled>Select currency</option>
              {currencies.map(currency=>{
                return <option key={currency} value={currency}>{currency}</option>

              })}
            </select>
            {errors.currency && (
                  <p className="text-red-500 text-sm mt-1">{errors.currency.message}</p>
                )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <input 
              {...register("department")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.department && (
                  <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
                )}
          </div>
         </fieldset>

           <fieldset className="mt-8">
           <legend className="text-xl font-semibold mb-4">Bank Details</legend>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">  
                <button 
                  onClick={() => setBankType("bank")}
                  className="h-12 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  type="button"
                >
                  Bank
                </button>
                <button 
                  onClick={() => setBankType("crypto")}
                  className="h-12 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  type="button"
                >
                  Crypto Wallet
                </button>
              </div>
          {banckType=="bank"&&<>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
           <div>
           <label className="block text-sm font-medium mb-1">Bank Name</label>
            <input 
              {...register("bankName")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.bankName && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankName.message}</p>
                )}
           
           </div>
           <div>
           <label className="block text-sm font-medium mb-1">Bank Account Number</label>
            <input 
              {...register("bankAccountNumber")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.bankAccountNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.bankAccountNumber.message}</p>
                )}
           </div>
           
           <div>
           <label className="block text-sm font-medium mb-1">Swift Code</label>
            <input 
              {...register("swiftCode")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.swiftCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.swiftCode.message}</p>
                )}
           </div>
         
           <div>
           <label className="block text-sm font-medium mb-1">Domicile</label>
            <input 
              {...register("Domicile")}
             className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            {errors.Domicile && (
                  <p className="text-red-500 text-sm mt-1">{errors.Domicile.message}</p>
                )}
           </div>
          </div>
          </>}
          {banckType=="crypto"&& <div>
            <div>
                  <label className="block text-sm font-medium mb-2">Wallet Address</label>
                  <input 
                    {...register("walletAddress")}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  {errors.walletAddress && (
                    <p className="text-red-500 text-sm mt-1">{errors.walletAddress.message}</p>
                  )}
                </div>
          </div>}
           </fieldset>
          <div className="flex gap-6">
            <button 
              type="submit"
              disabled={loading}
               className="flex-1 p-2  flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-dark"
            >
              Submit {loading && <Loader/>}
            </button>
             
          </div>
        </form>

       
    </div>
   </Modal>
  );
}