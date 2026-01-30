'use client'

import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { Check, ChevronRight, Send } from 'lucide-react'

const rooms = [
  { id: 1, name: 'Conference Room A', capacity: 20 },
  { id: 2, name: 'Meeting Room B', capacity: 10 },
  { id: 3, name: 'Hall C', capacity: 50 },
  { id: 4, name: 'Training Room D', capacity: 30 },
  { id: 5, name: 'Small Meeting Room E', capacity: 6 },
  { id: 6, name: 'Board Room F', capacity: 15 },
]

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
]

const resources = [
  { id: 'projector', name: 'Projector', available: true },
  { id: 'whiteboard', name: 'Whiteboard', available: true },
  { id: 'video-conf', name: 'Video Conferencing', available: true },
  { id: 'sound', name: 'Sound System', available: true },
  { id: 'laptop', name: 'Laptop', available: true },
  { id: 'printer', name: 'Printer Access', available: true },
]

const purposes = [
  'Seva Meeting',
  'IT Training',
  'Devotee Orientation',
  'Weekly Review',
  'Guest Seminar',
  'Department Meeting',
  'Workshop',
  'Other',
]

const steps = [
  { id: 1, title: 'Select Room' },
  { id: 2, title: 'Date & Time' },
  { id: 3, title: 'Resources' },
  { id: 4, title: 'Purpose' },
]

export default function BookRoomPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    roomId: '',
    date: '',
    timeSlot: '',
    resources: [],
    purpose: '',
    customPurpose: '',
    attendees: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleRoomSelect = (roomId) => {
    setFormData({ ...formData, roomId })
  }

  const handleResourceToggle = (resourceId) => {
    const newResources = formData.resources.includes(resourceId)
      ? formData.resources.filter(r => r !== resourceId)
      : [...formData.resources, resourceId]
    setFormData({ ...formData, resources: newResources })
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.roomId !== ''
      case 2: return formData.date !== '' && formData.timeSlot !== ''
      case 3: return true
      case 4: return formData.purpose !== ''
      default: return false
    }
  }

  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-12">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-peacock mb-3">Booking Request Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your booking request has been submitted successfully. You will receive a notification once it is approved.
          </p>
          <div className="bg-saffron/10 rounded-xl p-4 mb-6 border border-saffron/30">
            <p className="text-sm text-foreground">
              <strong>Room:</strong> {rooms.find(r => r.id.toString() === formData.roomId)?.name}<br />
              <strong>Date:</strong> {formData.date}<br />
              <strong>Time:</strong> {formData.timeSlot}
            </p>
          </div>
          <a 
            href="/my-bookings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-peacock text-white rounded-lg hover:bg-peacock/90 transition-all font-medium"
          >
            View My Bookings
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-peacock mb-2">Book a Room</h1>
          <p className="text-muted-foreground">Complete the steps below to submit your booking request</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gold/50 mb-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.id 
                      ? 'bg-green-500 text-white' 
                      : currentStep === step.id 
                        ? 'bg-peacock text-white' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={`ml-3 font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 lg:w-24 h-1 mx-2 sm:mx-4 rounded ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gold/50 mb-6">
          {/* Step 1: Select Room */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Select a Room</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoomSelect(room.id.toString())}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.roomId === room.id.toString()
                        ? 'border-peacock bg-peacock/5'
                        : 'border-gold/50 hover:border-peacock/50'
                    }`}
                  >
                    <h3 className="font-semibold text-foreground">{room.name}</h3>
                    <p className="text-sm text-muted-foreground">Capacity: {room.capacity} people</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Select Date & Time</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Time Slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setFormData({ ...formData, timeSlot: slot })}
                        className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                          formData.timeSlot === slot
                            ? 'border-peacock bg-peacock text-white'
                            : 'border-gold/50 hover:border-peacock/50 text-foreground'
                        }`}
                      >
                        {slot.split(' - ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Resources */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Select Resources (Optional)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {resources.map((resource) => (
                  <button
                    key={resource.id}
                    onClick={() => handleResourceToggle(resource.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.resources.includes(resource.id)
                        ? 'border-peacock bg-peacock/5'
                        : 'border-gold/50 hover:border-peacock/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        formData.resources.includes(resource.id)
                          ? 'border-peacock bg-peacock'
                          : 'border-muted-foreground'
                      }`}>
                        {formData.resources.includes(resource.id) && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="font-medium text-foreground">{resource.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Purpose */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Select Purpose</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {purposes.map((purpose) => (
                    <button
                      key={purpose}
                      onClick={() => setFormData({ ...formData, purpose })}
                      className={`px-4 py-2.5 rounded-lg border text-sm transition-all ${
                        formData.purpose === purpose
                          ? 'border-peacock bg-peacock text-white'
                          : 'border-gold/50 hover:border-peacock/50 text-foreground'
                      }`}
                    >
                      {purpose}
                    </button>
                  ))}
                </div>
                {formData.purpose === 'Other' && (
                  <input
                    type="text"
                    placeholder="Please specify the purpose"
                    value={formData.customPurpose}
                    onChange={(e) => setFormData({ ...formData, customPurpose: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all"
                  />
                )}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Expected Attendees</label>
                  <input
                    type="number"
                    placeholder="Number of attendees"
                    value={formData.attendees}
                    onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Additional Notes</label>
                  <textarea
                    placeholder="Any special requirements or notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-lg border border-gold focus:border-peacock focus:ring-2 focus:ring-peacock/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2.5 border border-peacock text-peacock rounded-lg hover:bg-peacock hover:text-white transition-all font-medium"
              >
                Back
              </button>
            )}
          </div>
          <div className="flex gap-3">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-peacock text-white rounded-lg hover:bg-peacock/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-2.5 bg-saffron text-white rounded-lg hover:bg-saffron/90 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                Submit Request
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
