"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download } from 'lucide-react';
import { Plan, Feature, CompanyTier } from '@prisma/client';
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
import { PlanWithFeaturesAndOffers } from '@/types/planWithFeaturesAndOffer';
import toast from 'react-hot-toast';
import { addNewPlan, getCompanyTiers } from '@/actions/planActions';

interface PlanFormDialogProps {
  onSave: (plan: Plan) => void;
  onCancel: () => void;
}

const PlanFormDialog: React.FC<PlanFormDialogProps> = ({ 
  onSave, 
  onCancel 
}) => {
  const [isSubmitting, startTransition] = useTransition();
 const [companyTiers, setCompanyTiers]= useState<CompanyTier[]>([])
  
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    formState: { errors, isDirty }, 
  } = useForm<PlanFormValues>({
    resolver: zodResolver(z.object({
      plan: z.array(PlanFormSchema)
    })),
    mode: "onChange",
   
  });


  const { fields, append, remove } = useFieldArray({
    control,
    name: "features.features",
  });
  
  const onSubmit: SubmitHandler<PlanFormValues> = (data) => {
    startTransition(async () => {
      try {
        const result = await addNewPlan(data);
        
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

  const handleAddFeature = () => {
    append({
      name: "",
      description: ""
    });
  };

  useEffect(()=>{
    getCompanyTiers()
  }, [])

 

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-medium mb-4">Create New Plan</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <label className="block text-sm font-medium text-gray-700">Features</label>
            <div className="mt-1 space-y-2">
              {fields.map((feature, index) =>{
                
                return (
                  <div key={feature.name + index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${feature.id}`}
                      checked
                      onChange={() => remove(index)}
                      className="h-4 w-4 text-primary rounded border-gray-300"
                    />
                    <label htmlFor={`feature-${feature.id}`} className="ml-2 text-sm text-gray-700">
                      {feature.name}
                    </label>
                  </div>
                );
              })}
            </div>


            <div className="flex justify-center">
            <button 
              type="button"
              onClick={handleAddFeature}
              className="px-4 py-2 bg-green-800 text-white font-medium rounded-md hover:bg-green-900 transition-colors"
              aria-label="Add new Feature"
            >
              + Add Feature
            </button>
          </div>
            {errors.features && (
              <p className="text-red-500 text-xs mt-1">{errors.features.message}</p>
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
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

 
const PlansManagement: React.FC = () => {
  // State management with proper typing
  const [plans, setPlans] = useState<PlanWithFeaturesAndOffers[]>([]);
  const [companyTiers, setCompanyTiers] = useState<CompanyTier[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'company-tiers' | 'features'>('plans');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showEditDialog, setShowEditDialog] = useState<boolean>(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);



  const handleCreatePlan = (): void => {
    setShowCreateDialog(true);
  };
  
  const handleEditPlan = (id: string): void => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setPlanToEdit(plan);
      setShowEditDialog(true);
    }
  };
  
  const handleSavePlan = (plan: Plan): void => {
 
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setPlanToEdit(null);
  };
  
  const handleCancel = (): void => {
    setShowCreateDialog(false);
    setShowEditDialog(false);
    setPlanToEdit(null);
  };
  

  // Mock data
  useEffect(() => {
    const mockCompanyTiers: CompanyTier[] = [
      {
        id: '1',
        name: 'Startup',
        minEmployees: 1,
        maxEmployees: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'SMB',
        minEmployees: 11,
        maxEmployees: 100,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Enterprise',
        minEmployees: 101,
        maxEmployees: 1000,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ];
    const mockFeatures: Feature[] = [
      { 
        id: '1', 
        name: 'Basic Support', 
        description: '9-5 email support',
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: '1'
      },
      {
        id: '2',
        name: 'Premium Support',
        description: '24/7 phone support',
        createdAt: new Date(), 
        updatedAt: new Date(),
        planId: '2'
      },
      {
        id: '3',
        name: 'API Access',
        description: 'Access to REST API',
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: '3'
      },
      {
        id: '4',
        name: 'Custom Branding',
        description: 'White label solution',
        createdAt: new Date(),
        updatedAt: new Date(),
        planId: '4'
      },
    ];

    const mockPlans: PlanWithFeaturesAndOffers[] = [];

    setCompanyTiers(mockCompanyTiers);
    setFeatures(mockFeatures);
    setPlans(mockPlans);
    setIsLoading(false);
  }, []);

  // Filter plans based on search term, tier, and active status
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier ? plan.companyTierId === selectedTier : true;
    const matchesActive = showActiveOnly ? plan.isActive : true;
    return matchesSearch && matchesTier && matchesActive;
  });

 

   

  const openDeleteDialog = (plan: Plan): void => {
    setPlanToDelete(plan);
    setShowDeleteDialog(true);
  };

  const handleDeletePlan = (): void => {
    if (!planToDelete) return;
    
    console.log(`Delete plan with id ${planToDelete.id}`);
    setPlans(plans.filter(plan => plan.id !== planToDelete.id));
    setShowDeleteDialog(false);
  };

  const handleToggleActive = (id: string): void => {
    setPlans(plans.map(plan => 
      plan.id === id ? { ...plan, is_active: !plan.isActive } : plan
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <nav className="flex -mb-px space-x-8">
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plans' 
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('plans')}
            >
              Plans
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'company-tiers' 
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('company-tiers')}
            >
              Company Tiers
            </button>
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'features' 
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('features')}
            >
              Features
            </button>
          </nav>
          <button 
          onClick={handleCreatePlan} 
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary text-white py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Plan
        </button>
        </div>

        {/* Plans Tab Content */}
        {activeTab === 'plans' && (
          <div className="space-y-4 mt-4">
            {/* Filters Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium">Filter Plans</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Search */}
                  <div className="flex items-center space-x-2">
                    <div className="relative w-full">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <input
                        placeholder="Search plans..."
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Company Tier Select */}
                  <div>
                    <select
                      value={selectedTier || ''}
                      onChange={(e) => setSelectedTier(e.target.value || null)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Tiers</option>
                      {companyTiers.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {tier.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Only Switch */}
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="active-only"
                        checked={showActiveOnly}
                        onChange={() => setShowActiveOnly(!showActiveOnly)}
                        className="h-4 w-4 text-primary rounded border-gray-300"
                      />
                      <label htmlFor="active-only" className="ml-2 text-sm text-gray-700">
                        Show active plans only
                      </label>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="flex justify-end">
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-100">
                      <Download className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Plans Table Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium">Plans</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredPlans.length} of {plans.length} plans
                </p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading plans...</p>
                  </div>
                ) : filteredPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No plans found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company Tier</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPlans.map((plan) => (
                          <tr key={plan.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{plan.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                {companyTiers.find((companyTier)=> companyTier.id == plan.companyTierId)?.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">${plan.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {plan.features.slice(0, 2).map((pf) => (
                                  <span key={pf.id} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-primary">
                                    {pf.name}
                                  </span>
                                ))}
                                {plan.features.length > 2 && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-primary">
                                    +{plan.features.length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                plan.isActive 
                                  ? 'bg-green-100 text-green-900' 
                                  : 'bg-red-100 text-red-900'
                              }`}>
                                {plan.isActive ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleEditPlan(plan.id)}
                                  className="text-gray-500 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => openDeleteDialog(plan)}
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleToggleActive(plan.id)}
                                  className={`text-gray-500 hover:${plan.isActive ? 'text-red-900' : 'text-green-900'}`}
                                >
                                  {plan.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Company Tiers Tab Content */}
        {activeTab === 'company-tiers' && (
          <div className="space-y-4 mt-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Company Tiers</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Employees</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {companyTiers.map((tier) => (
                      <tr key={tier.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{tier.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tier.minEmployees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{tier.maxEmployees}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Features Tab Content */}
        {activeTab === 'features' && (
          <div className="space-y-4 mt-4">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-medium mb-4">Features</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {features.map((feature) => (
                      <tr key={feature.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{feature.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{feature.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button className="text-gray-500 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && planToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the plan "{planToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlan}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


    {showCreateDialog && (
      <PlanFormDialog
        
        onSave={handleSavePlan}
        onCancel={handleCancel}
      />
    )}

    {/* {showEditDialog && planToEdit && (
      <PlanFormDialog
        plan={planToEdit}
        companyTiers={companyTiers}
        features={features}
        onSave={handleSavePlan}
        onCancel={handleCancel}
      />
    )} */}
    </div>
  );
};

export default PlansManagement;