"use server"

import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { getResources } from '@/actions/admin/adminresourcesactions'
import { getRooms } from '@/actions/admin/adminroomsactions'
import ResourcesClient from './ResourcesClient'

export default async function ResourcesPage() {
  const [{ data: resourcesData }, { data: roomsData }] = await Promise.all([
    getResources(),
    getRooms()
  ])

  // Just passing raw data is fine if structure matches
  // But let's keep the safeguard mapping if needed. 
  // adminresourcesactions.js returns { data: [...] } where data has resource_history joined.

  const resources = resourcesData || []
  const rooms = roomsData || []

  return (
    <AdminLayout title="Resources Management">
      <ResourcesClient initialResources={resources} rooms={rooms} />
    </AdminLayout>
  )
}

