 "use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import Loader from "@/components/Common/Loader";
import countriesData from "@/data/countries.json"; 
import industries from "@/data/industries.json";
import HeaderLayout from "@/app/headerLayout";
import { CompanyRegisterData } from "@/types/CompanyRegister";

interface Country {
  name: string;
  iso2: string;
  cities: string[];
}

interface ErrorResponse {
  error: string;
}

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");  
  const [cities, setCities] = useState<any[]>([]);  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formIsValid, setFormIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Form state object to track all field values
  const [formData, setFormData] = useState ({
    companyName: "",
    adminName: "",
    adminEmail: "",
    password: "",
    country: "",
    city: "",
    industry: "",
    pensionCode: "",
    email:"",
    phoneNumber:""
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

  // Validate form fields on change
  useEffect(() => {
    const allFieldsFilled = Object.values(formData).every(value => value !== "");
    const passwordsMatch = password === confirmPassword;
    const passwordLongEnough = password.length >= 8;
    
    setFormIsValid(allFieldsFilled && passwordsMatch && passwordLongEnough);
  }, [formData, password, confirmPassword]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    setIsDirty(true);
    
    if (name === "country") {
      setSelectedCountry(value);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setFormData(prev => ({
      ...prev,
      password: value
    }));
    
    if (confirmPassword) {
      if (value !== confirmPassword) {
        setPasswordError("Passwords do not match");
      } else if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long");
      } else {
        setPasswordError("");
      }
    } else if (value.length < 8 && value.length > 0) {
      setPasswordError("Password must be at least 8 characters long");
    } else {
      setPasswordError("");
    }
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

  const handleReset = () => {
    if (isDirty && window.confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
      setFormData({
        companyName: "",
        adminName: "",
        adminEmail: "",
        password: "",
        country: "",
        city: "",
        industry: "",
        pensionCode: "",
        phoneNumber:"",
        email:""
      });
      setPassword("");
      setConfirmPassword("");
      setSelectedCountry("");
      setPasswordError("");
      setIsDirty(false);
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setLoading(true);
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const finalData = Object.fromEntries(formData.entries());
    
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      });
      const error: ErrorResponse = await response.json();

      if (response.ok && !error.error) {
        toast.success("Successfully registered");
        router.push("/signin");
      } else {
        toast.error(error.error || "Registration failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
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
                
                <form onSubmit={handleSubmit} aria-label="Company registration form">
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
                        placeholder="Enter company name"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        aria-required="true"
                        aria-invalid={formData.companyName === ""}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                    </div>

                    {/* Admin Name */}
                    <div className="mb-4">
                      <label htmlFor="adminName" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Name of Company Admin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="adminName"
                        placeholder="Enter admin name"
                        name="adminName"
                        required
                        value={formData.adminName}
                        onChange={handleInputChange}
                        aria-required="true"
                        aria-invalid={formData.adminName === ""}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
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
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              aria-required="true"
                              aria-invalid={formData.email === ""}
                              className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                            />
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
                        name="adminEmail"
                        required
                        value={formData.adminEmail}
                        onChange={handleInputChange}
                        aria-required="true"
                        aria-invalid={formData.adminEmail === ""}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                    </div>

                     {/* Admin Email */}
                     <div className="mb-4">
                      <label htmlFor="phoneNumber" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Phone Number of Company Admin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="phoneNumber"
                        placeholder="+250790000000"
                        name="phoneNumber"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        aria-required="true"
                        aria-invalid={formData.phoneNumber === ""}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </fieldset>
                  
                  <fieldset className="mb-6 border rounded-lg p-6 bg-gray-50 dark:bg-dark-3">
                    <legend className="text-base font-semibold px-2 text-blue-700 dark:text-blue-400">
                      Security
                    </legend>
                    
                    {/* Password */}
                    <div className="mb-4">
                      <label htmlFor="password" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Create a secure password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        aria-required="true"
                        aria-invalid={password === "" || password.length < 8}
                        aria-describedby="password-requirements"
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                      <p id="password-requirements" className="text-xs mt-1 text-left text-gray-500 dark:text-gray-400">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    {/* Confirm Password */}
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

                    {/* Password Error Message */}
                    {passwordError && (
                      <div className="mb-4 text-red-500 text-sm text-left" role="alert">
                        {passwordError}
                      </div>
                    )}
                  </fieldset>
                  
                  <fieldset className="mb-6 border rounded-lg p-6 bg-gray-50 dark:bg-dark-3">
                    <legend className="text-base font-semibold px-2 text-blue-700 dark:text-blue-400">
                      Business Details
                    </legend>
                    
                    {/* Country Dropdown */}
                    <div className="mb-4">
                      <label htmlFor="country" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Country <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={selectedCountry}
                        onChange={handleInputChange}
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
                    </div>

                    {/* City Dropdown */}
                    <div className="mb-4">
                      <label htmlFor="city" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        City <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="city"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!selectedCountry}
                        aria-required="true"
                        aria-invalid={formData.city === ""}
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
                    </div>

                    {/* Company Industry */}
                    <div className="mb-4">
                      <label htmlFor="industry" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Industry <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="industry"
                        name="industry"
                        required
                        value={formData.industry}
                        onChange={handleInputChange}
                        aria-required="true"
                        aria-invalid={formData.industry === ""}
                        className="w-full rounded-md border border-stroke bg-white px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
                      >
                        <option value="" disabled>Select Industry</option>
                        {industries.map((industry, index) => (
                          <option key={index} value={industry}>
                            {industry}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Company Pension Code */}
                    <div className="mb-4">
                      <label htmlFor="pensionCode" className="block text-sm font-medium mb-1 text-left text-gray-700 dark:text-gray-300">
                        Company Pension Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="pensionCode"
                        placeholder="Enter company pension code"
                        name="pensionCode"
                        required
                        value={formData.pensionCode}
                        onChange={handleInputChange}
                        aria-required="true"
                        aria-invalid={formData.pensionCode === ""}
                        className="w-full rounded-md border border-stroke bg-transparent px-5 py-3 text-base text-dark outline-none transition placeholder:text-dark-6 focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:text-white dark:focus:border-primary"
                      />
                    </div>
                  </fieldset>

                  {/* Progress tracker */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100 dark:bg-blue-900/20 dark:border-blue-800" role="status" aria-live="polite">
                    <h2 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Form Completion Status</h2>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${formIsValid ? '100%' : isDirty ? '50%' : '0%'}` }}
                        aria-hidden="true"
                      ></div>
                    </div>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                      {formIsValid 
                        ? "All required fields completed! Ready to submit." 
                        : isDirty 
                          ? "Please complete all required fields."
                          : "Please fill in the form to register your company."
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button
                      type="submit"
                      disabled={loading || !formIsValid}
                      className="flex w-full cursor-pointer items-center justify-center rounded-md border border-primary bg-primary px-5 py-3 text-base text-white transition duration-300 ease-in-out hover:bg-blue-700 disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed"
                      aria-label="Register company"
                    >
                      {loading ? (
                        <>
                          Submitting <Loader />
                        </>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={loading || !isDirty}
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