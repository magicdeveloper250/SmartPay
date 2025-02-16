"use client";

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  backButtonDisabled?:boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
  onBack?:()=>void;
}

export  function Modal({ 
  children, 
  title,
  showCloseButton = true,
  width = 'md',
  backButtonDisabled=true,
  onClose,
  onBack
}: ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);
 

  return (
    <Dialog
      open={true}
      onClose={() => {}}  
      className="relative z-50"
    >
      <DialogBackdrop 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
      />

      <div className="fixed inset-0 flex w-screen items-start justify-center p-4 h-screen overflow-y-auto">
        <DialogPanel 
         className={`transform rounded-xl bg-white shadow-2xl transition-all  w-full`}

        >
          <div className="flex items-center justify-between p-4 border-b">
            {onBack&&   <div className="mb-6">
          <button 
            onClick={onBack}
            disabled={backButtonDisabled}
            className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
              ${ backButtonDisabled 
                ? "text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed" 
                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>}
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          <div className="p-4">
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}



export function DetailsModal({
  children,
  title,
  showCloseButton = true,
  width = 'md',
  backButtonDisabled = true,
  onClose,
  onBack,
}: ModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, []);

  // Width classes mapping
  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    xxl: 'max-w-7xl',
  };

  return (
    <Dialog open={true} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50 backdrop-blur-none" />

      {/* Adjust the container to align the modal to the right */}
      <div className="fixed inset-0 flex w-screen justify-end p-4 h-screen overflow-y-auto">
        <DialogPanel
          className={`w-full ${widthClasses[width]} transform rounded-xl bg-white shadow-2xl transition-all h-fit`}
        >
          <div className="flex items-center justify-between p-4 border-b">
            {onBack && (
              <div className="mb-6">
                <button
                  onClick={onBack}
                  disabled={backButtonDisabled}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${
                      backButtonDisabled
                        ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </button>
              </div>
            )}
            {title && (
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={handleClose}
                className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>

          <div className="p-4">{children}</div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}