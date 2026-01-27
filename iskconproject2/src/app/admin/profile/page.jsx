"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/admin-layout'
import { User, Mail, Phone, Shield, Pencil, LogOut, Save, X } from 'lucide-react'

const initialProfile = {
  name: 'Admin User',
  email: 'admin@iskcon-sanjeevani.org',
  role: 'System Administrator',
  contact: '+91 98765 43210',
  department: 'IT Cell',
  joinedDate: '01 Jan 2024',
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(initialProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(initialProfile)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleEdit = () => {
    setFormData(profile)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData(profile)
    setIsEditing(false)
  }

  const handleSave = () => {
    setProfile(formData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    router.push('/')
  }

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-primary relative">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-primary">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 pb-6 px-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">{profile.role}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="text-sm font-medium text-foreground">{profile.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium text-foreground">{profile.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <Shield className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Role</p>
                    <p className="text-sm font-medium text-foreground">{profile.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                  <Phone className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="text-sm font-medium text-foreground">{profile.contact}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-card rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Department</p>
              <p className="text-sm font-medium text-foreground">{profile.department}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Joined Date</p>
              <p className="text-sm font-medium text-foreground">{profile.joinedDate}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card border border-red-200 rounded-xl text-red-600 font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

        {/* Devotional Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            "In service of the Divine, we find our true purpose."
          </p>
          <p className="text-xs text-muted-foreground mt-2">Hare Krishna</p>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-sm w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Confirm Logout</h3>
              <p className="text-sm text-muted-foreground">
                Are you sure you want to logout from the admin dashboard?
              </p>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
