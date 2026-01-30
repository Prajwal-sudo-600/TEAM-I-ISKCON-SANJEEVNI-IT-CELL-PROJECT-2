'use client'

import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { User, Mail, Phone, MapPin, Edit2, Save, X, Check, LogOut } from 'lucide-react'
import Link from 'next/link'

const initialUserData = {
  name: 'Radha Krishna Das',
  email: 'radhakrishna@iskconsanjeevani.org',
  phone: '+91 98765 43210',
  address: 'ISKCON Sanjeevani, Pune, Maharashtra, India',
  department: 'IT Cell',
  joinedDate: 'January 2024',
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState(initialUserData)
  const [editData, setEditData] = useState(initialUserData)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleEdit = () => {
    setEditData(userData)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditData(userData)
    setIsEditing(false)
  }

  const handleSave = () => {
    setUserData(editData)
    setIsEditing(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value })
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-peacock mb-2">Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-in fade-in duration-300">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-green-700 font-medium">Profile updated successfully!</p>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gold/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-peacock to-peacock/90 p-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{userData.name}</h2>
                <p className="text-white/80">{userData.department}</p>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-foreground">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-4 py-2 text-peacock border border-peacock rounded-lg hover:bg-peacock hover:text-white transition-all text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-muted-foreground border border-muted rounded-lg hover:bg-muted transition-all text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-peacock/10 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-peacock" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{userData.name}</p>
                  )}
                </div>
              </div>

              {/* Email - Read Only */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">
                    Email Address <span className="text-xs">(Read-only)</span>
                  </label>
                  <p className="font-medium text-muted-foreground">{userData.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-saffron" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Contact Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{userData.phone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-lotus/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-lotus" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-muted-foreground mb-1">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all resize-none"
                    />
                  ) : (
                    <p className="font-medium text-foreground">{userData.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-muted/30 border-t border-gold/50">
            <p className="text-sm text-muted-foreground">
              Member since {userData.joinedDate}
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 border-2 border-destructive text-destructive rounded-xl hover:bg-destructive hover:text-white transition-all font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
