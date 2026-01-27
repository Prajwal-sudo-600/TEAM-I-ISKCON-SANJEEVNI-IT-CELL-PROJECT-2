'use client'

import DashboardLayout from '../components/layout/DashboardLayout'
import BackButton from '../components/layout/BackButton'
import { BookOpen, Clock, Heart, AlertCircle, Quote } from 'lucide-react'

const guidelinesData = [
  {
    icon: BookOpen,
    title: 'Booking Discipline',
    color: 'bg-peacock',
    items: [
      'Submit booking requests at least 24 hours in advance',
      'Provide accurate information about the purpose and expected attendees',
      'Cancel bookings at least 4 hours before the scheduled time if not needed',
      'Do not book rooms for personal use without proper authorization',
      'Respect the booking system - first come, first served basis applies',
    ],
  },
  {
    icon: Clock,
    title: 'Time Responsibility',
    color: 'bg-saffron',
    items: [
      'Arrive at least 5 minutes before your scheduled booking time',
      'Start and end meetings on time to respect the next booking',
      'Vacate the room 5-10 minutes before the booking ends',
      'Inform the IT Cell immediately if you are running late or need to extend',
      'Do not exceed your booked time slot without prior approval',
    ],
  },
  {
    icon: Heart,
    title: 'Seva Etiquette',
    color: 'bg-lotus',
    items: [
      'Maintain cleanliness - leave the room as you found it',
      'Handle all equipment and furniture with care',
      'Report any damages or issues immediately to the IT Cell',
      'Keep noise levels appropriate for the building',
      'Be courteous to other devotees using adjacent rooms',
      'Practice gratitude - every booking is an opportunity for seva',
    ],
  },
  {
    icon: AlertCircle,
    title: 'Important Reminders',
    color: 'bg-peacock',
    items: [
      'All bookings are subject to approval by the IT Cell administrator',
      'Emergency bookings may be accommodated based on availability',
      'Repeated no-shows may result in booking restrictions',
      'Food and prasadam are only allowed in designated areas',
      'Keep all electronic devices on silent mode during meetings',
      'Report any technical issues with projectors or AV equipment',
    ],
  },
]

export default function GuidelinesPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-peacock mb-2">Guidelines</h1>
          <p className="text-muted-foreground">Room booking and usage guidelines for all devotees</p>
        </div>

        {/* Guidelines Cards */}
        <div className="space-y-6">
          {guidelinesData.map((guideline, index) => {
            const Icon = guideline.icon
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gold/50 overflow-hidden"
              >
                <div className={`${guideline.color} px-5 py-4 flex items-center gap-3`}>
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">{guideline.title}</h2>
                </div>
                <div className="p-5">
                  <ul className="space-y-3">
                    {guideline.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-saffron mt-2 shrink-0" />
                        <span className="text-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer Quote */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gold/50">
          <div className="flex items-start gap-4">
            <div className="bg-saffron/20 p-3 rounded-lg shrink-0">
              <Quote className="w-5 h-5 text-saffron" />
            </div>
            <div>
              <p className="text-foreground italic text-lg leading-relaxed">
                &ldquo;Discipline is also devotion.&rdquo;
              </p>
              <p className="text-peacock font-medium mt-3">
                &mdash; Following these guidelines is seva to the community
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-gold/30 text-center">
          <p className="text-sm text-muted-foreground">
            For questions or clarifications, please contact the IT Cell at{' '}
            <span className="text-peacock font-medium">itcell@isckonsanjeevani.org</span>
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
