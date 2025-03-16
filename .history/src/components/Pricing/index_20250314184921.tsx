"use client";
import HeaderLayout from "@/app/headerLayout";
import SectionTitle from "../Common/SectionTitle";
import PricingBox from "./PricingBox";
import { useEffect, useState } from "react";
import { PlanWithFeatures } from "@/types/planWithFeaturesAndOffer";
import { getPlansWithFeatures } from "@/actions/planActions";
import toast from "react-hot-toast";

const Pricing = () => {
  const [pricingData, setPricingData]= useState<PlanWithFeatures[]>([])
 const[error, setError]= useState<boolean>(false)
  const  getPricingData= async()=>{
    try {
      const result= await getPlansWithFeatures()
      if("error" in result){
        toast.error(result.error)
        setError(true)
      }else{
        setPricingData(result)

      }
      
    } catch (error) {
      setError(true)
      toast.error("failed to fetch pricing data")
      
    }
  }
  useEffect(()=>{
      getPricingData()
  }, [])
  return (
   <HeaderLayout>
     <section
      id="pricing"
      className="relative z-20 overflow-hidden bg-white pb-12 pt-20 dark:bg-dark lg:pb-[90px] lg:pt-[120px]"
    >
      <div className="container">
        <div className="mb-[60px]">
          <SectionTitle
            subtitle="Pricing Table"
            title="Our Pricing Plan"
            paragraph="There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form."
            center
          />
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {pricingData.map((plan, i) => (
            <PricingBox key={i} plan={plan} />
          ))}    
          {error&&  <button
                  onClick={() => getPricingData}
                  
                  className="group flex w-fit justify-center rounded-md px-3 py-2.5
                           text-sm text-gray-700 hover:bg-indigo-50 transition duration-150"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center 
                                rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                    
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Reload</p>
                     
                  </div>
                </button>} 
        </div>
      </div>
    </section>
   </HeaderLayout>
  );
};

export default Pricing;
