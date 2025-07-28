// components/PopoverWrapper.tsx
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

      <PopoverPanel anchor="top start" className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="p-1">
          {content}
        </div>
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <div className="h-4 w-4 rotate-45 bg-white border-t border-l border-gray-200 transform origin-bottom" />
        </div>
      </PopoverPanel>
    </Popover>
  );
}