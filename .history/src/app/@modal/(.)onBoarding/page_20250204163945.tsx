"use client"; // Marking as Client Component

import { useState } from "react";
import Modal from "@/components/Modal";

export default function OnBoarding() {
  const [isSingleOnboarding, setIsSingleOnboarding] = useState<boolean>(false);
  const [isMultipleOnboarding, setIsMultipleOnboarding] = useState<boolean>(false);

  const handleSingleOnboardingClick = () => {
    setIsSingleOnboarding(true);
    setIsMultipleOnboarding(false);
  };

  const handleMultipleOnboardingClick = () => {
    setIsMultipleOnboarding(true);
    setIsSingleOnboarding(false);
  };

  const handleDownloadTemplate = (format: "Google Sheet" | "Excel") => {
    // Logic to download the template in the specified format
    console.log(`Downloading ${format} template...`);
    // You can implement the actual download logic here
  };

  return (
    <Modal>
      <h1>OnBoarding</h1>
      <div className="onboarding-options">
        <button onClick={handleSingleOnboardingClick}>Single Employee Onboarding</button>
        <button onClick={handleMultipleOnboardingClick}>Multiple Employee Onboarding</button>
      </div>

      {isSingleOnboarding && (
        <div className="onboarding-form">
          <h2>Single Employee Onboarding Form</h2>
          {/* Form fields for single employee onboarding */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Handle form submission
              console.log("Form submitted!");
            }}
          >
            <label>Full Name:</label>
            <input type="text" name="fullName" required />
            <label>Job Title:</label>
            <input type="text" name="jobTitle" required />
            <label>Department:</label>
            <input type="text" name="department" required />
            <label>Bank Details:</label>
            <input type="text" name="bankDetails" required />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

      {isMultipleOnboarding && (
        <div className="multiple-onboarding-options">
          <h2>Multiple Employee Onboarding</h2>
          <p>Choose an option to proceed:</p>
          <button onClick={() => handleDownloadTemplate("Google Sheet")}>
            Download Google Sheet Template
          </button>
          <button onClick={() => handleDownloadTemplate("Excel")}>
            Download Excel Template
          </button>
          <button onClick={() => setIsMultipleOnboarding(false)}>
            Access Onboarding Form
          </button>
        </div>
      )}
    </Modal>
  );
}