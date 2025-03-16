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
  const  getPricingData= async()=>{
    try {
      const result= await getPlansWithFeatures()
      if("error" in result){
        toast.error(result.error)
      }else{
        setPricingData(result)
      }
      
    } catch (error) {
      
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
        </div>
      </div>
    </section>
   </HeaderLayout>
  );
};

export default Pricing;
