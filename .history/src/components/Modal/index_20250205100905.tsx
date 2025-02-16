"use client";
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Modal({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();

  const handleClose = () => {
    router.back(); // Navigate to the previous page
  };

  return (
    <>
      <Dialog open={true} onClose={handleClose} className="relative z-50 overflow-scroll" >
        <DialogBackdrop className="fixed inset-0 bg-black/30"  />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
