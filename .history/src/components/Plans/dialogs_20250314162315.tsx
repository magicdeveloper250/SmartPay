 "use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Loader } from 'lucide-react';
import { Plan, Feature, CompanyTier } from '@prisma/client';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
 
import {
  PlanFormSchema,
  CompanyTierFormSchema,
  CompanyTierFormValues,
  FeatureFormSchema,
  FeatureFormValues,
  FeatureSchema,
  OfferFormSchema,
  OfferFormValues,
  OfferIncludeFormSchema,
  PlanFeatureFormSchema, 
  PlanFeatureSchema,
  PlanFormValues,
  PlanSchema,
  Prerequisities,
  prerequisitesFormSchema
} from '@/validations/plansSchema';
import { useTransition } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { PlanWithFeatures, PlanWithFeaturesAndOffers } from '@/types/planWithFeaturesAndOffer';
import toast from 'react-hot-toast';
import { addNewCompanyTier, addNewFeature, addNewOffer, addNewPlan, getCompanyTiers, getFeatures, getPlans, getPlansWithFeatures } from '@/actions/planActions';

interface PlanFormDialogProps {
  open:boolean,
  onSave: (plan: Plan) => void;
  onCancel: () => void;
}

export const PlanFormDialog: React.FC<PlanFormDialogProps> = ({ 
  open,
  onCancel 
}) => {
  const [isSubmitting, startTransition] = useTransition();
  const [companyTiers, setCompanyTiers] = useState<CompanyTier[]>([]);
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isDirty }, 
  } = useForm<PlanFormValues>({
    resolver: zodResolver(PlanFormSchema),
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<PlanFormValues> = (data) => {
    console.log("Form data:", data); 
    startTransition(async () => {
      try {
        const selectedFeatureObjects = availableFeatures
          .filter(feature => selectedFeatureIds.includes(feature.id))
          .map(({ id, name, description }) => ({ 
            id, 
            name, 
            description: description || "" 
          }));
        
        const planWithFeatures = {
          ...data,
          features: {
            features: selectedFeatureObjects
          }
        };
        
        const result = await addNewPlan(planWithFeatures);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("Plan created successfully");
          reset();
          onCancel();
        }
      } catch (error) {
      
        toast.error("Failed to create plan");
      }
    });
  };

  const getPlanCompanyTiers = async () => {
    try {
      const result = await getCompanyTiers();
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setCompanyTiers(result);
      }
    } catch (error) {
      toast.error("Failed to load company tiers.");
    }
  };

  const getAllFeatures = async () => {
    try {
      const result = await getFeatures();  
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setAvailableFeatures(result);
        
        // Transform the result to ensure description is string | undefined
        const transformedFeatures = result.map(feature => ({
          ...feature,
          description: feature.description || undefined
        }));
        
        reset({
          features: {
            features: transformedFeatures,
          },
        });
      }
    } catch (error) {
      toast.error("Failed to load Features.");
    }
  };

  const { fields, append, remove } = useFieldArray({
    name: "features.features",
    control
  });

  useEffect(() => {
    Promise.all([getPlanCompanyTiers(), getAllFeatures()]);
  }, []);

  const handleFeatureSelection = (featureId: string) => {
    setSelectedFeatureIds(prevIds =>
      prevIds.includes(featureId)
        ? prevIds.filter(id => id !== featureId)
        : [...prevIds, featureId]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={() => {}}  
      className="relative z-50"
    >
      <DialogBackdrop 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
      />
      <div className="fixed inset-0 flex w-screen justify-center p-4 h-screen overflow-y-auto">
        <DialogPanel 
          className="w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all h-fit"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4">Create New Plan</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Form fields */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register("plan.name")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.plan?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.plan.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Tier</label>
                  <select
                    {...register("plan.companyTierId")}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  >
                    {companyTiers.map(tier => (
                      <option key={tier.id} value={tier.id}>{tier.name}</option>
                    ))}
                  </select>
                  {errors.plan?.companyTierId && (
                    <p className="text-red-500 text-xs mt-1">{errors.plan.companyTierId.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("plan.price", { valueAsNumber: true })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.plan?.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.plan.price.message}</p>
                  )}
                </div>
              
                <div>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      {...register("plan.isActive")}
                      className="h-4 w-4 text-primary rounded border-gray-300" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      {...register("plan.isRecommended")}
                      className="h-4 w-4 text-primary rounded border-gray-300" 
                    />
                    <span className="ml-2 text-sm text-gray-700">Recommended</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Features</label>
                  <div className="mt-1 space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {availableFeatures.length === 0 ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader className="h-5 w-5 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">Loading features...</span>
                      </div>
                    ) : (
                      availableFeatures.map(feature => (
                        <div 
                          key={feature.id} 
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedFeatureIds.includes(feature.id) 
                              ? 'bg-blue-50 border-blue-400' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleFeatureSelection(feature.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`feature-${feature.id}`}
                              checked={selectedFeatureIds.includes(feature.id)}
                              onChange={() => handleFeatureSelection(feature.id)}
                              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              aria-label={`Select feature ${feature.name}`}
                            />
                            <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm font-medium text-gray-700">
                              {feature.name}
                            </label>
                          </div>
                          {selectedFeatureIds.includes(feature.id) && feature.description && (
                            <p className="mt-2 text-sm text-gray-600 pl-7">
                              {feature.description || "No description available"}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {selectedFeatureIds.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedFeatureIds.length} feature{selectedFeatureIds.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || selectedFeatureIds.length === 0 || !isDirty || Object.keys(errors).length > 0}
                    className={`px-4 py-2 text-white rounded-md ${
                      isSubmitting || selectedFeatureIds.length === 0 || !isDirty || Object.keys(errors).length > 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
interface CompanyTierDialogProps {
  open:boolean,
  onCancel: () => void;
}


export const CompanyTierDialog: React.FC<CompanyTierDialogProps> = ({ 
  open,
  onCancel 
}) => {
  const [isSubmitting, startTransition] = useTransition();
  
  
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isDirty }, 
  } = useForm<CompanyTierFormValues>({
    resolver: zodResolver(CompanyTierFormSchema),
    mode: "onChange",
   
  });


  
  
  const onSubmit: SubmitHandler<CompanyTierFormValues> = (data) => {
    startTransition(async () => {
      try {
        const result = await addNewCompanyTier(data);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("New Company Tier Created successfully.");
          onCancel()
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to create new company tier.");
      }
    });
  };


  return (
    <Dialog
    open={open}
    onClose={() => {}}  
    className="relative z-50"
  >  <DialogBackdrop 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm"
    />      <div className="fixed inset-0 flex w-screen justify-center p-4 h-screen overflow-y-auto">
    <DialogPanel 
       className={`w-full  max-w-md transform rounded-xl bg-white shadow-2xl transition-all h-fit`}

    >
      <div className="flex items-center justify-between p-4 border-b">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium mb-4">Create New Company Tier</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("companyTier.name", )}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.companyTier?.name && (
              <p className="text-red-500 text-xs mt-1">{errors.companyTier.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Min.  Employees</label>
            <input
            type='number'
            min={1}
              {...register("companyTier.minEmployees", {valueAsNumber:true})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
               
            {errors.companyTier?.minEmployees && (
              <p className="text-red-500 text-xs mt-1">{errors.companyTier.minEmployees.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max.  Employees</label>
            <input
            type='number'
            min={1}
              {...register("companyTier.maxEmployees", {valueAsNumber:true})}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
               
            {errors.companyTier?.maxEmployees && (
              <p className="text-red-500 text-xs mt-1">{errors.companyTier.maxEmployees.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
               {isSubmitting ? (
              <>
                <Loader />
              </>
            ) : (
              "Save"
            )}
            </button>
          </div>
        </form>
      </div>
      </div>
      </DialogPanel>
      </div>
    </Dialog>
  );
};
 

interface FeatureDialogProps {
  open:boolean,
  onCancel: () => void;
}

export const FeatureDialog: React.FC<FeatureDialogProps> = ({ 
  open,
  onCancel 
}) => {
  const [isSubmitting, startTransition] = useTransition();
  
  
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isDirty }, 
  } = useForm<FeatureFormValues>({
    resolver: zodResolver(FeatureFormSchema),
    mode: "onChange",
   
  });

  const onSubmit: SubmitHandler<FeatureFormValues> = (data) => {
    startTransition(async () => {
      try {
        const result = await addNewFeature(data);
        
        if ("error" in result) {
          toast.error(result.error);
        } else {
          toast.success("New Feature Added successfully.");
          onCancel()
        }
      } catch (error) {
        console.error("Submission error:", error);
        toast.error("Failed to add new feature.");
      }
    });
  };


  return (
    <Dialog
    open={open}
    onClose={() => {}}  
    className="relative z-50"
  >  <DialogBackdrop 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm"
    />      <div className="fixed inset-0 flex w-screen justify-center p-4 h-screen overflow-y-auto">
    <DialogPanel 
       className={`w-full  max-w-md transform rounded-xl bg-white shadow-2xl transition-all h-fit`}

    >
      <div className="flex items-center justify-between p-4 border-b">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium mb-4">Add new feature.</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register("feature.name", )}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.feature?.name && (
              <p className="text-red-500 text-xs mt-1">{errors.feature.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
            rows={5}
            cols={20}
            min={1}
              {...register("feature.description")}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            > </textarea>
               
            {errors.feature?.description && (
              <p className="text-red-500 text-xs mt-1">{errors.feature.description.message}</p>
            )}
          </div>
        
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
               {isSubmitting ? (
              <>
                <Loader />
              </>
            ) : (
              "Save"
            )}
            </button>
          </div>
        </form>
      </div>
      </div>
      </DialogPanel>
      </div>
    </Dialog>
  );
};

interface OfferFormDialogProps {
  open: boolean;
  onCancel: () => void;
}



export const OfferFormDialog: React.FC<OfferFormDialogProps> = ({ open, onCancel }) => {
  const [isSubmitting, startTransition] = useTransition();
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<string[]>([]);
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [selectedPlanIds, setSelectedPlanIds] = useState<string[]>([]);
 

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<OfferFormValues>({
    resolver: zodResolver(OfferFormSchema),
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<OfferFormValues> = (data) => {
    console.log('Form data:', data);
    startTransition(async () => {
      try {
        const selectedFeatureObjects = availableFeatures
          .filter((feature) => selectedFeatureIds.includes(feature.id))
          .map(({ id, name, description }) => ({
            id,
            name,
            description: description || '',
          }));
  
        const selectedPlanObjects = availablePlans
          .filter((plan) => selectedPlanIds.includes(plan.id))
          .map(({ id, name, companyTierId, isActive, isRecommended, price }) => ({
            id,
            name,
            companyTierId,
            isActive,
            isRecommended,
            price,
          }));
  
        // Adjust the structure to match the schema
        const offerWithPlansAndFeatures = {
          ...data,
          plans: {
            plans: selectedPlanObjects, // Nested array
          },
          features: {
            features: selectedFeatureObjects, // Nested array
          },
        };
  
        console.log(offerWithPlansAndFeatures);
        const result = await addNewOffer(offerWithPlansAndFeatures);
  
        if ('error' in result) {
          toast.error(result.error);
        } else {
          toast.success('Offer created successfully');
          reset();
          onCancel();
        }
      } catch (error) {
        console.error('Submission error:', error);
        toast.error('Failed to create offer');
      }
    });
  };
 console.log(errors, isDirty)
 
  const getAllFeatures = async () => {
    try {
      const result = await getFeatures();

      if ('error' in result) {
        toast.error(result.error);
      } else {
        setAvailableFeatures(result);
      }
    } catch (error) {
      toast.error('Failed to load features.');
    }
  };

  const getAllPlans = async () => {
    try {
      const result = await getPlans();  

      if ('error' in result) {
        toast.error(result.error);
      } else {
        setAvailablePlans(result);
      }
    } catch (error) {
      toast.error('Failed to load plans.');
    }
  };

  useEffect(() => {
    Promise.all([ getAllFeatures(), getAllPlans()]);
  }, []);

  const handleFeatureSelection = (featureId: string) => {
    setSelectedFeatureIds((prevIds) =>
      prevIds.includes(featureId) ? prevIds.filter((id) => id !== featureId) : [...prevIds, featureId]
    );
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlanIds((prevIds) =>
      prevIds.includes(planId) ? prevIds.filter((id) => id !== planId) : [...prevIds, planId]
    );
  };

  return (
    <Dialog open={open} onClose={onCancel} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex w-screen justify-center p-4 h-screen overflow-y-auto">
        <DialogPanel className="w-full max-w-md transform rounded-xl bg-white shadow-2xl transition-all h-fit">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-medium mb-4">Create New Offer</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    {...register('offer.name')}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.offer?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.offer.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    {...register('offer.description')}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.offer?.description && (
                    <p className="text-red-500 text-xs mt-1">{errors.offer.description.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('offer.discountPercentage', { valueAsNumber: true })}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.offer?.discountPercentage && (
                    <p className="text-red-500 text-xs mt-1">{errors.offer.discountPercentage.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input
                    type="date"
                    {...register('offer.startDate')}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.offer?.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.offer.startDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input
                    type="date"
                    {...register('offer.endDate')}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                  />
                  {errors.offer?.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.offer.endDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Plans</label>
                  <div className="mt-1 space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {availablePlans.length === 0 ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader className="h-5 w-5 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">Loading plans...</span>
                      </div>
                    ) : (
                      availablePlans.map((plan) => (
                        <div
                          key={plan.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedPlanIds.includes(plan.id)
                              ? 'bg-blue-50 border-blue-400'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handlePlanSelection(plan.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`plan-${plan.id}`}
                              checked={selectedPlanIds.includes(plan.id)}
                              onChange={() => handlePlanSelection(plan.id)}
                              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              aria-label={`Select plan ${plan.name}`}
                            />
                            <label htmlFor={`plan-${plan.id}`} className="ml-2 text-sm font-medium text-gray-700">
                              {plan.name}
                            </label>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {selectedPlanIds.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedPlanIds.length} plan{selectedPlanIds.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Select Features</label>
                  <div className="mt-1 space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-2">
                    {availableFeatures.length === 0 ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader className="h-5 w-5 text-gray-500" />
                        <span className="ml-2 text-sm text-gray-500">Loading features...</span>
                      </div>
                    ) : (
                      availableFeatures.map((feature) => (
                        <div
                          key={feature.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedFeatureIds.includes(feature.id)
                              ? 'bg-blue-50 border-blue-400'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => handleFeatureSelection(feature.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id={`feature-${feature.id}`}
                              checked={selectedFeatureIds.includes(feature.id)}
                              onChange={() => handleFeatureSelection(feature.id)}
                              className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                              aria-label={`Select feature ${feature.name}`}
                            />
                            <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm font-medium text-gray-700">
                              {feature.name}
                            </label>
                          </div>
                          {selectedFeatureIds.includes(feature.id) && feature.description && (
                            <p className="mt-2 text-sm text-gray-600 pl-7">
                              {feature.description || 'No description available'}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  {selectedFeatureIds.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedFeatureIds.length} feature{selectedFeatureIds.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty || Object.keys(errors).length > 0}
                    className={`px-4 py-2 text-white rounded-md ${
                      isSubmitting || !isDirty || Object.keys(errors).length > 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};