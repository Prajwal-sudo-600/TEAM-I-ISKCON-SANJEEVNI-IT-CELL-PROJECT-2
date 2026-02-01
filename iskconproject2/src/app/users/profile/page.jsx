'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Check } from 'lucide-react'
import { getProfile, upsertProfile } from '@/actions/user/userProfileActions'

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(null)
  const [editData, setEditData] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  /* =========================
     FETCH PROFILE
  ========================= */
  useEffect(() => {
    const loadProfile = async () => {
      const res = await getProfile()

      // even if no row exists, we still set empty profile
      const mapped = {
        name: res?.data?.full_name || '',
        email: res?.data?.email || 'Not set',
        phone: res?.data?.phone || '',
        address: res?.data?.address || '',
        joinedDate: 'Recently'
      }

      setUserData(mapped)
      setEditData(mapped)
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleEdit = () => {
    setEditData(userData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!editData?.name) {
      alert('Name is required')
      return
    }

    const res = await upsertProfile({
      full_name: editData.name,
      phone: editData.phone,
      address: editData.address,
    })

    if (res.success) {
      setUserData(editData)
      setIsEditing(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    } else {
      alert('Failed to update profile')
    }
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
  }



  if (loading) return <p className="p-6">Loading...</p>
  if (!userData) return <p className="p-6">Profile not found</p>

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <BackButton />

        {showSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <Check className="w-4 h-4 text-green-600" />
            Profile updated successfully!
          </div>
        )}

        {/* PROFILE CARD */}
        <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-5">
          <h2 className="text-xl font-semibold text-primary">
            {userData.name || 'Your Profile'}
          </h2>

          {/* NAME */}
          <div>
            <label className="text-sm text-muted-foreground">Full Name</label>
            {isEditing ? (
              <input
                value={editData?.name || ''}
                onChange={e => handleChange('name', e.target.value)}
                className="border p-2 w-full rounded-lg mt-1"
              />
            ) : (
              <p className="mt-1">{userData.name || '—'}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <p className="mt-1 text-muted-foreground">{userData.email}</p>
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-muted-foreground">Contact Number</label>
            {isEditing ? (
              <input
                value={editData?.phone || ''}
                onChange={e => handleChange('phone', e.target.value)}
                className="border p-2 w-full rounded-lg mt-1"
              />
            ) : (
              <p className="mt-1">{userData.phone || '—'}</p>
            )}
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-muted-foreground">Address</label>
            {isEditing ? (
              <textarea
                value={editData?.address || ''}
                onChange={e => handleChange('address', e.target.value)}
                className="border p-2 w-full rounded-lg mt-1"
              />
            ) : (
              <p className="mt-1">{userData.address || '—'}</p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex gap-3 pt-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="border px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="bg-peacock text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* LOGOUT */}

      </div>
    </DashboardLayout>
  )
}
