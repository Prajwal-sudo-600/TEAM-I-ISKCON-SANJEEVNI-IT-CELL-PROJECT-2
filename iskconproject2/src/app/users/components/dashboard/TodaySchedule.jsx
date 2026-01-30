'use client'

const scheduleData = [
  {
    time: '09:00 AM - 10:00 AM',
    room: 'Conference Room A',
    purpose: 'Morning Seva Meeting',
    status: 'ongoing',
  },
  {
    time: '11:00 AM - 12:30 PM',
    room: 'Meeting Room B',
    purpose: 'IT Training Session',
    status: 'upcoming',
  },
  {
    time: '02:00 PM - 03:00 PM',
    room: 'Hall C',
    purpose: 'Devotee Orientation',
    status: 'upcoming',
  },
  {
    time: '04:00 PM - 05:30 PM',
    room: 'Conference Room A',
    purpose: 'Weekly Review',
    status: 'upcoming',
  },
]

const statusStyles = {
  ongoing: 'bg-green-100 text-green-700 border-green-200',
  upcoming: 'bg-saffron/20 text-saffron border-saffron/30',
  completed: 'bg-muted text-muted-foreground border-muted',
}

export default function TodaySchedule() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gold/50 overflow-hidden">
      <div className="p-4 border-b border-gold bg-muted/30">
        <h3 className="font-semibold text-peacock">Today&apos;s Schedule</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gold/50">
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Time</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Room</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Purpose</th>
              <th className="text-left p-4 text-sm font-semibold text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((item, index) => (
              <tr key={index} className="border-b border-gold/30 last:border-0 hover:bg-muted/20 transition-colors">
                <td className="p-4 text-sm font-medium text-foreground">{item.time}</td>
                <td className="p-4 text-sm text-foreground">{item.room}</td>
                <td className="p-4 text-sm text-muted-foreground">{item.purpose}</td>
                <td className="p-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[item.status]}`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
