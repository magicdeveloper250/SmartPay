"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Download, Loader } from 'lucide-react';
import { Plan, Feature, CompanyTier } from '@prisma/client';
import { PlanWithFeatures, PlanWithFeaturesAndOffers } from '@/types/planWithFeaturesAndOffer';
import toast from 'react-hot-toast';
import {getCompanyTiers, getFeatures, getOffersWithPlansAndFeatures, getPlansWithFeatures } from '@/actions/planActions';
import { PlanFormDialog, CompanyTierDialog, FeatureDialog, OfferFormDialog } from './dialogs';
import { OfferWithPlanAndFeature } from '@/types/offersWithPlandAndFeatures';
import { off } from 'process';
const PlansManagement: React.FC = () => {
  // State management with proper typing
  const [plans, setPlans] = useState<PlanWithFeatures[]>([]);
  const [offers, setOffers] = useState<OfferWithPlanAndFeature[]>([]);
  const [companyTiers, setCompanyTiers] = useState<CompanyTier[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'plans' | 'company-tiers' | 'features' | 'offers'>('plans');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState<boolean>(false);
  const [showCreateCompanyTierDialog, setShowCreateCompanyTierDialog] = useState<boolean>(false);
  const [showCreateFeatureDialog, setShowCreateFeatureDialog] = useState<boolean>(false);
  const [showCreateOfferDialog, setShowCreateOfferDialog] = useState<boolean>(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
  const getPlanCompanyTiers= async()=>{
    try {
      const result = await getCompanyTiers();
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setCompanyTiers(result)
      }
    } catch (error) {
  
      toast.error("Failed to load company tiers.");
    }

  }


  const getPlanWithFeatures = async () => {
    try {
      const result = await getPlansWithFeatures();  
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setPlans(result);
      }
    } catch (error) {
      toast.error("Failed to load Features.");
    }
  };

  const getOfferWithFeaturesAndPlans = async () => {
    try {
      const result = await getOffersWithPlansAndFeatures();  
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setOffers(result);
      }
    } catch (error) {
      toast.error("Failed to load Offers.");
    }
  };

  const getAllFeatures = async () => {
    try {
      const result = await getFeatures();  
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        setFeatures(result);
      }
    } catch (error) {
      toast.error("Failed to load Features.");
    }
  };
  


  const handleCreatePlan = (): void => {
    setShowCreateDialog(true);
  };
  const handleCreateFeature = (): void => {
    setShowCreateFeatureDialog(true)
  };

  const handleCreateOffer = (): void => {
    setShowCreateOfferDialog(true)
  };

  const handleCreateCompanyTier = (): void => {
    setShowCreateCompanyTierDialog(true)
  };
  
  
  const handleEditPlan = (id: string): void => {
    const plan = plans.find(p => p.id === id);
    if (plan) {
      setPlanToEdit(plan);
     
    }
  };
  
  const handleSavePlan = (plan: Plan): void => {
 
    setShowCreateDialog(false);
    
    setPlanToEdit(null);
  };
  
  const handleCancel = (): void => {
    setShowCreateDialog(false);
   
    setPlanToEdit(null);
  };
  

  
  useEffect(() => {
    Promise.all([getPlanCompanyTiers(),getPlanWithFeatures(), getAllFeatures(), getOfferWithFeaturesAndPlans()])

    const mockPlans: PlanWithFeaturesAndOffers[] = [];
    setIsLoading(false);
  }, []);

 
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier ? plan.companyTierId === selectedTier : true;
    const matchesActive = showActiveOnly ? plan.isActive : true;
    return matchesSearch && matchesTier && matchesActive;
  });

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDescription = showActiveOnly ? offer.description : true;
    return matchesSearch &&  matchesDescription;
  });

   

  const openDeleteDialog = (plan: Plan): void => {
    setPlanToDelete(plan);
    setShowDeleteDialog(true);
  };

  const handleDeletePlan = (): void => {
    if (!planToDelete) return;
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
            <button
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'offers' 
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('offers')}
            >
              Offers
            </button>
          </nav>
         { activeTab === 'plans' &&
          <button 
          onClick={handleCreatePlan} 
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary text-white py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Plan
        </button>}
        { activeTab === 'company-tiers' &&
          <button 
          onClick={handleCreateCompanyTier} 
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary text-white py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Tier
        </button>}
        { activeTab === 'features' &&
          <button 
          onClick={handleCreateFeature} 
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary text-white py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add New Feature
        </button>}

        { activeTab === 'offers' &&
          <button 
          onClick={handleCreateOffer} 
          className="mt-4 sm:mt-0 bg-primary hover:bg-primary text-white py-2 px-4 rounded-md flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Create New Offer
        </button>}
        </div>

    
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommended</th>
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
                                    {pf.feature.name}
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
                            <td className="px-6 py-4 text-yellow-950">
                              {plan.isRecommended? "Yes": "No"}
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

      {/*Offers tab  */}
        {activeTab === 'offers' && (
          <div className="space-y-4 mt-4">
            {/* Filters Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium">Filter Offers</h3>
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
 

                 

                
                </div>
              </div>
            </div>

            {/* Offers Table Card */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium">Offers</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {filteredOffers.length} of {plans.length} Offers
                </p>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p>Loading offers...</p>
                  </div>
                ) : filteredPlans.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No offers found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Percentage</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">StartDate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EndDate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plans</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Features</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredOffers.map((offer) => (
                          <tr key={offer.id}>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"> 
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  {offer.name}
                              </span>
                              </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"> <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                            {offer.description}
                              </span></td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"><span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{offer.discountAmount?.toFixed(2)}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"><span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{offer.discountPercentage?.toFixed(2)}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"><span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{offer.startDate.toLocaleString()}</span></td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900"><span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{offer?.endDate?.toLocaleString()}</span></td>
 
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {offer.includes
                                  .filter((include) => include.planId !== null)  
                                  .map((include) => include.plan).slice(0, 2).map((plan) => (
                                  <span key={plan?.id} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-primary">
                                    {plan?.name}
                                  </span>
                                ))}
                                {offer. includes
                                  .filter((include) => include.planId !== null)  
                                  .map((include) => include.plan).length > 2 && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-primary">
                                    +{offer. includes
                                  .filter((include) => include.planId !== null)  
                                  .map((include) => include.plan).length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                         
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap gap-1">
                                {offer.includes
                                  .filter((include) => include.featureId !== null)  
                                  .map((include) => include.feature).slice(0, 2).map((feature) => (
                                  <span key={feature?.id} className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-primary">
                                    {feature?.name}
                                  </span>
                                ))}
                                {offer. includes
                                  .filter((include) => include.featureId !== null)  
                                  .map((include) => include.feature).length > 2 && (
                                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-primary">
                                    +{offer. includes
                                  .filter((include) => include.featureId !== null)  
                                  .map((include) => include.feature).length - 2} more
                                  </span>
                                )}
                              </div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <button
                                  // onClick={() => handleEditPlan(plan.id)}
                                  className="text-gray-500 hover:text-primary"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                <button
                                  // onClick={() => openDeleteDialog(plan)}
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                <button
                                  // onClick={() => handleToggleActive(plan.id)}
                                  // className={`text-gray-500 hover:${plan.isActive ? 'text-red-900' : 'text-green-900'}`}
                                >
                                  {/* {plan.isActive ? 'Deactivate' : 'Activate'} */}
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
        open={showCreateDialog}
        onSave={handleSavePlan}
        onCancel={handleCancel}
      />
    )}


    {showCreateCompanyTierDialog && (
      <CompanyTierDialog
        open={showCreateCompanyTierDialog}
        onCancel={()=>setShowCreateCompanyTierDialog(false)}
      />
    )}

{showCreateFeatureDialog && (
      <FeatureDialog
        open={showCreateFeatureDialog}
        onCancel={()=>setShowCreateFeatureDialog(false)}
      />
    )}


{showCreateOfferDialog && (
      <OfferFormDialog
        open={showCreateOfferDialog}
        onCancel={()=>setShowCreateOfferDialog(false)}
      />
    )}
    

    
    </div>
  );
};

export default PlansManagement;