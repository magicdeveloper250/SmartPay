 
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

      <PopoverPanel className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg">
        {content}
      </PopoverPanel>
    </Popover>
  );
}