"use client"
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export default function Modal({children}:Readonly<{children:React.ReactNode}>) {
  const [isOpen, setIsOpen] = useState(true)
  const router= useRouter()
  const handleOpenChange=()=>{
    router.back()
  }


  return (
   <>  
   <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
     <DialogBackdrop className="fixed inset-0 bg-black/30" />

     <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
       <DialogPanel className="max-w-lg space-y-4 bg-white p-12">
          {children}
       </DialogPanel>
     </div>
   </Dialog></>
  )
}