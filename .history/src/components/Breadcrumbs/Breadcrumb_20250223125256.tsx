import Link from "next/link";
import { ChevronRightIcon, HomeIcon } from 'lucide-react';

interface BreadcrumbProps {
  pageName: string;
  ancestors?: Array<{
    name: string;
    href: string;
  }>;
}

const Breadcrumb = ({ pageName, ancestors = [] }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold leading-tight text-dark dark:text-white">
        {pageName}
      </h2>

      <nav aria-label="Breadcrumb" className="min-w-0 flex">
        <ol className="flex items-center space-x-2 flex-wrap">
          <li className="flex items-center">
            <Link 
              href="/dashboard" 
              className="text-gray-500 hover:text-primary transition-colors flex items-center"
            >
              <HomeIcon className="h-4 w-4 flex-shrink-0" />
              <span className="sr-only">Home</span>
            </Link>
          </li>

          {ancestors.map((ancestor, index) => (
            <li key={index} className="flex items-center">
              <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <Link
                href={ancestor.href}
                className="ml-2 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
              >
                {ancestor.name}
              </Link>
            </li>
          ))}

          <li className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <span className="ml-2 text-sm font-medium text-primary" aria-current="page">
              {pageName}
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
