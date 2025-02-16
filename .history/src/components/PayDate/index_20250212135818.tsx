
import React, { useState, ChangeEvent } from 'react';

const PayDateComponent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  // Function to format the date as "Month Day, Year"
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4">
      <div className="text-lg font-medium text-gray-900">
        Pay Date: May 01 - May 30, 2023
      </div>
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Select a date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      {/* Display the selected date in the desired format */}
      {selectedDate && (
        <div className="text-sm text-gray-500">
          Selected Date: {formatDate(selectedDate)}
        </div>
      )}
    </div>
  );
};

export default PayDateComponent;