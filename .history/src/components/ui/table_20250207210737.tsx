import { cn } from "@/lib/utils";
import * as React from "react";

export function Table({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700">
      <table
        className={cn(
          "w-full caption-bottom text-sm md:text-base lg:text-lg min-w-[400px]",
          "border-collapse",
          "animate-in fade-in-50 duration-300",
          className
        )}
        {...props}
      />
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
        "bg-neutral-50 dark:bg-neutral-800/50",
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
        "border-t bg-neutral-100/50 font-medium dark:bg-neutral-800/50",
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
        "h-12 px-2 md:px-4 text-left align-middle",
        "font-medium text-neutral-500 dark:text-neutral-400",
        "whitespace-nowrap",
        "[&:has([role=checkbox])]:pr-0",
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
        "p-2 md:p-4 align-middle",
        "transition-colors",
        "[&:has([role=checkbox])]:pr-0",
        "break-words",
        className
      )}
      {...props}
    />
  );
}