 
'use client';

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
 

export default function PopoverWrapper({
  trigger,
  content,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Popover className="relative">
      <PopoverButton as="div" className="cursor-pointer">
        {trigger}
      </PopoverButton>

      <PopoverPanel  anchor="top" className="absolute z-10  mt-1 bg-white shadow-lg rounded-md border border-gray-200 p-4 ">
        {content}
      </PopoverPanel>
    </Popover>
  );
}