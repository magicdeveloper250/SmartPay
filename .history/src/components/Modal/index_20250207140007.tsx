"use client";

import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface ModalProps {
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
  width?: 'sm' | 'md' | 'lg' | 'xl';
  onClose?: () => void;
}

export default function Modal({ 
  children, 
  title,
  showCloseButton = true,
  width = 'md',
  onClose,
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
    xxl:"max-w-7xl"
  };

  return (
    <Dialog
      open={true}
      onClose={() => {}} // Prevent click outside close
      className="relative z-50"
    >
      <DialogBackdrop 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
      />

      <div className="fixed inset-0 flex w-screen items-start justify-center p-4 h-screen overflow-y-auto">
        <DialogPanel 
          className={`w-full   transform rounded-xl bg-white shadow-2xl transition-all`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
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

          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}