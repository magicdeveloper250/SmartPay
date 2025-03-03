import { Suspense } from 'react'
import SettingsForm from '@/components/Settings'
import { getCompanySettings } from '@/actions/settingsActions'
import { Skeleton } from '@/components/ui/skeleton'

export default async function SettingsPage() {
  const settings = await getCompanySettings()

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Company Settings</h1>
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