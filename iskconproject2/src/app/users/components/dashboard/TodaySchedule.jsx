'use client'

const statusStyles = {
  approved: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-saffron/20 text-saffron border-saffron/30',
  rejected: 'bg-red-100 text-red-700 border-red-200',
}

export default function TodaySchedule({ data = [], loading }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gold/50 overflow-hidden">
      <div className="p-4 border-b border-gold bg-muted/30">
        <h3 className="font-semibold text-peacock">Today&apos;s Schedule</h3>
      </div>

      {loading ? (
        <div className="p-6 text-center text-muted-foreground">Loading...</div>
      ) : data.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground">
          No bookings today 🙏
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gold/50">
                <th className="p-4 text-left text-sm">Time</th>
                <th className="p-4 text-left text-sm">Room</th>
                <th className="p-4 text-left text-sm">Purpose</th>
                <th className="p-4 text-left text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id} className="border-b border-gold/30">
                  <td className="p-4 text-sm">
                    {item.start_time} - {item.end_time}
                  </td>
                  <td className="p-4 text-sm">
                    {item.rooms?.name}
                  </td>
                  <td className="p-4 text-sm">
                    {item.purpose}
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${statusStyles[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
