import { Suspense } from 'react'
import SettingsForm from '@/components/Settings'
import { getCompanySettings } from '@/actions/settingsActions'
import { Skeleton } from '@/components/ui/skeleton'
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb'
import { SettingsFormValues } from '@/validations/settingsSchema'

export default async function SettingsPage() {
  const settings = await getCompanySettings() as SettingsFormValues | { error: string }
  

  if ('error' in settings) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="mb-8">
          <Breadcrumb pageName='settings'/>
          <p className="text-muted-foreground mt-2">
            An error occurred while fetching settings. {settings.error}
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
      <Breadcrumb pageName='settings'/>
        <p className="text-muted-foreground mt-2">
          Manage your company's global settings and preferences
        </p>
    
      </div>

      
      <Suspense fallback={<SettingsSkeleton />}>
        <SettingsForm initialData={settings} />
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