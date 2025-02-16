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
      <Dialog open={true} onClose={handleClose} className="relative z-9990" >
        <DialogBackdrop className="fixed inset-0 bg-black/30"  />

        <div className="fixed inset-0 flex w-screen items-start justify-center p-4 h-screen overflow-y-scroll top-4 ">
          <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
            {children}
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
