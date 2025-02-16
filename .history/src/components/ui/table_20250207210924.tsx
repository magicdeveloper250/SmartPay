import { cn } from "@/lib/utils";
import * as React from "react";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full">
      {/* Outer container for shadow effects */}
      <div className="relative rounded-lg">
        {/* Scroll indicators */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent dark:from-neutral-900 pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent dark:from-neutral-900 pointer-events-none z-20" />
        
        {/* Scrollable container */}
        <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 hover:scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 dark:hover:scrollbar-thumb-neutral-600">
          <div className="inline-block min-w-full align-middle">
            <table
              className={cn(
                "w-full caption-bottom text-sm md:text-base lg:text-lg",
                "border-collapse",
                "animate-in fade-in-50 duration-300",
                className
              )}
              {...props}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "[&_tr]:border-b",
        "bg-neutral-50/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-50/80",
        "dark:bg-neutral-800/80 dark:supports-[backdrop-filter]:bg-neutral-800/80",
        "sticky top-0 z-10",
        className
      )}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        "divide-y divide-neutral-200 dark:divide-neutral-700",
        className
      )}
      {...props}
    />
  );
}

export function TableFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      className={cn(
        "border-t bg-neutral-100/50 font-medium",
        "dark:bg-neutral-800/50",
        "sticky bottom-0 z-10",
        "[&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

export function TableRow({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b transition-colors",
        "hover:bg-neutral-100/50 dark:hover:bg-neutral-800/50",
        "data-[state=selected]:bg-neutral-100 dark:data-[state=selected]:bg-neutral-800",
        "focus-within:bg-neutral-50 dark:focus-within:bg-neutral-800/70",
        className
      )}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-left align-middle",
        "font-medium text-neutral-500 dark:text-neutral-400",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
        "first:pl-6 last:pr-6", // Consistent edge padding
        "transition-colors",
        className
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle",
        "transition-colors",
        "[&:has([role=checkbox])]:pr-0",
        "first:pl-6 last:pr-6", // Consistent edge padding
        className
      )}
      {...props}
    />
  );
}