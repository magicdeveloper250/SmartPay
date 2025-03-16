import { Suspense } from 'react'
import SettingsForm from '@/components/Settings'
import { getCompanySettings } from '@/actions/settingsActions'
import { Skeleton } from '@/components/ui/skeleton'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { SettingsFormValues } from '@/validations/settingsSchema'
import PlansManagement from '@/components/Plans'

export default async function PlansPage() {
  

  return (
    <div className="container max-w-4xl">
      <div className="mb-8">
     
      <Breadcrumb pageName='Plan Management'/>
        <p className="text-muted-foreground mt-2">
          Create and manage your subscription plans
        </p>
    
      </div>

      
      <Suspense fallback={<SettingsSkeleton />}>
       <PlansManagement/>
      </Suspense>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[125px] w-full" />
      <Skeleton className="h-[125px] w-full" />
      <Skeleton className="h-[125px] w-full" />
    </div>
  )
} 