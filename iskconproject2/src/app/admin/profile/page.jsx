"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/app/admin/components/admin/admin-layout'
import { User, Mail, Phone, Shield, Pencil, LogOut, Save, X, MapPin, Lock, Activity } from 'lucide-react'
import {
  getCurrentProfile,
  updateProfile,
  updateEmail,
  updatePassword,
  getUserStats,
  getUserActivity
} from '@/actions/admin/adminProfileActions'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [newEmail, setNewEmail] = useState('')

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true)
    const result = await getCurrentProfile()

    if (result.success) {
      setProfile(result.data)
      setFormData({
        full_name: result.data.full_name || '',
        contact_number: result.data.phone || '', // Reading phone column
        address: result.data.address || ''
      })
    } else {
      toast.error(result.error || 'Failed to load profile')
    }
    setLoading(false)
  }

  // Fetch user stats
  const fetchStats = async () => {
    const result = await getUserStats()
    if (result.success) {
      setStats(result.data)
    }
  }

  // Fetch recent activity
  const fetchActivity = async () => {
    const result = await getUserActivity(5)
    if (result.success) {
      setActivity(result.data)
    }
  }

  useEffect(() => {
    fetchProfile()
    fetchStats()
    fetchActivity()
  }, [])

  const handleEdit = () => {
    setFormData({
      full_name: profile.full_name || '',
      contact_number: profile.contact_number || '',
      address: profile.address || ''
    })
    setIsEditing(true)
  }

  const handleCancel = () => {
    setFormData({
      full_name: profile.full_name || '',
      contact_number: profile.contact_number || '',
      address: profile.address || ''
    })
    setIsEditing(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()

    console.log('=== Starting save ===')
    console.log('Form data to save:', formData)

    setActionLoading(true)

    const result = await updateProfile(formData)

    console.log('Update result:', result)

    if (result.success) {
      console.log('Update successful, refreshing profile...')
      toast.success('Profile updated successfully')
      await fetchProfile()
      console.log('Profile refreshed')
      setIsEditing(false)
    } else {
      console.error('Update failed:', result.error)
      toast.error(result.error || 'Failed to update profile')
    }

    setActionLoading(false)
  }

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setActionLoading(true)
    const result = await updatePassword(passwordData.currentPassword, passwordData.newPassword)

    if (result.success) {
      toast.success('Password updated successfully')
      setShowPasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } else {
      toast.error(result.error || 'Failed to update password')
    }

    setActionLoading(false)
  }

  const handleEmailUpdate = async () => {
    setActionLoading(true)
    const result = await updateEmail(newEmail)

    if (result.success) {
      toast.success(result.message || 'Email update initiated')
      setShowEmailModal(false)
      setNewEmail('')
    } else {
      toast.error(result.error || 'Failed to update email')
    }

    setActionLoading(false)
  }



  const getInitials = (name) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getRoleDisplay = (role) => {
    if (role === 'admin') return 'System Administrator'
    return 'User'
  }

  if (loading) {
    return (
      <AdminLayout title="Admin Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </AdminLayout>
    )
  }

  if (!profile) {
    return (
      <AdminLayout title="Admin Profile">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Failed to load profile</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Admin Profile">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              {/* Header Banner */}
              <div className="h-32 bg-gradient-to-r from-primary to-primary/80 relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="w-24 h-24 rounded-full bg-card border-4 border-card flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-primary">
                      {getInitials(profile.full_name)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-16 pb-6 px-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      {profile.full_name || 'No name set'}
                    </h2>
                    <p className="text-sm text-muted-foreground">{getRoleDisplay(profile.role)}</p>
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
                  <form className="space-y-4" onSubmit={handleSave}>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={formData.contact_number}
                        onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        rows={3}
                        placeholder="Enter your address"
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                        disabled={actionLoading}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                        disabled={actionLoading}
                      >
                        <Save className="w-4 h-4" />
                        {actionLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                      <User className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="text-sm font-medium text-foreground">
                          {profile.full_name || 'Not set'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                      <Mail className="w-5 h-5 text-primary" />
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground">{profile.email}</p>
                      </div>
                      <button
                        onClick={() => setShowEmailModal(true)}
                        className="text-xs text-primary hover:underline"
                      >
                        Change
                      </button>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                      <Shield className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Role</p>
                        <p className="text-sm font-medium text-foreground">
                          {getRoleDisplay(profile.role)}
                        </p>
                      </div>
                    </div>
                    {profile.contact_number && (
                      <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                        <Phone className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Contact</p>
                          <p className="text-sm font-medium text-foreground">
                            {profile.contact_number}
                          </p>
                        </div>
                      </div>
                    )}
                    {profile.address && (
                      <div className="flex items-center gap-4 p-4 bg-secondary rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Address</p>
                          <p className="text-sm font-medium text-foreground">{profile.address}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className="mt-6 bg-card rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Member Since</p>
                  <p className="text-sm font-medium text-foreground">
                    {profile.created_at ? formatDate(profile.created_at) : 'Unknown'}
                  </p>
                </div>
                <div className="p-4 bg-secondary rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                  <p className="text-sm font-medium text-foreground">
                    {getRoleDisplay(profile.role)}
                  </p>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="mt-6 bg-card rounded-xl border border-border shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center justify-between p-4 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">Change Password</p>
                    <p className="text-xs text-muted-foreground">Update your password</p>
                  </div>
                </div>
                <Pencil className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Logout Button */}

          </div>

          {/* Right Column - Stats & Activity */}
          <div className="space-y-6">
            {/* Stats Card */}
            {stats && (
              <div className="bg-card rounded-xl border border-border shadow-sm p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Booking Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Bookings</span>
                    <span className="text-sm font-semibold text-foreground">
                      {stats.total_bookings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      {stats.pending_bookings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Approved</span>
                    <span className="text-sm font-semibold text-green-600">
                      {stats.approved_bookings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rejected</span>
                    <span className="text-sm font-semibold text-red-600">
                      {stats.rejected_bookings}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-card rounded-xl border border-border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
              </div>
              {activity.length > 0 ? (
                <div className="space-y-3">
                  {activity.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
                      <div className={`w-2 h-2 rounded-full mt-1.5 ${item.status === 'Approved' ? 'bg-green-500' :
                        item.status === 'Rejected' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.room}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(item.booking_date)}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        item.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Devotional Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground italic">
            "In service of the Divine, we find our true purpose."
          </p>
          <p className="text-xs text-muted-foreground mt-2">Hare Krishna</p>
        </div>
      </div>



      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Change Password</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Change Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border shadow-lg max-w-md w-full mx-4">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Change Email</h3>
              <p className="text-sm text-muted-foreground mt-1">
                A confirmation email will be sent to your new address
              </p>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                New Email Address
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder={profile.email}
                className="w-full px-4 py-3 text-sm bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="p-6 border-t border-border flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEmailModal(false)
                  setNewEmail('')
                }}
                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleEmailUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                disabled={actionLoading}
              >
                {actionLoading ? 'Updating...' : 'Update Email'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}