"use server"

import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { getRooms } from '@/actions/adminroomsactions'
import RoomsClient from './RoomsClient'

export default async function RoomsPage() {
  const { data: rooms } = await getRooms()

  return (
    <AdminLayout title="Rooms Management">
      <RoomsClient initialRooms={rooms || []} />
    </AdminLayout>
  )
}

