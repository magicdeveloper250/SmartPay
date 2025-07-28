 "use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect, useTransition } from "react";
import countriesData from "@/data/countries.json"; 
import industries from "@/data/industries.json";
import HeaderLayout from "@/app/headerLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySchemaType,companySchema } from "@/validations/companyRegistration";
import { createCompany } from "@/actions/companyActions";
import {Loader} from "lucide-react"
 

interface Country {
  name: string;
  iso2: string;
  cities: string[];
}

 
 

const SignUp = () => {
  const router = useRouter();
  
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");  
  const [cities, setCities] = useState<any[]>([]);  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
   const [isPending, startTransition]= useTransition()
 
 
   const { 
     register, 
     handleSubmit, 
     setValue,
     reset,
     formState: { errors, isValid, isDirty }
   } = useForm<CompanySchemaType>({
     resolver: zodResolver(companySchema),
     mode: "onChange"  
   });

  useEffect(() => {
    if (Array.isArray(countriesData)) {
      setCountries(countriesData as Country[]);
    } else {
      console.error("Invalid countriesData format:", countriesData);
      setCountries([]);  
    }
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const selectedCountryData = countries.find(
        (country) => country.name === selectedCountry
      );
      if (selectedCountryData) {
        setCities(selectedCountryData.cities);
      }
    } else {
      setCities([]);  
    }
  }, [selectedCountry, countries]);

 

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };
 
  

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value !== password) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

 

  const onSubmit = (data: CompanySchemaType) => {
    
  startTransition(async()=>{
    if (!validatePassword()) return;
    try {
      const response = await  createCompany(data)
      

      if (response?.error ) {
        toast.error(response?.error || "Registration failed");
      } else {
        toast.success("Company registered successfully");
        reset();
        router.push("/signin");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }  
  })
  };

  return (
    <HeaderLayout>
      <section className="bg-[#F4F7FF] py-14 dark:bg-dark lg:py-[90px]">
        <div className="container" aria-labelledby="registration-title">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div
                className="shadow-form relative mx-auto max-w-[600px] overflow-hidden rounded-xl bg-white px-8 py-14 text-center dark:bg-dark-2 sm:px-12 md:px-[60px]"
                data-wow-delay=".15s"
              >
                <div className="mb-8 text-center">
                  <Link href="/" className="mx-auto inline-block max-w-[160px]" aria-label="Go to home page">
                    <Image
                      src="/images/logo/logo.svg"
                      alt="Company logo"
                      width={140}
                      height={30}
                      className="dark:hidden"
                    />
                    <Image
                      src="/images/logo/logo-white.svg"
                      alt="Company logo"
                      width={140}
                      height={30}
                      className="hidden dark:block"
                    />
                  </Link>
                  <h2 id="registration-title" className="mt-6 text-2xl font-bold text-gray-800 dark:text-white">Company Registration</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Create your company account and get started</p>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} aria-label="Company registration form">
                  <fieldset className="mb-6 border rounded-lg p-6 bg-gray-50 dark:bg-dark-3">
                    <legend className="text-base font-semibold px-2 text-blue-700 dark:text-blue-400">
                      Company Information
                    </legend>
                    
                    {/* Company Name */}
                    <div className="mb-4">
                      <label htmlFor="companyName" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        {...register("companyName")}
                        placeholder="Enter company name"
                        name="companyName"
                        required
                        aria-required="true"
                        aria-invalid={errors.companyName ? "true" : "false"}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                      {errors.companyName && (
                        <p id="companyName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.companyName.message}</p>)}
                    </div>

                  
                        {/* Company Email */}
                        <div className="mb-4">
                            <label htmlFor="adminEmail" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                              Email of Company <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              placeholder="admin@company.com"
                              {...register("email")}
                              aria-required="true"
                              aria-invalid={errors.email ? "true" : "false"}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
                            {errors.email && (
                              <p id="email-error" className="text-red-500 text-sm mt-1" role="alert">{errors.email.message}</p>)}
                    </div>


                      {/* Country Dropdown */}
                      <div className="mb-4">
                      <label htmlFor="country" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        required
                        value={selectedCountry}
                        {...register("country")}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        aria-required="true"
                        aria-invalid={selectedCountry === ""}
                        className="w-full rounded-md border border-stroke bg-white px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      >
                        <option value="" disabled>Select Country</option>
                        {countries.map((country) => (
                          <option key={country.iso2} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p id="country-error" className="text-red-500 text-sm mt-1" role="alert">{errors.country.message}</p>)}
                    </div>

                    
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="city"
                       
                        required
                        {...register("city")}
                    
                        disabled={!selectedCountry}
                        aria-required="true"
                        aria-invalid={ errors.city? "true" : "false"}
                        aria-disabled={!selectedCountry}
                        className="w-full rounded-md border border-stroke bg-white px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary disabled:bg-gray-100 disabled:text-gray-500 dark:disabled:bg-dark-4 dark:disabled:text-gray-400"
                      >
                        <option value="" disabled>{!selectedCountry ? "Select country first" : "Select City"}</option>
                        {cities.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
                      {errors.city && (
                        <p id="city-error" className="text-red-500 text-sm mt-1" role="alert">{errors.city.message}</p>)}
                    </div>

                    {/* Company Industry */}
                    <div className="mb-4">
                      <label htmlFor="industry" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="industry"
                        required
                        {...register("industry")}
                        aria-required="true"
                        aria-invalid= {errors.industry ? "true" : "false"}
                        className="w-full rounded-md border border-stroke bg-white px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      >
                        <option value="" disabled>Select Industry</option>
                        {industries.map((industry, index) => (
                          <option key={index} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                      {errors.industry && (
                        <p id="industry-error" className="text-red-500 text-sm mt-1" role="alert">{errors.industry.message}</p>)}
                    </div>

                  
                    <div className="mb-4">
                      <label htmlFor="pensionCode" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Company Pension Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pensionCode"
                        placeholder="Enter company pension code"
                       
                        required
                        {...register("pensionCode")}
                        aria-required="true"
                        aria-invalid= {errors.pensionCode ? "true" : "false"}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                       {errors.pensionCode && (
                          <p id="pensionCode-error" className="text-red-500 text-sm mt-1" role="alert">{errors.pensionCode.message}</p>
                        )}
                    </div>

                  
                  </fieldset>
                  
                  <fieldset className="mb-6 border rounded-lg p-6 bg-gray-50 dark:bg-dark-3">
                    <legend className="text-base font-semibold px-2 text-blue-700 dark:text-blue-400">
                      Security
                    </legend>
                          {/* Admin Name */}
                    <div className="mb-4">
                      <label htmlFor="adminName" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Name of Company Admin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="adminName"
                        placeholder="Enter admin name"
                        {...register("adminName")}
           
                        aria-invalid={errors.adminName? "true" : "false"}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                      {errors.adminName && (
                        <p id="adminName-error" className="text-red-500 text-sm mt-1" role="alert">{errors.adminName.message}</p>)}
                    </div>

                      {/* Admin Email */}
                      <div className="mb-4">
                      <label htmlFor="adminEmail" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Email of Company Admin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="adminEmail"
                        placeholder="admin@company.com"
                        required
                        {...register("adminEmail")}
                        aria-required="true"
                        aria-invalid= {errors.adminEmail ? "true" : "false"}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                      {errors.adminEmail && (
                        <p id="adminEmail-error" className="text-red-500 text-sm mt-1" role="alert">{errors.adminEmail.message}</p>)}
                    </div>

                   
                     <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Phone Number of Company Admin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="phoneNumber"
                        placeholder="+250790000000"
                     
                        required
                        {...register("phoneNumber")}
                        aria-required="true"
                        aria-invalid ={errors.phoneNumber ? "true" : "false"}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                      {errors.phoneNumber && (
                        <p id="phoneNumber-error" className="text-red-500 text-sm mt-1" role="alert">{errors.phoneNumber.message}</p>)}
                    </div>
                    
                    {/* Password */}
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Create a secure password"
                   
                        value={password}
                        {...register("password")}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-required="true"
                        aria-invalid={errors.password ? "true" : "false"}
                        aria-describedby="password-requirements"
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                      {errors.password && (
                        <p id="password-error" className="text-red-500 text-sm mt-1" role="alert">{errors.password.message}</p>)}
                    
                    </div>

                  
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        required
                        aria-required="true"
                        aria-invalid={confirmPassword === "" || confirmPassword !== password}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                    </div>

                   
                  {passwordError && (
                      <p id="password-error" className="text-red-500 text-sm mt-1" role="alert">{passwordError}</p>)}
                  </fieldset>
                  
                 

                
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800" role="status" aria-live="polite">
                    <h2 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Form Completion Status</h2>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${isValid ? '100%' : isDirty ? '50%' : '0%'}` }}
                        aria-hidden="true"
                      ></div>
                    </div>
                    
                  </div>

                 
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                      type="submit"
                      disabled={isPending || !isDirty}
                      className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-700 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                      aria-label="Register company"
                    >
                      {isPending ? (
                        <>
                          Submitting <Loader className="w-5 h-5 animate-spin"/>
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={()=>reset()}
                      disabled={isPending || !isDirty}
                      className="w-full px-5 py-3 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 bg-white dark:bg-dark-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Reset form"
                    >
                      Reset Form
                    </button>
                  </div>

                  <p className="text-body-secondary mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="text-red-500">*</span> indicates required fields
                  </p>

                  <p className="text-body-secondary mb-4 text-sm text-gray-500 dark:text-gray-400">
                    By creating an account you agree with our{" "}
                    <a href="/#" className="text-primary hover:underline">
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="/#" className="text-primary hover:underline">
                      Terms of Service
                    </a>
                  </p>

                  <p className="text-body-secondary text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="text-primary hover:underline"
                    >
                      Sign In
                    </Link>
                  </p>
                </form>

                <div>
                  <span className="absolute right-1 top-1">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      {/* SVG circles */}
                    </svg>
                  </span>
                  <span className="absolute bottom-1 left-1">
                    <svg
                      width="29"
                      height="40"
                      viewBox="0 0 29 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      {/* SVG circles */}
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HeaderLayout>
  );
};

export default SignUp;