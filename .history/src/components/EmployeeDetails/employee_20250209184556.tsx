"use client"
import React, { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { Plus, PencilIcon, MinusIcon, Check } from "lucide-react";
import { Employee, EmployeeBenefit, Tax } from '@prisma/client';
import toast from 'react-hot-toast';
import { addEmployeeBenefit } from '@/actions/employeeActions';
import Loader from '../Common/Loader';

export default function EmployeeDisplay({ employee, benefits, taxes }: { employee: Employee, benefits: EmployeeBenefit[], taxes: Tax[] }) {
  const [AllBenefits, setBenefits] = useState<string[]>([]);
  const [showBenefits, setShowBenefits] = useState<Boolean>(false);
  const [showTaxes, setShowTaxes] = useState<Boolean>(false);
  const [AllTaxes, setTaxes] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const[isAddingBenefit, startAdddingBenefitTransition]= useTransition()
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    secondName: employee.secondName,
    phoneNumber: employee.phoneNumber
  });

  const getBenefits = async () => {
    try {
      const resp = await fetch("/api/benefit");
      const data = await resp.json();
      setBenefits(data);
    } catch (error) {
      toast.error("Unable to fetch benefits");
    }
  };

  const getTaxes = async () => {
    try {
      const resp = await fetch("/api/tax");
      const data = await resp.json();
      setTaxes(data);
    } catch (error) {
      toast.error("Unable to fetch taxes");
    }
  };

  useEffect(() => {
    Promise.all([getBenefits(), getTaxes()]);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddingBenefit= (employeeId:string, benefit:string)=>{
    startAdddingBenefitTransition(async()=>{
      const response= await addEmployeeBenefit(employeeId, benefit)
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/employee/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Update failed');
      
      toast.success('Employee information updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update employee information');
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 transform transition-all hover:shadow-2xl">
      <div className="w-full flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <PencilIcon className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      {isEditing ? (
        <form onSubmit={handleUpdate} className="w-full grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <span className="font-medium text-gray-700">ID:</span>
          <span className="text-gray-600">{employee.id}</span>
          
          <span className="font-medium text-gray-700">First name:</span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="text-gray-600 border rounded-md p-1"
          />
          
          <span className="font-medium text-gray-700">Second name:</span>
          <input
            type="text"
            name="secondName"
            value={formData.secondName}
            onChange={handleInputChange}
            className="text-gray-600 border rounded-md p-1"
          />
          
          <span className="font-medium text-gray-700">Phone:</span>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="text-gray-600 border rounded-md p-1"
          />
          
          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Update
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <span className="font-medium text-gray-700">ID:</span>
          <span className="text-gray-600">{employee.id}</span>
          <span className="font-medium text-gray-700">First name:</span>
          <span className="text-gray-600">{employee.firstName}</span>
          <span className="font-medium text-gray-700">Second name:</span>
          <span className="text-gray-600">{employee.secondName}</span>
          <span className="font-medium text-gray-700">Phone:</span>
          <span className="text-gray-600">{employee.phoneNumber}</span>
        </div>
      )}

      <div className="mb-6">
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Benefits</h2>
          <button
            onClick={() => setShowBenefits(!showBenefits)}
            className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
          >
            {!showBenefits ? <Plus className="w-5 h-5 text-green-600" /> : <MinusIcon className="w-5 h-5 text-green-600" /> }
            {isAddingBenefit&& <Loader/>}
          </button>
        </div>
        <div className="mb-4">
          {showBenefits && (
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e:React.ChangeEvent<HTMLSelectElement>)=>handleAddingBenefit(employee.id, e.target.value)}>
              <option value="" disabled selected>Select Benefit</option>
              {AllBenefits.map((eBenefit, index) => (
                <option key={index} className="text-gray-700" disabled={benefits.some((benefit)=>benefit.benefit==eBenefit)}>{eBenefit}</option>
              ))}
            </select>
          )}
        </div>
        {benefits.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
            {benefits.map((benefit, index) => (
              <li key={index} className="mb-2">{benefit.benefit}</li>
            ))}
          </ul>
        ) : <span className="text-gray-500">No allowed Benefit Found</span>}
      </div>

      <div>
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Taxes</h2>
          <button
            onClick={() => setShowTaxes(!showTaxes)}
            className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
          >
            {!showTaxes ? <Plus className="w-5 h-5 text-red-600" /> : <MinusIcon className="w-5 h-5 text-red-600" />}
          </button>
        </div>
        <div className="mb-4">
          {showTaxes && (
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="" disabled selected>Select Tax</option>
              {AllTaxes.map((tax, index) => (
                <option key={index} className="text-gray-700">{tax}</option>
              ))}
            </select>
          )}
        </div>
        {taxes.length > 0 ? (
          <ul className="list-disc pl-5 text-gray-600">
            {taxes.map((tax, index) => (
              <li key={index} className="mb-2">{tax.type}</li>
            ))}
          </ul>
        ) : <span className="text-gray-500">No assigned Taxes Found</span>}
      </div>
    </div>
  );
}